import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

const API_KEY = 'AIzaSyAKzZB_XPsq5lUzThdyRpfNcyu09nELVFk';
const DISCOVERY_URL =
    'https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "POST") {
        try {
            const client: any = await google.discoverAPI(DISCOVERY_URL);

            const { commentText } = JSON.parse(req.body);


            const analyzeRequest = {
                comment: {
                    text: commentText,
                },
                requestedAttributes: {
                    TOXICITY: {},
                },
            };

            client.comments.analyze(
                {
                    key: API_KEY,
                    resource: analyzeRequest,
                },
                (err: any, response: any) => {
                    if (err) throw err;
                    res.status(200).json(response.data);
                }
            );
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }

};
