export const generatePolicy = (principalId, Resource, Effect) => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Resource,
        Effect,
        Action: "execute-api:Invoke",
      },
    ],
  },
  context: {}
});
