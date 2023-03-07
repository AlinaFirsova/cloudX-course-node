import { getAllProducts } from "../../DBCommands";
import { headers } from "../../constants";

export const main = async () => {
  try {
    const products = await getAllProducts();
  
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(products),
    };
  } catch (e) {
    const errorMessage = e.message || e;
    console.error(
      "ERROR: Can't fetch products:",
      errorMessage
    );

    return {
      statusCode: 500,
      headers,
      body: `The server couldn't process this request: ${errorMessage}`,
    };
  }
};
