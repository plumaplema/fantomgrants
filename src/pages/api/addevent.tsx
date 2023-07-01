import { Events, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const { id, description, duration, fundingpool, nftsecurity, name, organization, owner }: Events = JSON.parse(req.body)

            const res_ = await prisma.events.create({
                data: {
                    description: description, duration, alreadyDistributed: false,
                    fundingpool, id, name, nftsecurity, organization, owner
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
