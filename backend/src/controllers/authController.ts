import { Request, Response } from "express";
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../app";

export const register = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const { email, password, username } = req.body;

  try {
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User alredy exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      username,
    });
    await userRepository.save(user);

    res.status(201).json({ message: "User create successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error createing user" });
  }
};

export const login = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const { email, password } = req.body;

  try {
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
