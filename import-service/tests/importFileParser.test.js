import "aws-sdk-client-mock-jest";
import { mockClient } from "aws-sdk-client-mock";
import {
  S3Client,
  GetObjectCommand,
  CopyObjectCommand,
} from "@aws-sdk/client-s3";
import { ObjectReadableMock } from "stream-mock";

import { main as importFileParser } from "../src/handlers/importFileParser";

const mockEvent = {
  Records: [
    {
      s3: {
        object: {
          key: "uploaded/products.csv",
        },
      },
    },
  ],
};

const Bucket = process.env.BUCKET_NAME;

const copyObjectCommandInputMock = {
  Bucket,
  CopySource: `${Bucket}/uploaded/products.csv`,
  Key: "parsed/products.csv",
};

test("Should get, parse and copy a file", async () => {
  const s3ClientMock = mockClient(S3Client);

  s3ClientMock
    .on(GetObjectCommand)
    .resolves({ Body: new ObjectReadableMock("mock") });

  await importFileParser(mockEvent);

  expect(s3ClientMock).toHaveReceivedCommand(GetObjectCommand);
  expect(s3ClientMock).toHaveReceivedCommandWith(
    CopyObjectCommand,
    copyObjectCommandInputMock
  );
});
