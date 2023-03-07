export const validateProductCreationInput = (description, count, title, price) => {
  const areAllArgumentsPresent = description && String(count) && title && String(price);
  if (!areAllArgumentsPresent) throw "Not all required arguments were provided: description, count, title, price";
};