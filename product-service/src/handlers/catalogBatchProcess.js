import { createProduct } from "../../DBCommands";
import { publishMessage } from "../../SNSCommands";
import { validateProductCreationInput } from "../../utils";

export const main = async ({ Records }) => {
    let errors = false;

    for (const record of Records) {
      try {
        console.log(`Starting to process a record ${record.body}...`);
        const { description, count, title, price } = JSON.parse(record.body);

        validateProductCreationInput(description, count, title, price);

        await createProduct({ description, count, title, price });
        console.log("Record was successfully processed");
      } catch (e) {
        const errorMessage = e.message || e;
        console.log("ERROR: Record processing was failed: ", errorMessage);
        errors = true;
      }
    }

    const description = errors
      ? "Some errors occurred. You can find more information in CloudWatch logs."
      : "No errors occurred.";

    await publishMessage({
      message: `All records were processed. ${description}`,
      errors,
    });
};
