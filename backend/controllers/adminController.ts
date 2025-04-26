import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
    const doctor = await prisma.doctor.create({
      data: {
        name: request.name,
        email: request.email,
        password: request.password, // Ideally hash password before saving
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
