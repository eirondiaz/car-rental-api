import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../model'; // Asegúrate de que tienes un modelo User definido
import { AppDataSource as dbConfig } from '../db';

interface LoginBody {
  username: string;
  password: string;
}

interface RegisterBody {
  username: string;
  password: string;
  email: string;
}

const generateToken = (user: any) => {
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET || 'secret', // Reemplaza 'secret' con una clave secreta fuerte y mantenla en tus variables de entorno
    { expiresIn: '1h' }
  );
  return token;
};

export const register = async (req: Request<unknown, unknown, RegisterBody>, res: Response) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOneBy({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.username = username;
    user.email = email;
    user.password = hashedPassword;

    await user.save();

    const token = generateToken(user);

    return res.status(201).json({ data: user, token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};

export const login = async (req: Request<unknown, unknown, LoginBody>, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOneBy({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    return res.json({ data: user, token });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ message: error.message });
    }
  }
};
