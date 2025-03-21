import {NextResponse} from "next/server";
import {Filter} from "../model/Filter";
import {Logger, pino} from "pino"

const logger: Logger = pino();

export async function GET(req: Request) {
    logger.info("GET request received");

    const API_KEY = process.env.TMDB_API_KEY;
    if (!API_KEY) {
        logger.error("API key is missing");
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
        const reqUrl = new URL(req.url);
        const filter = getRequestParameters(reqUrl);
        const url = applyFilterToRequest(`https://api.themoviedb.org/3/discover/movie?`, filter);
        logger.info("calling MovieAPI with url: " + url);
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            }
        });

        if (!response.ok) {
            logger.error("API returned an error", response.status);
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
        logger.error(error.message);
        return new NextResponse(JSON.stringify({error: error.message}), {
            status: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
            }
        });
    }
}

function getRequestParameters(reqUrl: URL): Filter {
    const include_adult = reqUrl.searchParams.get("include_adult") || "false"
    const language = reqUrl.searchParams.get("language") || "en-US"
    const page = reqUrl.searchParams.get("page") || "1"
    const watch_region = reqUrl.searchParams.get("watch_region") || "US"
    const provider = reqUrl.searchParams.get("with_watch_providers") || ""
    return {
        include_adult: include_adult === "true",
        language: language,
        pageNumber: parseInt(page),
        watch_region: watch_region,
        provider: provider
    }
}

function applyFilterToRequest(baseUrl: string, filter: Filter): string {
    let requestUrlWithFilter = baseUrl

    requestUrlWithFilter += `include_adult=${filter.include_adult}`
    requestUrlWithFilter += `&language=${filter.language}`
    requestUrlWithFilter += `&page=${filter.pageNumber}`
    requestUrlWithFilter += `&sort_by=popularity.desc`
    requestUrlWithFilter += `&watch_region=${filter.watch_region}`
    requestUrlWithFilter += `&with_watch_providers=${filter.provider}`

    return requestUrlWithFilter
}