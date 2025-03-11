import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const API_KEY = process.env.PRIVATE_API_KEY;
    if (!API_KEY) {
        return res.status(500).json({ error: 'API key is missing' });
    }

    const response = await fetch('https://your-api.com/data', {
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    const data = await response.json();
    res.status(response.status).json(data);
}