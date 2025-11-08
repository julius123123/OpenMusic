const amqplib = require('amqplib');

const ProducerService = {
    sendMessage: async (queue, message) => {
        const conn = await amqplib.connect(process.env.RABBITMQ_SERVER);
        const channel = conn.createChannel();

        (await channel).assertQueue(queue, {
            durable:true,
        });

        (await channel).sendToQueue(queue, Buffer.from(message));

        setTimeout(() => {
            conn.close();
        }, 1000);
    }
};

module.exports = ProducerService;