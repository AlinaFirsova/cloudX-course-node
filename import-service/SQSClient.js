import { SQSClient } from "@aws-sdk/client-sqs";

const REGION = "eu-west-1";

const client = new SQSClient({ region: REGION });

export default client;
