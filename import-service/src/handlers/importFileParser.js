import csv from "csv-parser";

import { getObject, copyObject, deleteObject } from "../../S3ObjectCommands";
import { sendMessage } from "../../SQSCommands";

export const main = async (event) => {
  try {
    for (const { s3: { object } } of event.Records) {
      const { key: fileKey } = object;

      console.log(`Trying to fetch object ${fileKey}...`);
      const { Body: readableStream } = await getObject(fileKey);
      console.log(`Object ${fileKey} was fetched successfully`);

      console.log(`Trying to parse object ${fileKey}...`);

      await new Promise((resolve, reject) => {
        const onData = async (data) => {
          await sendMessage(data);
        };
        const onError = (error) => reject(error);
        const onEnd = () => { 
          console.log(`Object ${fileKey} was parsed successfully`); 
          resolve(); 
        };

        readableStream
          .pipe(csv())
          .on("data", onData)
          .on("end", onEnd)
          .on("error", onError);
      });


      console.log("Moving object from uploaded/ folder to parsed/ folder...");

      const fileDestinationKey = fileKey.replace("uploaded", "parsed");

      await copyObject(fileKey, fileDestinationKey);
      await deleteObject(fileKey);

      console.log("Object was moved successfully");
    }
  } catch (e) {
    console.error("Error whle parsing data: ", e);
  }
};
