import { createProduct } from "../../DBCommands";
import { headers } from "../../constants";
import { validateProductCreationInput } from "../../utils";

export const main = async (event) => {
  try {
    const { description, count, title, price } = JSON.parse(event.body);
    validateProductCreationInput(description, count, title, price);

    try {
      const id = await createProduct({ description, count, title, price });

      return {
        statusCode: 200,
        headers,
        body: id,
      };
    } catch (e) {
      const errorMessage = e.message || e;
      console.error("ERROR: Product wasn't added:", errorMessage);

      return {
        statusCode: 500,
        headers,
        body: `The server couldn't process this request: ${errorMessage}`,
      };
    }
  } catch(validationError) {
    return {
      statusCode: 400,
      headers,
      body: validationError
    };
  }
};
