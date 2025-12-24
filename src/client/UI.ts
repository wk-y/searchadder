import m from "mithril";
import "./SearchEngineDB";
import SearchEngine from "./SearchEngine";
import SearchEngineDB from "./SearchEngineDB";
import SettingsStorage from "./SettingsStorage";

export default class UI implements m.Component {
    _db: SearchEngineDB;
    _data: SearchEngine[];
    _settings: SettingsStorage;
    loading: boolean = false;

    constructor() {
        this._db = SearchEngineDB.instance;
        this._data = [];
        this._settings = SettingsStorage.instance;

        this.refresh();
    }

    view(vnode: m.Vnode<{}, this>): m.Children | null | void {
        if (this.loading) return m("div", "Loading...");

        const selectedEngine = this._settings.activeUrl;

        return [
            m("form",
                { onsubmit: (event: SubmitEvent) => this.handleAddEngineSubmit(event) },
                m("label",
                    "Name: ",
                    m(`input[name=name]`),
                ),
                m("label",
                    "URL: ",
                    m(`input[name=url]`),
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
    }
}