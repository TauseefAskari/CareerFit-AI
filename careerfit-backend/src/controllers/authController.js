import User from "../models/User.js";
import bcrypt from "bcryptjs";
import {validateRegistration} from "../utils/validator.js";
import {
    generateToken,
    setAuthCookie,
    clearAuthCookie
} from "../utils/generateToken.js"

function publicUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || "",
    };
}

// PUT /api/v1/auth/me
export async function updateProfile(req, res, next) {
    try {
        const { name } = req.body ?? {};

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "A non-empty name is required." });
        }

        const cleanName = name.trim();
        if (cleanName.length > 100) {
            return res.status(400).json({ message: "Name cannot exceed 100 characters." });
        }

        req.user.name = cleanName;
        await req.user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: publicUser(req.user),
        });
    } catch (error) {
        next(error);
    }
}

// POST /api/v1/auth/register 
export async function registerUser(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const validationError = validateRegistration(name, email, password);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLocaleLowerCase();

        const isUserExists = await User.findOne({ email: cleanEmail });

        if (isUserExists) {
            return res.status(409).json({
                message: "User already Exists!"
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password: passwordHash
        });

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        return res.status(201).json({
            message: "Account created Successfully",
            user: publicUser(user),
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "User already exists!"
            });
        }
        next(error);
    }
}

//POST /api/v1/auth/login
export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: "Email and Password are required"
            });
        }

        const cleanEmail = email.trim().toLocaleLowerCase();

        const user = await User.findOne({ email: cleanEmail }).select("+password");

        if (!user ||
            !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                message: "Invalid email or password!",
            });
        }

        const token = generateToken(user._id);
        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            user: publicUser(user),
        });
    } catch (error) {
        next(error);
    }
}

//POST /api/v1/auth/logout
export async function logoutUser(req, res,) {
    clearAuthCookie(res);

    return res.status(200).json({
        message: "Logout successful"
    });
}

//GET /api/v1/auth/me
export async function getMe(req, res) {
    return res.status(200).json({
        user: publicUser(req.user),
    });
}
