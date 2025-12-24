import m from "mithril";
import SearchEngineDB from "./SearchEngineDB";
import UI from "./ui/UI";
import SettingsStorage from "./SettingsStorage";
import { NAME } from "../constants";

const activeUrl = SettingsStorage.instance.activeUrl;
if (activeUrl) {
    const engineUrl = new URL("/opensearch.xml", window.location.origin);
    engineUrl.searchParams.set("url", activeUrl);
    const engineLink = document.createElement("link");
    engineLink.rel = "search";
    engineLink.type = "application/opensearchdescription+xml";
    engineLink.title = NAME;
    engineLink.href = engineUrl.toString();
    document.write(engineLink.outerHTML);
}

document.addEventListener("DOMContentLoaded", () => m.mount(document.body, UI));