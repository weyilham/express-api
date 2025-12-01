import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import prisma from "../../config/prisma.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import cookieOptions from "../../utils/cookieOptions.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return errorResponse(res, "User already exists", (data = null), 401);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return successResponse(
      res,
      "User registered successfully",
      {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return errorResponse(
        res,
        "Invalid email or password",
        (data = null),
        401
      );
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return errorResponse(
        res,
        "Invalid email or password",
        (data = null),
        401
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    // Set token in HTTP-only cookie
    res.cookie("token", token, cookieOptions(res));

    return successResponse(
      res,
      "Login successful",
      {
        id: user.id,
        name: user.name,
        email: user.email,
        token,
      },
      200
    );
  } catch (error) {
    return errorResponse(res, 500, "Internal server error");
  }
};

export const logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions(res),
    maxAge: undefined, //
  });
  return successResponse(res, "Logout successful", null, 200);
};
