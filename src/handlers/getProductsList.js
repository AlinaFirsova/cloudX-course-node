import products from "../../products";

export const main = async () => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify(products),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: `The server couldn't process this request: ${e}`,
    };
  }
};
