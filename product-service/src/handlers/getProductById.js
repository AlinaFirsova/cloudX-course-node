import { getProduct } from "../../DBCommands";
import { headers } from "../../constants";

export const main = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getProduct(productId);

    const statusCode = product ? 200 : 404;
    const notFoundMessage = `Error: Can't fing product with id ${productId}`;
    const body = product ? JSON.stringify(product) : notFoundMessage;

    console.log(
      `Product with id ${productId} was successfully fetched: ${product}`
    );
    return {
      statusCode,
      headers,
      body,
    };
  } catch (e) {
    const errorMessage = e.message || e;
    console.error("ERROR: Can't fetch the product:", errorMessage);

    return {
      statusCode: 500,
      headers,
      body: `The server couldn't process this request: ${errorMessage}`,
    };
  }
};
