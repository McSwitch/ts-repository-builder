export function urlJoin(baseUrl, path) {
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    path = path.startsWith('/') ? path.slice(1) : path;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return `${baseUrl}/${path}`;
}
export const DefaultRecordsPerPage = 15;
export class ListResponse {
    constructor(records, paginator) {
        this.paginator = null;
        this.records = [];
        this.records = records;
        this.paginator = paginator;
    }
}
export class Repository {
    constructor(baseUrl, slug, fetchHandler = fetch) {
        this.baseUrl = null;
        this.slug = null;
        this.fetchHandler = null;
        this.fields = [];
        this.groups = [];
        this.columns = [];
        this.baseUrl = baseUrl;
        this.slug = slug;
        this.fetchHandler = fetchHandler;
    }
    list() {
        let url = urlJoin(this.baseUrl, this.slug);
        let paginator = null;
        return new Promise((resolve, reject) => {
            this.fetchHandler(url, {
                method: "POST",
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                if (res.headers.has('X-Paginator')) {
                    let paginatorHeader = res.headers.get('X-Paginator');
                    let paginatorJson = atob(paginatorHeader);
                    paginator = JSON.parse(paginatorJson);
                }
                return res.json();
            })
                .then(res => {
                resolve(new ListResponse(res, paginator));
            });
        });
    }
    create(record) {
        return null;
    }
    read(uuid) {
        return null;
    }
    update(record) {
        return null;
    }
    delete(uuid, hard = false) {
        return null;
    }
    restore(uuid) {
        return null;
    }
}
