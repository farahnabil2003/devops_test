const { Kafka } = require('kafkajs');
const config = require('../../config');

class KafkaService {
  constructor() {
    this.kafka = new Kafka({
      clientId: config.kafka.clientId,
      brokers: config.kafka.brokers.split(',')
    });
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: config.kafka.groupId });
  }

  async connect() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  async disconnect() {
    await this.producer.disconnect();
    await this.consumer.disconnect();
  }

  async produce(topic, messages) {
    await this.producer.send({
      topic,
      messages: Array.isArray(messages) ? messages : [messages]
    });
  }

  async consume(topic, callback) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const value = JSON.parse(message.value.toString());
          await callback(value);
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    });
  }
}

module.exports = KafkaService; 