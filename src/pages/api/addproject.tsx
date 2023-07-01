import { PrismaClient, Projects } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { id, currentTax, name, owner, projectDescription, projectFunds, projectLink, projectTitle, verified, eventsId }: Projects = JSON.parse(req.body)

            const res_ = await prisma.projects.create({
                data: {
                    currentTax, id, name, owner, projectDescription, projectFunds, projectLink, projectTitle, verified, eventsId
                }
            })
            res.status(200).json({ success: true, result: res_ });
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false });
            return
        }
    } else {
        res.status(405).json({ success: false });
        return
    }
}
