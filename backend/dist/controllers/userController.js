"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.loginUser = exports.registerUser = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
// Mock user database
const mockUsers = {};
// Simple password check (for demo purposes only)
const comparePassword = (plainPassword, hashedPassword) => {
    return Promise.resolve(plainPassword === hashedPassword);
};
// Mock user ID generator
const generateMockId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
/**
 * Register a new user
 */
const registerUser = async (req, res) => {
    try {
        const { username, password, confirmPassword } = req.body;
        // Validate input
        if (!username || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 3 and 20 characters' });
        }
        // Check if username already exists
        const lowercaseUsername = username.toLowerCase();
        if (mockUsers[lowercaseUsername]) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        // Create new user
        const newUser = {
            _id: generateMockId(),
            username: lowercaseUsername,
            password: password, // Store plain password for demo purposes only
            balance: 100, // Default balance from .env
            status: 'active'
        };
        // Save to mock database
        mockUsers[lowercaseUsername] = newUser;
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(newUser._id, newUser.username);
        // Return user without password
        const userWithoutPassword = {
            _id: newUser._id,
            username: newUser.username,
            balance: newUser.balance,
            status: newUser.status
        };
        res.status(201).json({
            message: 'User registered successfully',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
};
exports.registerUser = registerUser;
/**
 * Login a user
 */
const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        // Validate input
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Find user by username
        const lowercaseUsername = username.toLowerCase();
        const user = mockUsers[lowercaseUsername];
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Check if user is active
        if (user.status !== 'active') {
            return res.status(403).json({ message: 'Account is frozen' });
        }
        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }
        // Generate token
        const token = (0, jwtUtils_1.generateToken)(user._id, user.username);
        // Return user without password
        const userWithoutPassword = {
            _id: user._id,
            username: user.username,
            balance: user.balance,
            status: user.status
        };
        res.status(200).json({
            message: 'Login successful',
            user: userWithoutPassword,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed' });
    }
};
exports.loginUser = loginUser;
/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        // For demo, we'll just return a mock user
        const mockUser = {
            _id: '123456789',
            username: 'demo_user',
            balance: 100,
            status: 'active'
        };
        res.status(200).json({
            user: mockUser,
            message: 'Profile retrieved successfully'
        });
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Failed to retrieve profile' });
    }
};
exports.getProfile = getProfile;
/**
 * Update user profile
 */
const updateProfile = async (req, res) => {
    try {
        const updates = req.body;
        // Only allow updating certain fields
        const allowedUpdates = ['password', 'username'];
        const isValidOperation = Object.keys(updates).every(key => allowedUpdates.includes(key));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid update fields' });
        }
        // For demo purposes, just return the same mock user
        const mockUser = {
            _id: '123456789',
            username: 'demo_user',
            balance: 100,
            status: 'active'
        };
        res.status(200).json({
            message: 'Profile updated successfully',
            user: mockUser
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};
exports.updateProfile = updateProfile;
//# sourceMappingURL=userController.js.map