
export function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
    return (
        typeof password === "string" &&
        password.length >= 6 && password.length <= 72
    );
}

export function isValidName(name) {
    return (
        typeof name === "string" &&
        name.trim().length >= 1 &&
        name.trim().length <= 100
    );
}

export function validateRegistration(name, email, password) {
    if (!isValidName(name)) {
        return 
            "Name must be between 1 and 100 characters.";
    }

    if (typeof email !== "string" || !isValidEmail(email.trim())) {
        return "Please provide a valid email address.";
    }

    if (!isValidPassword(password)) {
        return "Password must be between 6 and 72 characters.";
    }

    return null; // No validation errors
}
