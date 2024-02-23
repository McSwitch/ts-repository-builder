import {IModel, IField, IGroup, IColumn, FetchFunction} from "./types";
import {Paginator} from "./paginator";

export function urlJoin(baseUrl: string, path: string): string {
    baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    path = path.startsWith('/') ? path.slice(1) : path;
    path = path.endsWith('/') ? path.slice(0, -1) : path;
    return `${baseUrl}/${path}`;
}

export function wrapParams(url: string, params: string[][] | Record<string, string> | string | URLSearchParams): URL {
    let fullUrl = new URL(url);
    fullUrl.search = new URLSearchParams(params).toString();
    return fullUrl;
}

export const DefaultRecordsPerPage: number = 15;

export class ListResponse<T> {
    paginator: Paginator = null;
    records: T[] = [];

    constructor(records: T[], paginator: Paginator) {
        this.records = records;
        this.paginator = paginator;
    }
}

export class Repository<T extends IModel> {
    baseUrl: string = null;
    slug: string = null;
    fetchHandler: FetchFunction = null;
    fields: IField[] = [];
    groups: IGroup[] = [];
    columns: IColumn[] = [];

    constructor(baseUrl: string, slug: string, fetchHandler: FetchFunction = fetch) {
        this.baseUrl = baseUrl;
        this.slug = slug;
        this.fetchHandler = fetchHandler;
    }

    list(): Promise<ListResponse<T>> {
        let url = urlJoin(this.baseUrl, this.slug);
        let paginator = null;
        return new Promise<ListResponse<T>>((resolve, reject) => {
            this.fetchHandler(
                url,
                {
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
                        paginator = JSON.parse(paginatorJson) as Paginator;
                    }
                    return res.json();
                })
                .then(res => {
                    resolve(
                        new ListResponse(
                            res as T[],
                            paginator
                        )
                    );
                });
        });
    }

    create(record: T): Promise<T> {
        let url = urlJoin(this.baseUrl, this.slug);
        return new Promise<T>((resolve, reject) => {
            this.fetchHandler(
                url,
                {
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
                    resolve(
                        res as T
                    );
                });
        });
    }

    read(uuid: string): Promise<T> {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise<T>((resolve, reject) => {
            this.fetchHandler(
                url,
                {
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
                    resolve(
                        res as T
                    );
                });
        });
    }

    update(record: T): Promise<T> {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), record.uuid);
        return new Promise<T>((resolve, reject) => {
            this.fetchHandler(
                url,
                {
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
                    resolve(
                        res as T
                    );
                });
        });
    }

    delete(uuid: string, hard: boolean = false): Promise<T> {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise<T>((resolve, reject) => {
            this.fetchHandler(
                wrapParams(url, [['hard',hard?'1':'0']]),
                {
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
                    resolve(
                        res as T
                    );
                });
        });
    }

    restore(uuid: string): Promise<T> {
        let url = urlJoin(urlJoin(this.baseUrl, this.slug), uuid);
        return new Promise<T>((resolve, reject) => {
            this.fetchHandler(
                url,
                {
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
                    resolve(
                        res as T
                    );
                });
        });
    }
}
