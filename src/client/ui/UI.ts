import m from "mithril";
import "../SearchEngineDB";
import SearchEngine from "../SearchEngine";
import SearchEngineDB from "../SearchEngineDB";
import SettingsStorage from "../SettingsStorage";
import SearchBar from "./SearchBar";

export default class UI implements m.ClassComponent {
    _db: SearchEngineDB;
    _data: SearchEngine[];
    _settings: SettingsStorage;
    _prefilledEngine?: SearchEngine;

    loading: boolean = false;

    constructor() {
        this._db = SearchEngineDB.instance;
        this._data = [];
        this._settings = SettingsStorage.instance;

        const hash = window.location.hash;
        let hashSplitIndex = hash.indexOf(":");
        if (hashSplitIndex >= 0) {
            this._prefilledEngine = {
                name: decodeURI(hash.substring(1, hashSplitIndex)),
                url: hash.substring(hashSplitIndex + 1),
            };
        }

        this.refresh();
    }

    view(vnode: m.Vnode<{}, this>): m.Children | null | void {
        if (this.loading) return m("div", "Loading...");

        const selectedEngine = this._settings.activeUrl;

        return [
            (selectedEngine
                ? m("div#searchBarContainer",
                    m(SearchBar, { url: selectedEngine }),
                )
                : []
            ),
            m("form",
                { onsubmit: (event: SubmitEvent) => this.handleAddEngineSubmit(event) },
                m("label",
                    "Name: ",
                    m(`input[type=text][name=name]`,
                        this._prefilledEngine ? { value: this._prefilledEngine.name } : {},
                    ),
                ),
                m("label",
                    "URL: ",
                    m(`input[type=url][name=url]`,
                        this._prefilledEngine ? { value: this._prefilledEngine.url } : {},
                    ),
                ),
                m(`button[type=submit]`, "Add"),
            ),
            m("table",
                this._data.map(engine =>
                    m("tr",
                        { key: engine.url },
                        m(`input[type=radio][name=selectedEngine]`,
                            {
                                onchange: () => this.setSelectedSearchEngine(engine.url),
                                value: engine.url,
                                checked: engine.url === selectedEngine,
                            },
                        ),
                        m("td",
                            engine.name,
                        ),
                        m("td",
                            engine.url,
                        ),
                        m("td",
                            m("button", { onclick: () => this.removeEngine(engine.url) }, "X")
                        )
                    )
                ),
            )
        ];
    }

    async refresh(): Promise<void> {
        if (this.loading) return;
        this.loading = true;
        this._data = [];
        await this._db.getEngines()
            .then((response => this._data = response))
            .finally(() => {
                this.loading = false;
                m.redraw();
            });
    }

    addEngine(engine: SearchEngine): void {
        this._db.addEngine(engine).finally(() => this.refresh());
    }

    handleAddEngineSubmit(event: SubmitEvent): void {
        event.preventDefault();

        if (!(event.target instanceof HTMLFormElement)) throw Error("Bad SubmitEvent target");

        const inputs = event.target.elements;
        const nameInput = inputs.namedItem("name");
        if (!(nameInput instanceof HTMLInputElement)) throw Error("nameInput has invalid type");

        const urlInput = inputs.namedItem("url");
        if (!(urlInput instanceof HTMLInputElement)) throw Error("nameInput has invalid type");

        this.addEngine({
            name: nameInput.value,
            url: urlInput.value,
        });

        nameInput.value = "";
        urlInput.value = "";
    }

    removeEngine(url: string): void {
        this._db.removeEngine(url).finally(() => this.refresh());
    }

    setSelectedSearchEngine(url: string): void {
        this._settings.activeUrl = url;
        window.location.reload();
    }
}