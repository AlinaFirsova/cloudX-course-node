import products from "../../products";
import { headers } from "../../constants";

export const main = async () => {
  try {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: `The server couldn't process this request: ${e}`,
    };
  }
};
