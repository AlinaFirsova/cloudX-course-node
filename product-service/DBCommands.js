import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

const PRODUCTS_DB_HOST = process.env.PRODUCTS_DB_HOST;
const PRODUCTS_DB_PORT = process.env.PRODUCTS_DB_PORT || 5432;
const PRODUCTS_DB_USER = process.env.PRODUCTS_DB_USER;
const PRODUCTS_DB_PASSWORD = process.env.PRODUCTS_DB_PASSWORD;

export const getAllProducts = async () => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  await client.connect();
  console.log(`Successful connection to the DB ${PRODUCTS_DB_HOST}`);
  console.log("Fetching all products...");

  const getProductsQuery =
    "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id";
  const { rows: products } = await client.query(getProductsQuery);

  console.log("Products were successfully fetched");

  await client.end();
  console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);

  return products;
}

export const getProduct = async (uuid) => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  await client.connect();
  console.log(`Successful connection to the DB ${PRODUCTS_DB_HOST}`);
  console.log(`Fetching product with id ${uuid}...`);

  const getProductQuery =
    "SELECT * FROM products INNER JOIN stocks ON products.id = stocks.product_id WHERE products.id=$1";
  const { rows: products } = await client.query(getProductQuery, [uuid]);
   
  const product = products.pop();

  await client.end();
  console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);

  return product;
}

export const createProduct = async ({ description, count, title, price }) => {
  const client = new Client({
    host: PRODUCTS_DB_HOST,
    port: PRODUCTS_DB_PORT,
    user: PRODUCTS_DB_USER,
    password: PRODUCTS_DB_PASSWORD,
  });

  try {
    await client.connect();
    const id = uuidv4();
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
  
    await client.end();
    console.log(`Connection to the DB ${PRODUCTS_DB_HOST} was closed`);

    return id;

  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  }
}