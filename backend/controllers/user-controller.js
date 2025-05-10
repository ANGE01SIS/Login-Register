import User from "../models/user-model";

class UserController {
  static getUserByUsername(req, res) {
    try {
      const user = User.getUserByUsername(req.params.username);
      res.status(200).json(user);
    } catch (error) {
      next(err);
    }
  }
  static getUserByUsernameStrict(req, res) {
    try {
      const user = User.getUserByUsernameStrict(req.params.username);
      res.status(200).json(user);
    } catch (error) {
      next(err);
    }
  }
  static updateUser(req, res, next) {
    try {
      const { idUser, newDataUser } = req.body;
      const updatedUserId = User.updateUser(idUser, newDataUser);
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUserId });
    } catch (err) {
      next(err);
    }
  }
  static createUser(req, res, next) {
    try {
      const { name, username, password } = req.body;
      const user = new User(name, username, password);
      const token = user.save();
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1800000,
      });
      res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (err) {
      next(err);
    }
  }

  static authenticateUser(req, res, next) {
    try {
      const { username, password } = req.body;
      const token = User.authenticate(username, password);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1800000,
      });
      res.status(200).json({ message: "Usuario creado correctamente" });
    } catch (err) {
      next(err);
    }
  }
}
