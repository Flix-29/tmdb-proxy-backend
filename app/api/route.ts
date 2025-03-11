import { NextResponse } from "next/server";

export async function GET() {
    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
        return NextResponse.json({ error: "API key is missing" }, { status: 500 });
    }

    try {
        const response = await fetch("https://api.themoviedb.org/3/discover/movie", {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}