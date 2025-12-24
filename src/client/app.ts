import m from "mithril";
import SearchEngineDB from "./SearchEngineDB";
import UI from "./UI";
import SettingsStorage from "./SettingsStorage";
import { NAME } from "../constants";

const app = document.getElementById("app");
if (!app) throw Error("#app does not exist");

const activeUrl = SettingsStorage.instance.activeUrl;
if (activeUrl) {
    const engineUrl = new URL("/opensearch.xml", window.location.origin);
    engineUrl.searchParams.set("url", activeUrl);
    const engineLink = document.createElement("link");
    engineLink.rel = "search";
    engineLink.type = "application/opensearchdescription+xml";
    engineLink.title = NAME;
    engineLink.href = engineUrl.toString();
    document.head.appendChild(engineLink);
}

m.mount(app, new UI());