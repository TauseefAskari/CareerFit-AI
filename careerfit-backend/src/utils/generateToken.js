import jwt from "jsonwebtoken";

const COOKIE_NAME = "careerfit_token";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

export function generateToken(userId) {
    const token = jwt.sign({ userId: userId.toString() }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
    return token;
}

export function setAuthCookie(res, token) {
    res.cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: SEVEN_DAYS,
        path: "/",
    });
}

export function clearAuthCookie(res) {
    res.clearCookie(COOKIE_NAME, {
        httpOnly : true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        path: "/"
    });
}