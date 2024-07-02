import express, { Express } from "express";
import "reflect-metadata";
import dotenv from "dotenv";
import books from "./routes/books.route";
import users from "./routes/users.route";
import { errorHandler } from "./middlewares/error-handler.middleware";
import { responseWrapper } from "./middlewares/response-wrapper.middleware";

dotenv.config();

const app: Express = express();
const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(responseWrapper);

app.use("/books", books);
app.use("/users", users);

app.use("*", function (req, res) {
  res.status(404).json({
    status: 404,
    message: "Not Found",
  });
});
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://${host}:${port}`);
});
