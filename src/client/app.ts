import m from "mithril";
import UI from "./ui/UI";
import SettingsStorage from "./SettingsStorage";
import { NAME } from "../constants";

const activeUrl = SettingsStorage.instance.activeUrl;
if (activeUrl) {
    // create the link to the OpenSearch description
    const engineUrl = new URL("/opensearch.xml", window.location.origin);
    engineUrl.searchParams.set("url", activeUrl);
    const engineLink = document.createElement("link");
    engineLink.rel = "search";
    engineLink.type = "application/opensearchdescription+xml";
    engineLink.title = NAME;
    engineLink.href = engineUrl.toString();

    // the link will be parsed during document loading, minimizing risk of unwanted special behavior
    document.write(engineLink.outerHTML);
}

document.addEventListener("DOMContentLoaded", () => m.mount(document.body, UI));