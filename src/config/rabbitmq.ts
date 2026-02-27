// import amqp, { Channel, ChannelModel } from "amqplib";

// let channelModel: ChannelModel | null = null;
// let channel: Channel | null = null;

// const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// export const connectRabbitMQ = async (): Promise<Channel> => {
//   if (channel) return channel;

//   try {
//     channelModel = await amqp.connect(RABBITMQ_URL);
//     channel = await channelModel.createChannel();

//     console.log("✅ RabbitMQ connected");
//     return channel;
//   } catch (error) {
//     console.error("❌ RabbitMQ connection failed:", error);
//     throw error;
//   }
// };

// export const getChannel = (): Channel => {
//   if (!channel) {
//     throw new Error("RabbitMQ channel not initialized");
//   }
//   return channel;
// };

// export const closeRabbitMQ = async () => {
//   try {
//     if (channel) await channel.close();
//     if (channelModel) await channelModel.close(); // ✅ CORRECT
//     console.log("RabbitMQ connection closed gracefully");
//   } catch (err) {
//     console.error("Error closing RabbitMQ:", err);
//   }
// };


// import { connect, Channel, ChannelModel } from "amqplib";


// let channelModel: ChannelModel | null = null;
// let channel: Channel | null = null;

// const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// export const connectRabbitMQ = async () => {
//   if (channel) return channel;
//   try {
//     const connection = await connect(RABBITMQ_URL);
//     channelModel = connection
//     channel = await channelModel.createChannel();

//     await channel.assertQueue("notification", { durable: true });

//     console.log("✅ RabbitMQ connected");
//     return channel;
//   } catch (error) {
//     console.error("❌ RabbitMQ connection failed:", error);
//     throw error;
//   }
// }


import amqplib, { Channel, ChannelModel } from 'amqplib'

let connection: ChannelModel  // ✅ was Connection
let channel: Channel

export const connectRabbitMQ = async (): Promise<void> => {
    const RABBIT_URL = 'amqp://localhost'

    try {
        connection = await amqplib.connect(RABBIT_URL);
        channel = await connection.createChannel();
        console.log('Connected to RabbitMQ')
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error)
        process.exit(1)
    }
}

export const getRabbitChannel = (): Channel => {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized")
    }

    return channel
}

export const closeRabbitMQ = async (): Promise<void> => {
    try {
        await channel.close()
        await connection.close()
    } catch (error) {
        console.error("Error closing RabbitMQ connection", error)
    }
}