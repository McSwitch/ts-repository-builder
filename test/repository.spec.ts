'use strict';

import { assert } from "chai";
import {DefaultRecordsPerPage, Repository, urlJoin} from "../src/repository.js";
import {Paginator} from "../src/paginator.js";

class TestModel {
    id: number = null;
    uuid: string = null;

    constructor(id: number, uuid: string) {
        this.id = id;
        this.uuid = uuid;
    }
}
const TestBaseUrl = 'http://localhost/';
const TestSlug = 'users';
const GetTestRepository = (): Repository<TestModel> => {
    return new Repository<TestModel>(TestBaseUrl, TestSlug);
}

describe('Repository has required properties', () => {

    let repo = GetTestRepository();

    it('baseUrl', () => {
        assert.isTrue('baseUrl' in repo);
        assert.equal(repo.baseUrl, TestBaseUrl);
    });

    it('slug', () => {
        assert.isTrue('slug' in repo);
        assert.equal(repo.slug, TestSlug);
    });

    it('fields', () => {
        assert.isTrue('fields' in repo);
        assert.isArray(repo.fields);
    });

    it('groups', () => {
        assert.isTrue('groups' in repo);
        assert.isArray(repo.groups);
    });

    it('columns', () => {
        assert.isTrue('columns' in repo);
        assert.isArray(repo.columns);
    });

    it('fetchHandler', () => {
        assert.isTrue('fetchHandler' in repo);
        assert.equal(repo.fetchHandler, fetch);
    });

});

describe('Repository implements LCRUDR methods', () => {

    let repo = GetTestRepository();

    it('list', async() => {
        assert.isTrue('list' in repo);

        let records: TestModel[] = [];
        records.push(
            new TestModel(1, 'a0c643d9-c82e-4c36-9c9b-43321bad87bc'),
        );
        let paginator = new Paginator();
        paginator.currentPage = 1;
        paginator.totalPages = 1;
        paginator.totalRecords = records.length;
        paginator.recordsOnCurrentPage = records.length;
        paginator.recordsPerPage = DefaultRecordsPerPage;

        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(TestBaseUrl, TestSlug));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "GET");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(records),
                        {
                            headers: {
                                'X-Paginator': paginator.toHeader(),
                            }
                        }
                    )
                );
            });
        }

        await repo.list().then(res => {
            assert.equal(JSON.stringify(res.records), JSON.stringify(records));
            assert.equal(JSON.stringify(res.paginator), JSON.stringify(paginator));
        }).catch(res => {
            throw res;
        });
    });

    it('create', async() => {
        assert.isTrue('create' in repo);

        let record = new TestModel(1, 'a0c643d9-c82e-4c36-9c9b-43321bad87bc');
        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(TestBaseUrl, TestSlug));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "POST");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(record),
                    )
                );
            });
        }

        await repo.create(record).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    });

    it('read', async() => {
        assert.isTrue('read' in repo);

        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "GET");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(record),
                    )
                );
            });
        }

        await repo.read(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    });

    it('update', async() => {
        assert.isTrue('update' in repo);

        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "PUT");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(record),
                    )
                );
            });
        }

        await repo.update(record).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    });

    it('delete', async() => {
        assert.isTrue('delete' in repo);

        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid) + '?hard=0');
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "DELETE");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(record),
                    )
                );
            });
        }

        await repo.delete(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    });

    it('restore', async() => {
        assert.isTrue('restore' in repo);

        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input: RequestInfo | URL, init?: RequestInit): Promise<any> => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "POST");

            return new Promise((resolve) => {
                resolve(
                    new Response(
                        JSON.stringify(record),
                    )
                );
            });
        }

        await repo.restore(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    });

});

describe('Repository list method', () => {

    it('filtering', () => {

    })

    it('pagination', () => {

    })

    it ('filtering + pagination', () => {

    })

    it('bad request error', () => {

    })

    it('general errors', () => {

    })

})
