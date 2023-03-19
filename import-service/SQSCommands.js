import { SendMessageCommand } from "@aws-sdk/client-sqs";

import client from "./SQSClient";

const QUERY_URL = process.env.QUERY_URL;

export const sendMessage = async (message) => {
  const MessageBody = JSON.stringify(message);
  console.log(`Sending a message ${MessageBody} to SQS...`);

  const command = new SendMessageCommand({
    QueueUrl: QUERY_URL,
    MessageBody
  });

  const response = await client.send(command);
  console.log("Message was sent successfully");
  return response;
};