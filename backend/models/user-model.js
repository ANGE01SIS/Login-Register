import bcrypt from "bcrypt";
import db from "../db/db.js";

class User {
  constructor(name, username, password) {
    this.name = name;
    this.username = username;
    this.password = password;
  }

  static getUserById(id) {
    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    return user || null;
  }

  static getUserByUsername(username) {
    const user = db
      .prepare("SELECT * FROM users WHERE username LIKE ?")
      .get(`%${username}%`);
    return user || null;
  }
  static getUserByUsernameStrict(username) {
    const user = db
      .prepare("SELECT * FROM users WHERE username = ?")
      .get(username);
    return user || null;
  }

  static updateUser(idUser, newDataUser) {
    const user = this.getUserById(idUser);
    if (!user) {
      throw new Error("User not found");
    }
    if (
      user.username === newDataUser.username &&
      user.name === newDataUser.name &&
      bcrypt.compare(user.password, newDataUser.password)
    ) {
      throw new Error("No changes detected");
    }

    const stmt = db.prepare(
      "UPDATE users SET name = ?, username = ?, password = ? WHERE id = ?"
    );
    const hashedPassword = bcrypt.hashSync(newDataUser.password, 10);
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
      throw new Error("Username already taken");
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    const stmt = db.prepare(
      "INSERT INTO users (name, username, password) VALUES (?, ?, ?)"
    );
    const result = stmt.run(this.name, this.username, hashedPassword);
    return result.lastInsertRowid;
  }

  static async authenticate(username, password) {
    const user = User.getUserByUsernameStrict(username);
    if (!user) {
      throw new Error("User not found, check your username or password");
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error("User not found, check your username or password");
    }
    return user;
  }
}
