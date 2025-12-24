import m from "mithril";
import SearchEngineDB from "./SearchEngineDB";
import UI from "./UI";

let db = new SearchEngineDB();

const app = document.getElementById("app");
if (!app) throw Error("#app does not exist");

m.mount(app, new UI(db))