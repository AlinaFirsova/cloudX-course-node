import {
  GetObjectCommand,
  PutObjectCommand,
  CopyObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3Client from "./s3Client";

const BUCKET_NAME = process.env.BUCKET_NAME;

export const putObject = async (Key) => {
  const putObjectCommandParams = {
    Bucket: BUCKET_NAME,
    Key,
  };
  const command = new PutObjectCommand(putObjectCommandParams);
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return signedUrl;
};

export const getObject = async (fileKey) => {
  const getObjectCommandParams = {
    Bucket: BUCKET_NAME,
    Key: fileKey,
  };
  const command = new GetObjectCommand(getObjectCommandParams);
  const object = await s3Client.send(command);

  return object;
};

export const copyObject = async (fileKey, destinationFileKey) => {
  const copyObjectCommandParams = {
    Bucket: BUCKET_NAME,
    CopySource: `${BUCKET_NAME}/${fileKey}`,
    Key: destinationFileKey,
  };
  const command = new CopyObjectCommand(copyObjectCommandParams);
  await s3Client.send(command);
};

export const deleteObject = async (Key) => {
  const deleteObjectCommandParams = {
    Bucket: BUCKET_NAME,
    Key,
  };
  const command = new DeleteObjectCommand(deleteObjectCommandParams);
  await s3Client.send(command);
};
