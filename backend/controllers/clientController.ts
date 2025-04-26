// src/controllers/clientController.ts
import { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// CREATE: Register a new client
export const registerClient = async (req: Request, res: Response) => {
  const { name, age, gender, programIds } = req.body; // programIds is an optional array of IDs for the programs the client should be linked to
  try {
    const client = await prisma.client.create({
      data: {
        name,
        age,
        gender,
        programs: programIds ? { connect: programIds.map((id: number) => ({ id })) } : undefined, // Connect client to programs if provided
      },
    });
    res.status(201).json(client);
  } catch (err) {
    console.error('Error registering client:', err);
    res.status(500).json({ message: 'Failed to register client', error: err instanceof Error ? err.message : String(err) });
  }
};

// READ: Get all clients
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await prisma.client.findMany({
      include: { programs: true }, // Includes the associated programs
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch clients' });
  }
};

// READ: Get one client by ID
export const getClientById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const client = await prisma.client.findUnique({
      where: { id: parseInt(id) },
      include: { programs: true }, // Includes the associated programs
    });

    if (!client) {
      res.status(404).json({ message: 'Client not found' });
      return;
    }

    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch client' });
  }
};

// UPDATE: Edit a client
export const editClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gender, programIds } = req.body; // Allow updating the associated programs
  try {
    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: {
        name,
        age,
        gender,
        programs: programIds ? { connect: programIds.map((id: number) => ({ id })) } : undefined, // Connect client to programs if provided
      },
    });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update client' });
  }
};

// DELETE: Remove a client
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.client.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete client' });
  }
};
