//controllers/programController.ts
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE: Create a new program
export const createProgram = async (req: Request, res: Response) => {
  const { name, clientIds } = req.body; 
  try {
    const program = await prisma.program.create({
      data: {
        name, 
        clients: clientIds ? { connect: clientIds.map((id: number) => ({ id })) } : undefined,
      },
    });
    res.status(201).json(program);
  } catch (err) {
    console.error('Error creating program:', err);
    res.status(500).json({ message: 'Failed to create program', error: err instanceof Error ? err.message : String(err) });
  }
};

// READ: Get all programs
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany({
      include: { clients: true },
    });
    res.json(programs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch programs' });
  }
};
// READ: Get one program by ID
export const getProgramById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const program = await prisma.program.findUnique({
        where: { id: parseInt(id) },
        include: { clients: true }, 
      });
  
      if (!program) {
        res.status(404).json({ message: 'Program not found' });
        return;
      }
  
      res.json(program);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch program' });
    }
  };
  

// UPDATE: Edit a program
export const editProgram = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, clientIds } = req.body; 
  try {
    const program = await prisma.program.update({
      where: { id: parseInt(id) },
      data: {
        name, 
        clients: clientIds ? { connect: clientIds.map((id: number) => ({ id })) } : undefined,
      },
    });
    res.json(program);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update program' });
  }
};

// DELETE: Remove a program
export const deleteProgram = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.program.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete program' });
  }
};
