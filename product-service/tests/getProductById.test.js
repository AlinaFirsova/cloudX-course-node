import { main as getProductById } from "../src/handlers/getProductById";
import products from "../products";

test("Should receive product by Id", async () => {
  const mockProductId = "05149475-7699-43bb-9c03-9c6c6e43bdc3";
  const mockEvent = {
    pathParameters: {
      productId: mockProductId,
    },
  };
  const mockProduct = products.find(({ id }) => id === mockProductId);

  const { statusCode, body } = await getProductById(mockEvent);

  expect(statusCode).toBe(200);
  expect(body).toBe(JSON.stringify(mockProduct));
});

test("Should receive statusCode 500 if pathParameters === undefined ", async () => {
  const { statusCode } = await getProductById({});

  expect(statusCode).toBe(500);
});

test("Should receive statusCode 404 if product wasn't found", async () => {
  const mockProductId = "NOT_FOUND";
  const errorMessage = `Error: Can't fing product with id ${mockProductId}`;
  const mockEvent = {
    pathParameters: {
      productId: mockProductId,
    },
  };

  const { statusCode, body } = await getProductById(mockEvent);

  expect(statusCode).toBe(404);
  expect(body).toBe(errorMessage);
});

