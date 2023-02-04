const cookielogin = async (user, res) => {
  const token = user.getJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.TOKEN_DATE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // console.log(`options`, options);
  const username = user.username;
  const user_Id = user._id;

  res
    .status(200)
    .cookie("token", token, options)
    .json({ user_Id, username, token });
};

module.exports = cookielogin;
