const authorService = require("./author.services");
const asyncHandler = require("express-async-handlr");

exports.register = asyncHandler(async (req, res) => {
  const author = await authorService.register(req, res);
  return res.status(201).json({
    message: "Author Registered Successfully",
    author: {
      _id: author.id,
      name: author.name,
      email: author.email,
      age: author.age,
    },
  });
});

exports.login = asyncHandler(async (req, res) => {
  const token = await authorService.login(req, res);
  return res.status(200).json({ token });
});

exports.profile = asyncHandler(async (req, res) => {
  const author = await authorService.profile(req, res);
  return res.status(200).json({
    message: "Author Profile",
    author: {
      _id: author.id,
      name: author.name,
      email: author.email,
      age: author.age,
      books: author.books,
    },
  });
});
