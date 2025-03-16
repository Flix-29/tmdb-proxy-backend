import {NextResponse} from "next/server";
import {Filter} from "../model/Filter";
import {getProviderFromValue, getProviderId} from "../model/Provider";

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
        const reqUrl = new URL(req.url);
        const filter = getRequestParameters(reqUrl);
        const url = applyFilterToRequest(`https://api.themoviedb.org/3/discover/movie?`, filter);
        const response = await fetch(url, {
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

function getRequestParameters(reqUrl: URL): Filter {
    const include_adult = reqUrl.searchParams.get("include_adult") || "false"
    const include_video = reqUrl.searchParams.get("include_video") || "false"
    const language = reqUrl.searchParams.get("language") || "en-US"
    const page = reqUrl.searchParams.get("page") || "1"
    const watch_region = reqUrl.searchParams.get("watch_region") || "US"
    const provider = reqUrl.searchParams.getAll("with_watch_providers").map(item => getProviderFromValue(item)) || []
    return {
        include_adult: include_adult === "true",
        include_video: include_video === "true",
        language: language,
        pageNumber: parseInt(page),
        watch_region: watch_region,
        provider: provider
    }
}

function applyFilterToRequest(baseUrl: string, filter: Filter): string {
    let requestUrlWithFilter = baseUrl

    requestUrlWithFilter += `include_adult=${filter.include_adult}`
    requestUrlWithFilter += `&include_video=${filter.include_video}`
    requestUrlWithFilter += `&language=${filter.language}`
    requestUrlWithFilter += `&page=${filter.pageNumber}`
    requestUrlWithFilter += `&sort_by=popularity.desc`
    requestUrlWithFilter += `&watch_region=${filter.watch_region}`

    if (filter.provider != null && filter.provider.length > 0) {
        requestUrlWithFilter += `&with_watch_providers=`
        filter.provider.forEach(provider => {
            requestUrlWithFilter += `${getProviderId(provider).replace(' ', '')}|`
        })
        requestUrlWithFilter = requestUrlWithFilter.substring(0, requestUrlWithFilter.length - 1)
    }

    return requestUrlWithFilter
}