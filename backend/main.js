import express from "express";
import userRouter from "./routes/userRoutes/routes.js";
const app = express();

app.use(express.json());

app.use("/user", userRouter);

app.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "Error del servidor" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
