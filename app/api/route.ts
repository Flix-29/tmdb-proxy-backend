import {NextResponse} from "next/server";

export async function GET(req: Request) {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({error: "API key is missing"}, {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        });
    }

    try {
        const url = new URL(req.url);
        const page = url.searchParams.get("page") || "1";
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?page=${page}`, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    }
}