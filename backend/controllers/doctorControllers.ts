import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || "1234";
const prisma = new PrismaClient();

export const createDoctor = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }

  try {
    const existingDoctor = await prisma.doctor.findUnique({ where: { email } });
    if (existingDoctor) {
      res.status(409).json({ message: 'Doctor already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = await prisma.doctor.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({
      message: 'Doctor registered successfully',
      doctor: {
        id: newDoctor.id,
        name: newDoctor.name,
        email: newDoctor.email,
      },
    });
  } catch (err) {
    console.error('Error creating doctor:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginDoctor = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const doctor = await prisma.doctor.findUnique({ where: { email } });
    if (!doctor) {
      res.status(404).json({ message: 'Doctor not found' });
      return;
    }

    const isValid = await bcrypt.compare(password, doctor.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ doctorId: doctor.id, email: doctor.email }, process.env.JWT_SECRET || 'secret', {
      expiresIn: '1d',
    });

    res.json({
      message: 'Login successful',
      token,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getDoctorProfile = async (req: Request, res: Response) => {
  const doctorId = (req as any).doctorId;
  if (!doctorId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    return res.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor profile:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
