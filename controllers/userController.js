const User = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOrCreateUser = async (token) => {
  // verify the auth token
  const googleUser = await verifyAuthToken(token);
  // check if user exists, returns undefined ot the user
  const user = await checkIfUserExists(googleUser.email);

  return user
    ? // if user exists, return it
      user
    : // if not , create user in DBB
      createNewUser(googleUser);
};

const verifyAuthToken = async (token) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID,
    });

    // returs google user
    return ticket.getPayload();
  } catch (error) {
    console.error("error verifying auth token", error);
  }
};

const checkIfUserExists = async (email) =>
  await User.findOne({ email })
    // to make sure it returns a promise
    .exec();

const createNewUser = (googleUser) => {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  return new User(user).save();
};
