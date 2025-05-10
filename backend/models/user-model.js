import bcrypt from "bcrypt";
import db from "../db/db.js";
import AppError from "../errors/AppError.js";
import jwt from "jsonwebtoken";
class User {
  constructor(name, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
  }

  static getUserById(userId) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  static getUserByUsername(username) {
    const user = db
      .prepare("SELECT * FROM users WHERE username LIKE ?")
      .get(`%${username}%`);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  static getUserByUsernameStrict(username) {
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }
  static async updateUser(idUser, newDataUser) {
    const user = this.getUserById(idUser);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    const isTheSamePassword = await bcrypt.compare(
      user.password,
      newDataUser.password
    );
    if (
      user.username === newDataUser.username &&
      user.name === newDataUser.name &&
      isTheSamePassword
    ) {
      throw new AppError("No changes detected");
    }
    const isUsernameTaken = User.getUserByUsernameStrict(this.username);
    if (isUsernameTaken) {
      throw new AppError("Username already taken", 409);
    }
    const stmt = db.prepare(
      "UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?"
    );
    const hashedPassword = await bcrypt.hash(newDataUser.password, 10);
    const result = stmt.run(
      newDataUser.name,
      newDataUser.username,
      hashedPassword,
      idUser
    );
    return result.lastInsertRowid;
  }
  async save() {
    const isUsernameTaken = User.getUserByUsernameStrict(this.username);
    if (isUsernameTaken) {
      throw new AppError("Username already taken", 409);
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    const idUserCreated = db
      .prepare("INSERT INTO users (name, username, password) VALUES (?, ?, ?)")
      .run(this.name, this.username, hashedPassword).lastInsertRowid;
    const payload = {
      id: idUserCreated,
    };
    //TODO Hacerlo en env, hay mas codigo ademas de este que usa esta misma linea, cambiarlas todas (usar el ctrl + f)
    const secretKey = "ALO_HIHI";
    const token = jwt.sign(payload, secretKey, {
      expiresIn: "30min",
    });

    return token;
  }
  static async authenticate(username, password) {
    const user = User.getUserByUsernameStrict(username);
    if (!user) {
      throw new AppError(
        "User not found, check your username or password",
        404
      );
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new AppError(
        "User not found, check your username or password",
        404
      );
    }
    const secretKey = "ALO_HIHI";
    const token = jwt.sign({ id: user.id }, secretKey, {
      expiresIn: "30min",
    });
    return token;
  }
}

export default User;
