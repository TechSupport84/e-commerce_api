import { Client } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validateAuth from "../utils/validation_schema.js";
import createError from "http-errors";

const register = async (req, res, next) => {
    try {
        const createUser = await validateAuth.validateAsync(req.body);
        const checkUserExist = await Client.findOne({ email: createUser.email });

        if (checkUserExist) {
            return next(createError(400, `This email ${createUser.email} is already used.`));
        }

        const hashedPassword = bcrypt.hashSync(createUser.password, 10);
        const newUser = new Client({ 
            username: createUser.username, 
            email: createUser.email, 
            password: hashedPassword,
            
        });

        await newUser.save();

        res.status(201).json({ success: true, message: "User Created", user: newUser });

    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(createError(400, "Invalid credentials."));
        }

        const user = await Client.findOne({ email });
        if (!user) {
            return next(createError(404, "No email exists."));
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(401, "Password incorrect!"));
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "4d" }
        );

        res.status(200).json({ success: true, message: "Logged in", token });

    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

const getUsers = async (req, res, next) => {
    try {
        const users = await Client.find().select("-password");
        res.status(200).json({ success: true, users });
    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await Client.findById(req.params.id).select("-password");
        if (!user) {
            return next(createError(404, "User not found"));
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        let updatedData = { username, email };

        if (password) {
            updatedData.password = bcrypt.hashSync(password, 10);
        }

        const user = await Client.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        res.status(200).json({ success: true, message: "User updated", user });

    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await Client.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        next(createError(500, error.message || "Internal Server Error"));
    }
};

export { register, login, getUsers, getUserById, updateUser, deleteUser };
