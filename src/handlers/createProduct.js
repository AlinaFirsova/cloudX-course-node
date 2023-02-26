import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

import { headers } from "../../constants";

const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;

const validateProductCreationInput = (description, count, title, price) => {
  const areAllArgumentsPresent = description && count && title && price;
  if (!areAllArgumentsPresent) throw Error;
};

export const main = async (event) => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  try {
    const { description, count, title, price } = JSON.parse(event.body);
    const id = uuidv4();

    validateProductCreationInput(description, count, title, price);

    try {
      await client.connect();
      console.log(
        `Starting transaction for product creation with description = ${description}, title = ${title}, price = ${price}, count = ${count} and id = ${id}...`
      );
      await client.query("BEGIN");

      const insertProductQuery =
        "INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)";
      await client.query(insertProductQuery, [id, title, description, price]);

      const insertStockQuery =
        "INSERT INTO stocks(product_id, count) VALUES($1, $2)";
      await client.query(insertStockQuery, [id, count]);

      await client.query("COMMIT");
      console.log(`Product with id ${id} was successfully added`);

      return {
        statusCode: 200,
        headers,
        body: id,
      };
    } catch (e) {
      const errorMessage = e.message || e;
      console.error("ERROR: Product wasn't added:", errorMessage);

      await client.query("ROLLBACK");

      return {
        statusCode: 500,
        headers,
        body: `The server couldn't process this request: ${errorMessage}`,
      };
    } finally {
      await client.end();
      console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);
    }
  } catch {
    console.error(
      "Not all required arguments were provided (title, description, price, count)"
    );

    return {
      statusCode: 400,
      headers,
      body:
        "Not all required arguments were provided (title, description, price, count)",
    };
  }
};
