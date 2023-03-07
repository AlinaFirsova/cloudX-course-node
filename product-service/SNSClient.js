import  { SNSClient } from "@aws-sdk/client-sns";

const REGION = "eu-west-1";

const client = new SNSClient({ region: REGION });

export default client;