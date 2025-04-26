import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import asyncHandler from '../middleware/asyncHandler';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || "1234";

const generateToken = (id: number) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};


export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email and password');
  }

  const adminExists = await prisma.admin.findUnique({ where: { email } });

  if (adminExists) {
    res.status(400);
    throw new Error('Admin already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    },
  });

  if (admin) {
    res.status(201).json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid admin data');
  }
});


export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin.id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


export const createDoctorRequest = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' });
  }
  try {
    const existingRequest = await prisma.doctorRequest.findUnique({ where: { email } });
    if (existingRequest) {
      return res.status(400).json({ message: 'A request with this email already exists' });
    }
    const request = await prisma.doctorRequest.create({
      data: { name, email, password, status: 'PENDING' },
    });
    return res.status(201).json(request);
  } catch (error) {
    console.error('Error creating doctor request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getPendingDoctorRequests = async (req: Request, res: Response) => {
  try {
    const requests = await prisma.doctorRequest.findMany({
      where: { status: 'PENDING' },
    });
    return res.json(requests);
  } catch (error) {
    console.error('Error fetching doctor requests:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const approveDoctorRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await prisma.doctorRequest.findUnique({ where: { id: Number(id) } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request already processed' });
    }
    const hashedPassword = await bcrypt.hash(request.password, 10);

    const doctor = await prisma.doctor.create({
      data: {
        name: request.name,
        email: request.email,
        password: hashedPassword,
      },
    });
    await prisma.doctorRequest.update({
      where: { id: Number(id) },
      data: { status: 'APPROVED' },
    });
    return res.json(doctor);
  } catch (error) {
    console.error('Error approving doctor request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const rejectDoctorRequest = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const request = await prisma.doctorRequest.findUnique({ where: { id: Number(id) } });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    if (request.status !== 'PENDING') {
      return res.status(400).json({ message: 'Request already processed' });
    }
    await prisma.doctorRequest.update({
      where: { id: Number(id) },
      data: { status: 'REJECTED' },
    });
    return res.json({ message: 'Request rejected' });
  } catch (error) {
    console.error('Error rejecting doctor request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
