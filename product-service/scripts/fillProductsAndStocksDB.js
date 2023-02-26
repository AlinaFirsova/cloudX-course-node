import { Client } from "pg";
import products from "../products";

const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;

const client = new Client({
  host: PRODUCTS_DB_HOST,
  port: PRODUCTS_DB_PORT,
  user: PRODUCTS_DB_USER,
  password: PRODUCTS_DB_PASSWORD,
});

(async () => {
  try {
    await client.connect();
    console.log(`Successful connection to the DB ${PRODUCTS_DB_HOST}`);

    for (const product of products) {
      const { title, price, description, id, count } = product;

      try {
        console.log(`Starting transaction for product id ${id}...`);
        await client.query("BEGIN");

        const insertProductQuery =
          "INSERT INTO products(id, title, description, price) VALUES($1, $2, $3, $4)";
        await client.query(insertProductQuery, [id, title, description, price]);

        const insertStockQuery =
          "INSERT INTO stocks(product_id, count) VALUES($1, $2)";
        await client.query(insertStockQuery, [id, count]);

        await client.query("COMMIT");
        console.log(`Product with id ${id} was successfully added`);
      } catch (e) {
        await client.query("ROLLBACK");
        console.error(`ERROR: Product with id ${id} wasn't added`, e.message);
      }
    }
  } catch (e) {
    console.error(
      `ERROR: Can't connect to the DB ${PRODUCTS_DB_HOST}`,
      e.message
    );
  } finally {
    client.end();
    console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);
  }
})();
