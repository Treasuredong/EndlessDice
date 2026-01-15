import bcrypt from 'bcrypt';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param password Plain text password
 * @param hashedPassword Hashed password
 * @returns True if passwords match, false otherwise
 */
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};
