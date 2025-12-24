import m from "mithril";

type Attrs = {
    url: string;
};

export default class SearchBar implements m.ClassComponent<Attrs> {
    constructor() { }

    view(vnode: m.Vnode<Attrs, this>): m.Children | null | void {
        let { url } = vnode.attrs;

        let parsedUrl: URL;
        try {
            parsedUrl = new URL(url);
        } catch (e) {
            console.error(e);
            return null;
        }
        const withoutParams = new URL(parsedUrl);
        withoutParams.search = "";

        let numPlaceholdersEncountered = 0;

        return m("form",
            {
                action: withoutParams.toString()
            },
            Array.from(parsedUrl.searchParams.entries()).map(
                ([name, value]) => value === "%s" && !numPlaceholdersEncountered++
                    ? m("input[type=search]", { name })
                    : m("input[type=hidden]", { name, value })
            ),
            m("button[type=submit]", "Search!"),
        );
    }
}