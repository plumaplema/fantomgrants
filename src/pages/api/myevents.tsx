import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { address } = JSON.parse(req.body)
        const events = await prisma.events.findMany({
            where: {
                owner: address
            }
        });
        res.status(200).json({ success: true, msg: events });
    } catch (error) {
        res.status(500).json({ success: false, msg: 'An error occurred while fetching events.' });
    }
}
