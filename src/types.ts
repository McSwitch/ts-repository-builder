export interface IModel {
    id: number;
    uuid: string;
}
export interface IField {
}
export interface IGroup {
}
export interface IColumn {
}

export type FetchFunction = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;
