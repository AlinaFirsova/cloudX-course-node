import { PublishCommand } from "@aws-sdk/client-sns";

import client from "./SNSClient";

const TOPIC_ARN = process.env.TOPIC_ARN;

export const publishMessage = async (message) => {
  const publishMessageCommandInput = {
    Message: JSON.stringify(message),
    TopicArn: TOPIC_ARN
  };

  await client.send(new PublishCommand(publishMessageCommandInput));
}