const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_API_URL = "https://api.themoviedb.org/3";

app.get("/api/app", async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

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
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching data from TMDB", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});