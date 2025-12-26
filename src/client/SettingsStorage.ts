export default class SettingsStorage {
    static #instance?: SettingsStorage;
    
    static ACTIVE_URL_KEY = "activeSearchEngineUrl";

    constructor() {}

    set activeUrl(value: string | null) {
        if (value === null) {
            window.localStorage.removeItem(SettingsStorage.ACTIVE_URL_KEY);
            return;
        }

        window.localStorage.setItem(SettingsStorage.ACTIVE_URL_KEY, value);
    }

    get activeUrl(): string | null {
        return window.localStorage.getItem(SettingsStorage.ACTIVE_URL_KEY);
    }

    static get instance(): SettingsStorage {
        return this.#instance ??= new this();
    }
}