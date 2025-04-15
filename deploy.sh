#!/bin/bash

# Exit on error
set -e

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "gcloud could not be found. Please install the Google Cloud SDK."
    exit 1
fi

# Set project ID (replace with your project ID)
PROJECT_ID="your-project-id"
CLUSTER_NAME="event-driven-cluster"
REGION="us-central1"

# Authenticate with GCP
echo "Authenticating with GCP..."
gcloud auth login

# Set the project
echo "Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Create a GKE cluster (free tier eligible)
echo "Creating GKE cluster..."
gcloud container clusters create $CLUSTER_NAME \
    --region $REGION \
    --num-nodes 1 \
    --machine-type e2-small \
    --disk-size 10GB

# Get cluster credentials
echo "Getting cluster credentials..."
gcloud container clusters get-credentials $CLUSTER_NAME --region $REGION

# Build and push Docker image
echo "Building Docker image..."
docker build -t gcr.io/$PROJECT_ID/event-driven-microservice:latest .

echo "Pushing Docker image to GCR..."
docker push gcr.io/$PROJECT_ID/event-driven-microservice:latest

# Apply Kubernetes configurations
echo "Applying Kubernetes configurations..."
kubectl apply -f k8s/production-config.yaml
kubectl apply -f k8s/infrastructure.yaml
kubectl apply -f k8s/deployment.yaml

# Wait for deployments to be ready
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available deployment/mongodb --timeout=300s
kubectl wait --for=condition=available deployment/user-activity-service --timeout=300s

# Get the external IP
echo "Getting external IP..."
EXTERNAL_IP=$(kubectl get service user-activity-service -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

echo "Deployment complete!"
echo "Service is available at: http://$EXTERNAL_IP" 