const axios = require("axios");
const http = require('http');

const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkY2E2N2NiYWE1MzQxN2M1Y2I5ZTdmNWE3MTc2MTYyNSIsInN1YiI6IjY2NzRhZDY1Y2VlMjkwZGM5NTBmMjBmMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JyhSyeRsI0bRKIeVboYC_MVH5HNWMK1_AAPz3uP59n0";
const TMDB_API_URL = "https://api.themoviedb.org/3";

const server = http.createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
        return res.end();
    }

    try {
        console.log("calling backend");
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization:
                    'Bearer '+ TMDB_API_KEY
            }
        }
        const response = await axios.get(`${TMDB_API_URL}/discover/movie`, options);
        res.end(JSON.stringify(response.data, null, 2));
        return response;
    } catch (error) {
        res.end();
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Node.js HTTP server is running on port ${port}`);
});