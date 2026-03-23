'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const RefreshToken = require('../models/refreshTokens');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');


const userServiceError = (status, message) => {
    const error = new Error(message);
    error.status = status;
    return error;
};

const sanitizeUser = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
});


const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const register = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw userServiceError(400, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    return {
        message: 'User registered successfully',
        user: sanitizeUser(user),
    };
};

const login = async ({ email, password }) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw userServiceError(400, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw userServiceError(400, 'Invalid credentials');
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const accessTknExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await RefreshToken.create({
        userId: user.id,
        tokenHash: refreshTokenHash,
        expiresAt,
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        // message: 'Login successful',
        user: sanitizeUser(user),
        accessToken,
        refreshToken,
        expiresAt: accessTknExpiresAt,
    };
};


const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw userServiceError(404, 'User not found');
    }

    await user.destroy();
    return {
        message: 'User deleted successfully',
    };
};

const logout = async ({ refreshToken }) => {
    if (!refreshToken) {
        throw userServiceError(400, 'Refresh token is required');
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw userServiceError(401, 'Invalid or expired refresh token');
    }

    const refreshTokenHash = hashToken(refreshToken);
    const tokenRecord = await RefreshToken.findOne({
        where: {
            userId: decoded.id,
            tokenHash: refreshTokenHash,
            revokedAt: null,
        },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw userServiceError(401, 'Invalid or expired refresh token');
    }

    tokenRecord.revokedAt = new Date();
    await tokenRecord.save();

    return {
        message: 'Logout successful',
    };
};

const getUserProfile = async (id) => {
    try {
        const user = await User.findByPk(id);

        if (!user) {
            throw userServiceError(404, 'User not found');
        }

        return {
            message: 'User profile retrieved successfully',
            user: sanitizeUser(user),
        };
    } catch (error) {
        // preserve your custom status errors; wrap unexpected ones
        if (error.status) throw error;
        throw userServiceError(500, error.message || 'Failed to retrieve user profile');
    }
};

const renewRefreshTokenService = async ({ refreshToken }) => {
    if (!refreshToken) {
        throw userServiceError(400, 'Refresh token is required');
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw userServiceError(401, 'Invalid or expired refresh token');
    }

    const tokenHash = hashToken(refreshToken);

    const tokenRecord = await RefreshToken.findOne({
        where: {
            userId: decoded.id,
            tokenHash,
            revokedAt: null,
        },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        throw userServiceError(401, 'Invalid or expired refresh token');
    }

    const user = await User.findByPk(decoded.id, { attributes: ['id', 'email'] });
    if (!user) {
        throw userServiceError(404, 'User not found');
    }

    // Rotate: revoke old refresh token
    tokenRecord.revokedAt = new Date();
    await tokenRecord.save();

    // Issue new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    const newRefreshTokenHash = hashToken(newRefreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
        userId: user.id,
        tokenHash: newRefreshTokenHash,
        expiresAt,
        revokedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    return {
        message: 'Token refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

const getAllUsersService = async () => {
    try {
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        return {
            message: 'Users retrieved successfully',

            users: users.map(sanitizeUser),
        };
    } catch (error) {
        throw userServiceError(500, error.message || 'Failed to retrieve users');
    }
};

const updateUserProfile = async (id, { name, email, password }) => {
    const user = await User.findByPk(id);
    if (!user) {
        throw userServiceError(404, 'User not found');
    }
    if (name) user.name = name;
    if (email) user.email = email;
    await user.save();
    return {
        message: 'User profile updated successfully',
        user: sanitizeUser(user),
    };
}
    
module.exports = {
    register,
    login,
    deleteUser,
    logout,
    getUserProfile,
    renewRefreshTokenService,
    getAllUsersService,
    updateUserProfile
};
