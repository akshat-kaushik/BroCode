import amqp from "amqplib";
import { executePythonCode } from "./k8s";

const CODE_QUEUE = "code_queue";
const RESULT_QUEUE = "result_queue";

async function startWorker() {
  let connection: amqp.Connection;
  let channel: amqp.Channel;

  try {
    connection = await amqp.connect("amqp://localhost:5672");
    channel = await connection.createChannel();

    await channel.assertQueue(CODE_QUEUE, { durable: true });
    await channel.assertQueue(RESULT_QUEUE, { durable: true });

    console.log("Worker is ready, waiting for messages...");

    channel.consume(
      CODE_QUEUE,
      async (msg) => {
        if (msg !== null) {
          const code = msg.content.toString();
          const correlationId = msg.properties.correlationId;
          const replyTo = msg.properties.replyTo;

          console.log("Received code:", code);

          try {
            
            const result = await executePythonCode(code, "");

            console.log("Execution result:", result);

           
            channel.sendToQueue(replyTo, Buffer.from(result), {
              correlationId: correlationId,
            });
          } catch (error) {
            console.error("Error executing code:", error);
          }

          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in worker:", error);
  }
}

startWorker();
