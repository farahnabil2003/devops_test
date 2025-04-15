#!/bin/bash

# Exit on error
set -e

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI could not be found. Please install the AWS CLI."
    exit 1
fi

# Check if eksctl is installed
if ! command -v eksctl &> /dev/null; then
    echo "eksctl could not be found. Please install eksctl."
    exit 1
fi

# Set AWS configuration
AWS_REGION="us-east-1"
CLUSTER_NAME="event-driven-cluster"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create EKS cluster (using free tier eligible resources)
echo "Creating EKS cluster..."
eksctl create cluster \
    --name $CLUSTER_NAME \
    --region $AWS_REGION \
    --node-type t3.small \
    --nodes 1 \
    --nodes-min 1 \
    --nodes-max 2 \
    --managed

# Create ECR repository
echo "Creating ECR repository..."
aws ecr create-repository \
    --repository-name event-driven-microservice \
    --region $AWS_REGION || true

# Authenticate Docker to ECR
echo "Authenticating Docker to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push Docker image
echo "Building Docker image..."
docker build -t event-driven-microservice:latest .

echo "Tagging and pushing Docker image..."
docker tag event-driven-microservice:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/event-driven-microservice:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/event-driven-microservice:latest

# Update deployment with AWS account ID and region
echo "Updating deployment configuration..."
sed -i.bak "s/\${AWS_ACCOUNT_ID}/$AWS_ACCOUNT_ID/g" k8s/aws-deployment.yaml
sed -i.bak "s/\${AWS_REGION}/$AWS_REGION/g" k8s/aws-deployment.yaml

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/production-config.yaml
kubectl apply -f k8s/infrastructure.yaml
kubectl apply -f k8s/aws-deployment.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/mongodb --timeout=300s
kubectl wait --for=condition=available deployment/user-activity-service --timeout=300s

# Get the external hostname
echo "Getting external hostname..."
EXTERNAL_HOSTNAME=$(kubectl get service user-activity-service -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')

echo "Deployment complete!"
echo "Service is available at: http://$EXTERNAL_HOSTNAME" 