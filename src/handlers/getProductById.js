import products from "../../products";
import { headers } from "../../constants";

export const main = async (event) => {
    try {
      const { productId } = event.pathParameters;
      const product = products.find(({ id }) => id === productId);
      const statusCode = product ? 200 : 404;
      const notFoundMessage = `Error: Can't fing product with id ${productId}`;
      const body = product ? JSON.stringify(product) : notFoundMessage;

      return {
        statusCode,
        headers,
        body,
      };
    } catch(e) {
      return {
        statusCode: 500,
        headers,
        body: `The server couldn't process this request: ${e}`,
      };
    }
};
