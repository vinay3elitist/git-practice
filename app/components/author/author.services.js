const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Author = require("../../models/authorModel");

class AuthorService {
  async register(req, res) {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password || !age) {
      res.status(400);
      throw new Error("All fileds are mandatory");
    }

    const authorExist = await Author.findOne({ email });
    if (authorExist) {
      res.status(400);
      throw new Error("Author already exist");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const author = await Author.create({
      name,
      email,
      password: hashedPassword,
      age,
    });
    return author;
  }

  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fileds are mandatory");
    }

    const author = await Author.findOne({ email });
    if (author && (await bcrypt.compare(password, author.password))) {
      const token = jwt.sign(
        {
          author: {
            name: author.name,
            email: author.email,
            age: author.age,
            id: author.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      return token;
    } else {
      res.status(401);
      throw new Error("Invalid Credentials");
    }
  }

  async profile(req, res) {
    const { email } = req.body;
    const author = await Author.findOne({ email }).populate({
      path: "books",
      select: ["bookname", "pages"],
    });

    if (author.id === req.author.id) {
      return author;
    } else {
      res.status(400);
      throw new Error("Author not found or Cannot access other Author's Profile");
    }
  }
}

module.exports = new AuthorService();
