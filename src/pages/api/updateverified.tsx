import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == "POST") {
        const { projectId }: { projectId: string } = JSON.parse(req.body)
        try {
            const comments = await prisma.projects.update({
                where: {
                    id: projectId
                },
                data: {
                    verified: true
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
