import { generatePolicy } from "../utils";

export const main = async (event, context, callback) => {
  try {
    const { authorizationToken, methodArn } = event;
    console.log(`Authorization token: ${authorizationToken}`);

    const [, token] = authorizationToken.split(" ");
    const [username, password] = atob(token).split(":");

    console.log(
      `Received credentials: username - ${username}, password - ${password}`
    );

    const storedPassword = process.env[username];
    const effect =
      storedPassword && storedPassword === password ? "Allow" : "Deny";
    const policy = generatePolicy("user", methodArn, effect);

    callback(null, policy);
  } catch (e) {
    callback("User in unauthorized");
  }
};
