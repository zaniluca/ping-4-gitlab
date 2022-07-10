import express from "express";
import "dotenv/config";
import user from "./routes/user";
import notification from "./routes/notification";
import auth from "./routes/auth";
import webhook from "./routes/webhook";
import { handleErrorWithStatus, handleUnauthorizedError } from "./middlewares";
import { expressjwt } from "express-jwt";

const app = express();
const port = process.env.PORT ?? 8080;

// Middlewares
app.use(express.json());
app.use(
  "/user",
  expressjwt({
    secret: process.env.JWT_ACCESS_SECRET!,
    algorithms: ["HS256"],
  })
);

// Routes
app.use("/user", user);
app.use("/notification", notification);
app.use("/", auth);
app.use("/", webhook);

// Error handling
app.use(handleUnauthorizedError);
app.use(handleErrorWithStatus);

app.get("/health", (_req, res) => res.sendStatus(200).end());

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
