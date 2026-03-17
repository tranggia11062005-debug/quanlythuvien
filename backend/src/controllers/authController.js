let users = [];

exports.register = (req, res) => {
  const user = req.body;

  users.push(user);

  res.json({
    message: "Đăng ký thành công",
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password,
  );

  if (user) {
    res.json({
      message: "Login success",
      user,
    });
  } else {
    res.status(401).json({
      message: "Sai tài khoản",
    });
  }
};
