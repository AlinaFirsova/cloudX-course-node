import { headers } from "../../constants";
import { putObject } from "../../S3ObjectCommands";

export const main = async (event) => {
  try {
    const {
      queryStringParameters: { name },
    } = event;

    if (!name) {
      return {
        statusCode: 400,
        headers,
        body: "File name wasn't provided",
      };
    }

    console.log(`Starting signed url creation for the file ${name}...`);
    const url = await putObject(`uploaded/${name}`);
    console.log(`Signed url for the file ${name} was successfully created`);

    return {
      statusCode: 200,
      headers,
      body: url,
    };
  } catch (e) {
    const errorMessage = e.message || e;
    console.error("ERROR: Can't import the file: ", errorMessage);

    return {
      statusCode: 500,
      headers,
      body: `The server couldn't process this request: ${errorMessage}`,
    };
  }
};
