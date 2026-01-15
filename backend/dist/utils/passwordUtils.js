"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
const hashPassword = async (password) => {
    try {
        const salt = await bcrypt_1.default.genSalt(SALT_ROUNDS);
        const hash = await bcrypt_1.default.hash(password, salt);
        return hash;
    }
    catch (error) {
        throw new Error('Password hashing failed');
    }
};
exports.hashPassword = hashPassword;
/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns True if passwords match, false otherwise
 */
const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt_1.default.compare(password, hashedPassword);
    }
    catch (error) {
        throw new Error('Password comparison failed');
    }
};
exports.comparePassword = comparePassword;
//# sourceMappingURL=passwordUtils.js.map