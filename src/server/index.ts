import { OpenSearchResponse } from "./OpenSearchResponse";

export default {
    async fetch(request: Request): Promise<Response> {
        let url;
        try {
            url = new URL(request.url);
        } catch (e) {
            return new Response("Invalid URL", { status: 400 });
        }
        switch (url.pathname) {
            case "/opensearch.xml":
                const searchUrl = url.searchParams.get("url");

                if (!searchUrl) return new Response(`Missing search parameter "url"`, { status: 400 });
                
                const faviconURL = new URL("/favicon.ico", url.origin);

                return new OpenSearchResponse(searchUrl, faviconURL.toString());

            default:
                return new Response("Not Found", { status: 404 });
        }
    }
};