import m from "mithril";
import "./SearchEngineDB";
import SearchEngine from "./SearchEngine";
import SearchEngineDB from "./SearchEngineDB";

export default class UI implements m.Component {
    _db: SearchEngineDB;
    _data: SearchEngine[];
    loading: boolean = false;

    constructor(db: SearchEngineDB) {
        this._db = db;
        this._data = [];
        this.refresh();
    }

    view(vnode: m.Vnode<{}, this>): m.Children | null | void {
        if (this.loading) return m("div", "Loading...");
        return [
            m("form",
                { onsubmit: (event: SubmitEvent) => this.handleAddEngineSubmit(event) },
                m(`input[name="name"]`),
                m(`input[name="url"]`),
                m(`button[type="submit"]`, "Add"),
            ),
            m("table",
                this._data.map(engine =>
                    m("tr",
                        m("td",
                            engine.name,
                        ),
                        m("td",
                            engine.url,
                        ),
                        m("td",
                            m("button", { onclick: () => this.removeEngine(engine.name) }, "X")
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

        nameInput.value = ""
        urlInput.value = ""
    }

    removeEngine(name: string): void {
        this._db.removeEngine(name).finally(() => this.refresh());
    }
}