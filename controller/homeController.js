// main content
const { WaxAuthServer } = require("wax-auth");
const auth = new WaxAuthServer();
const User = require("../models/User");
const cookielogin = require("../utils/cookieLogin");
const { v4: uuidv4 } = require("uuid");

exports.home = async (req, res) => {
  res.status(200).json({
    suceess: true,
    greeting: `Hello Greetings`,
  });
};

exports.main = async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      res.send({ error: "Not logged in" });
      return;
    }
    res.status(200).json({
      message: `You can go to home page`,
    });
  } catch (error) {
    console.log(`ERRORS::`, error);
  }
};

exports.getNonce = async (req, res) => {
  try {
    const { waxAddress } = req.body;
    if (!waxAddress) {
      res.send({
        error: "No username",
      });
      return;
    }

    // generate a nonce for the user and store it in session
    const nonce = auth.generateNonce();
    // req.session.waxAddress = waxAddress;
    // req.session.nonce = nonce;

    // send the nonce to the client
    res.send({
      nonce,
    });
  } catch (error) {
    console.log(`ERROR::`, error);
  }
};

exports.verify = async (req, res) => {
  try {
    // retreive

    console.log(`waxAddress:`, req.body.waxAddress);

    console.log(`nonce:`, req.body.nonce);

    console.log(`proof:`, req.body.proof);

    if (!req.body.nonce || !req.body.waxAddress || !req.body.proof) {
      res.status(400).json({
        error: "Please log in again",
      });
      return;
    }

    const valid = await auth.verifyNonce({
      waxAddress: req.body.waxAddress,
      proof: req.body.proof,
      nonce: req.body.nonce,
    });

    console.log(`valid`, valid);

    if (valid !== true) {
      return res.status(200).json({
        error: `login failed.`,
      });
    }

    const existingUser = await User.findOne({ username: req.body.waxAddress });

    if (!existingUser) {
      const user = await User.create({
        username: req.body.waxAddress,
      });
      // sending res on successfull registration
      cookielogin(user, res);
    } else {
      cookielogin(existingUser, res);
    }
  } catch (error) {
    console.log(`ERROR::`, error);
    return res.status(400).json({
      error: `Loggin Failed try again`,
    });
  }
};

exports.user = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });

    if (!user) {
      return res.status(400).json({
        error: `User not found`,
      });
    }

    res.status(200).json({
      dataDB: user,
    });
  } catch (error) {
    console.log(`ERROR::`, error);
  }
};

exports.logout = async (req, res) => {
  try {
    // destroying token

    res.clearCookie("token").json(`cookie cleared`);
  } catch (error) {
    console.log(error);
    // checking validation
    if (error.name === "ValidationError") {
      const message = Object.values(error.errors).map((value) => value.message);
      return res.status(400).json({
        error: message,
      });
    }
    res.status(400).json(error.message);
  }
};
