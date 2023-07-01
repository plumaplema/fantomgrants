import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { eventId, fundingPool }: { eventId: string, fundingPool: number } = JSON.parse(req.body)
        try {
            const comments = await prisma.events.update({
                where: {
                    id: eventId
                },
                data: {
                    fundingpool: fundingPool
                }
            })
            res.status(200).json({ success: true });

        } catch (error) {
            res.status(200).json({ success: false });
        }
    } else {
        res.status(405).json({ success: false });
    }
}
