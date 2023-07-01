import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const events = await prisma.events.findMany();
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching events.' });
    }
}
