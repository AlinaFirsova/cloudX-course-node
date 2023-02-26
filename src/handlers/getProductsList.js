import { Client } from "pg";
import { headers } from "../../constants";

const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;

export const main = async () => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  try {
    await client.connect();
    console.log(`Successful connection to the DB ${PRODUCTS_DB_HOST}`);
    console.log("Fetching all products...");

    const getProductsQuery =
      "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id";
    const { rows: products } = await client.query(getProductsQuery);

    console.log("Products were successfully fetched");
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
  } finally {
    client.end();
    console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);
  }
};
