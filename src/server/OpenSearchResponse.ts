import { NAME } from "../constants";
export class OpenSearchResponse extends Response {
    constructor(name: string, url: string, faviconURL: string) {
        const transformedUrl = url
            .replaceAll("{", "%7B")
            .replaceAll("}", "%7D")
            .replaceAll("%s", "{searchTerms}");

        super(`\
<OpenSearchDescription
  xmlns="http://a9.com/-/spec/opensearch/1.1/"
  xmlns:moz="http://www.mozilla.org/2006/browser/search/">
  <ShortName>${escapeXML(NAME)}</ShortName>
  <Description>Custom Search Engine</Description>
  <Image width="64" height="64" type="image/x-icon">${escapeXML(faviconURL)}</Image>
  <Url type="text/html" template="${escapeXML(transformedUrl)}"/>
</OpenSearchDescription>
`, { "headers": { "Content-Type": "application/xml" } });
    }
}

function escapeXML(str: string): string {
    return str
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt")
        .replace('"', "&#34;")
        .replace("'", "&#39;");
}