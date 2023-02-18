import { Client } from "pg";
import { headers } from "../../constants";

const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;

export const main = async (event) => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  try {
    const { productId } = event.pathParameters;
    await client.connect();
    console.log(`Successful connection to the DB ${PRODUCTS_DB_HOST}`);
    console.log(`Fetching product with id ${productId}...`);

    const getProductQuery =
      "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id WHERE products.id=$1";
    const { rows: products } = await client.query(getProductQuery, [productId]);
    const product = products.pop();

    const statusCode = product ? 200 : 404;
    const notFoundMessage = `Error: Can't fing product with id ${productId}`;
    const body = product ? JSON.stringify(product) : notFoundMessage;

    console.log(`Product with id ${productId} was successfully fetched: ${product}`);
    return {
      statusCode,
      headers,
      body,
    };
  } catch (e) {
    const errorMessage = e.message || e;
    console.error(
      "ERROR: Can't fetch the product:",
      errorMessage
    );

    return {
      statusCode: 500,
      headers,
      body: `The server couldn't process this request: ${errorMessage}`,
    };
  } finally {
    client.end();
    console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);
  }
};
