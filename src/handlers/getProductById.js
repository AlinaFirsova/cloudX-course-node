import products from "../../products";

export const main = async (event) => {
    try {
      const { productId } = event.pathParameters;
      const product = products.find(({ id }) => id === productId);
      const statusCode = product ? 200 : 404;
      const notFoundMessage = `Error: Can't fing product with id ${productId}`;
      const body = product ? JSON.stringify(product) : notFoundMessage;

      return {
        statusCode,
        body,
      };
    } catch(e) {
      return {
        statusCode: 500,
        body: `The server couldn't process this request: ${e}`,
      };
    }
};
