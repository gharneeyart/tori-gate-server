import jwt from 'jsonwebtoken';

/**
 * Generates a JWT token and sets it as an HTTP-only cookie in the response.
 * This function is typically used during user authentication (e.g., login).
 *
 * @param {Object} res - The response object from Express.js.
 * @param {string} userId - The user's unique identifier (usually their database ID).
 * @param {string} role - User's role (e.g., "tenant" or "landlord"). 
 * @returns {string} - The generated JWT token.
 */
export const generateTokenAndSetCookie = (res, userId, role) => {
    // Create a JWT token with the user's ID as the payload, and sign it with a secret key.
    const token = jwt.sign({ userId, role }, process.env.JWT_SECRET, {
        expiresIn: '7d'  // Token expires in 7 days.
    });

    // Set the JWT token as a cookie in the response. The cookie is HTTP-only, meaning it cannot be accessed via JavaScript (XSS protection).
    res.cookie("token", token, {
        httpOnly: true, // Ensures the cookie is sent only in HTTP(S) requests.
        secure: process.env.NODE_ENV === 'production', // Sets the "secure" flag in production, requiring HTTPS.
        sameSite: 'strict', // Prevents the cookie from being sent in cross-site requests (CSRF protection).
        maxAge: 7 * 24 * 60 * 60 * 1000,  // The cookie expires in 7 days.
    });

    return token;
} 

/**
 * Generates a JWT token specifically for password reset purposes.
 * This token typically has a shorter lifespan and is sent to the user's email.
 *
 * @param {string} userId - The user's unique identifier.
 * @returns {string} - The generated JWT token for password reset.
 */
export const generateResetToken = (userId) => {
    // Create a JWT token with the user's ID as the payload, and sign it with a secret key.
    const resetToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '1h'  // Token expires in 1 hour.
    });

    return resetToken;
};

