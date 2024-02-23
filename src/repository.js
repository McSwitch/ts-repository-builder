export function urlJoin(baseUrl, path) {
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    path = path.startsWith('/') ? path.slice(1) : path;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return `${baseUrl}/${path}`;
}
export function wrapParams(url, params) {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(params).toString();
    return fullUrl;
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
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
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
        let url = urlJoin(this.baseUrl, this.slug);
        return new Promise((resolve, reject) => {
            this.fetchHandler(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(record),
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                return res.json();
            })
                .then(res => {
                resolve(res);
            });
        });
    }
    read(uuid) {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise((resolve, reject) => {
            this.fetchHandler(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                return res.json();
            })
                .then(res => {
                resolve(res);
            });
        });
    }
    update(record) {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), record.uuid);
        return new Promise((resolve, reject) => {
            this.fetchHandler(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify(record),
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                return res.json();
            })
                .then(res => {
                resolve(res);
            });
        });
    }
    delete(uuid, hard = false) {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise((resolve, reject) => {
            this.fetchHandler(wrapParams(url, [['hard', hard ? '1' : '0']]), {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                return res.json();
            })
                .then(res => {
                resolve(res);
            });
        });
    }
    restore(uuid) {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise((resolve, reject) => {
            this.fetchHandler(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            })
                .then(res => {
                if (res.status >= 300) {
                    reject(res);
                }
                return res.json();
            })
                .then(res => {
                resolve(res);
            });
        });
    }
}
