const axios = require("axios");

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

export default async function handler(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }

    try {
        console.log("calling backend");
        const { page } = req.query;
        const response = await axios.get(`${TMDB_API_URL}/discover/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                page: page || 1,
                language: "de-DE",
                include_adult: false,
                include_video: false,
            },
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching data from TMDB", error);
        return res.status(500).json({ error: "Failed to fetch data" });
    }
}