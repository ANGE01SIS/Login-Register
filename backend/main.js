import express from "express";
import userRouter from "./routes/userRoutes/routes.js";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use("/user", userRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Error del servidor" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
