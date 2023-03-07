import "aws-sdk-client-mock-jest";
import { Client } from "pg";
import { mockClient } from "aws-sdk-client-mock";
import { PublishCommand } from "@aws-sdk/client-sns";

import { main as catalogBatchProcess } from "../src/handlers/catalogBatchProcess";
import client from "../SNSClient";

jest.mock("pg", () => {
  const mockClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mockClient) };
});

const SNSMock = mockClient(client);

const TOPIC_ARN = process.env.TOPIC_ARN;

test("Shouldn't create a product if not required arguments were provided", async () => {
  const mockEvent = {
    Records: [{ body: JSON.stringify({}) }],
  };
  const mockSNSMessage = {
    Message: JSON.stringify({
      message:
        "All records were processed. Some errors occurred. You can find more information in CloudWatch logs.",
      errors: true,
    }),
    TopicArn: TOPIC_ARN,
  };
  const spy = jest.spyOn(Client(), "query");

  await catalogBatchProcess(mockEvent);

  expect(spy).not.toBeCalled();
  expect(SNSMock).toHaveReceivedCommandWith(PublishCommand, mockSNSMessage);
});

test("Shouldn create a product and send a message to SNS", async () => {
  const mockEvent = {
    Records: [
      {
        body: JSON.stringify({
          title: "mockTitle",
          description: "mockDescription",
          count: 0,
          price: 0,
        }),
      },
    ],
  };
  const mockSNSMessage = {
    Message: JSON.stringify({
      message: "All records were processed. No errors occurred.",
      errors: false,
    }),
    TopicArn: TOPIC_ARN,
  };
  const spy = jest.spyOn(Client(), "query");

  await catalogBatchProcess(mockEvent);

  expect(spy).toBeCalled();
  expect(SNSMock).toHaveReceivedCommandWith(PublishCommand, mockSNSMessage);
});
