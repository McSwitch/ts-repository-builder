export interface IModel {
    id: string;
}

export class Repository<T extends IModel> {
    constructor(slug: string) {
    }

    Create(record: T): T {
        // todo: push the record to api and return back to caller
        return null;
    }
}
