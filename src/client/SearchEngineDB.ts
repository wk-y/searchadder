import SearchEngine from "./SearchEngine";

export default class SearchEngineDB {
    static SEARCH_ENGINE_STORE_NAME = "searchEngines";

    static #instance?: SearchEngineDB;

    #db: Promise<IDBDatabase>;

    constructor() {
        this.#db = new Promise((resolve, reject) => {
            const request = window.indexedDB.open("search", 2);
            request.onerror = reject;
            request.onsuccess = (event) => {
                if (!(event.target instanceof IDBRequest)) throw Error("bad event.target type");
                resolve(event.target.result);
            };
            request.onupgradeneeded = SearchEngineDB.handleUpgradeNeedeEvent;
        });
    }

    static handleUpgradeNeedeEvent(event: IDBVersionChangeEvent) {
        if (!(event.target instanceof IDBRequest)) throw Error("bad event.target type");
        if (event.newVersion === null) throw Error("database version must be specified!");

        const db = event.target.result;

        switch (event.oldVersion) {
            case 0:
            case 1:
                if (event.newVersion <= 1) return;

                const keyPath: keyof SearchEngine = "url";
                db.createObjectStore(SearchEngineDB.SEARCH_ENGINE_STORE_NAME, { keyPath });


            case 2:
                if (event.newVersion <= 2) return;

                db.createObjectStore
            default:
                throw Error(`Migration from search DB version ${event.oldVersion} not supported!`);
        }
    }

    async getEngines(): Promise<SearchEngine[]> {
        const db = await this.#db;

        const transaction = db.transaction([SearchEngineDB.SEARCH_ENGINE_STORE_NAME], "readonly");

        const searchEngineStore = transaction.objectStore(SearchEngineDB.SEARCH_ENGINE_STORE_NAME);
        return await new Promise((resolve, reject) => {
            const request = searchEngineStore.getAll();
            request.onerror = reject;
            request.onsuccess = (ev) => {
                // todo: validation of result schema
                resolve(request.result);
            };
        });
    }

    async removeEngine(engineName: string): Promise<void> {
        const db = await this.#db;

        const transaction = db.transaction([SearchEngineDB.SEARCH_ENGINE_STORE_NAME], "readwrite");
        const searchEngineStore = transaction.objectStore(SearchEngineDB.SEARCH_ENGINE_STORE_NAME);

        await new Promise((resolve, reject) => {
            const request = searchEngineStore.delete(engineName);
            request.onerror = reject;
            request.onsuccess = resolve;
        });
    }

    async addEngine(engine: SearchEngine): Promise<void> {
        const db = await this.#db;

        const transaction = db.transaction([SearchEngineDB.SEARCH_ENGINE_STORE_NAME], "readwrite");
        const searchEngineStore = transaction.objectStore(SearchEngineDB.SEARCH_ENGINE_STORE_NAME);

        await new Promise((resolve, reject) => {
            const request = searchEngineStore.add(engine);
            request.onerror = reject;
            request.onsuccess = resolve;
        });
    }

    static get instance(): SearchEngineDB {
        return this.#instance ??= new this();
    }
}