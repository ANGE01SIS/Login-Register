import User from "../models/user-model.js";

class UserController {
  static getMe(req, res, next) {
    try {
      //Obtiene req.user por el middleware auth
      const user = User.getUserById(req.user.id);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
  static getUserByUsername(req, res, next) {
    try {
      const user = User.getUserByUsername(req.params.username);
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }
  static async updateUser(req, res, next) {
    try {
      const newDataUser = req.body;
      //Obtiene req.user por el middleware auth
      const updatedUserId = await User.updateUser(req.user.id, newDataUser);
      res
        .status(200)
        .json({ message: "User updated successfully", updatedUserId });
    } catch (err) {
      next(err);
    }
  }
  static async createUser(req, res, next) {
    try {
      const { name, username, password } = req.body;
      const user = new User(name, username, password);
      const token = await user.save();
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1800000,
      });
      res.status(200).json({ message: "User created succesfully" });
    } catch (err) {
      next(err);
    }
  }
  static async authenticateUser(req, res, next) {
    try {
      const { username, password } = req.body;
      const token = await User.authenticate(username, password);
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1800000,
      });
      res.status(200).json({ message: "User authenticated succesfully" });
    } catch (err) {
      next(err);
    }
  }
}

export default UserController;
