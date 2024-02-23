import { IModel } from "./imodel";

export class Repository<T extends IModel> {
    slug: any = null;
    fields: any = null;
    groups: any = null;
    columns: any = null;

    constructor(slug: string) {
    }

    List(): T[] {
        return null;
    }

    Create() {
    }

    Read() {
    }

    Update() {
    }

    Delete() {
    }

    Restore() {
    }
}
