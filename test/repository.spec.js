'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { assert } from "chai";
import { DefaultRecordsPerPage, Repository, urlJoin } from "../src/repository.js";
import { Paginator } from "../src/paginator.js";
class TestModel {
    constructor(id, uuid) {
        this.id = null;
        this.uuid = null;
        this.id = id;
        this.uuid = uuid;
    }
}
const TestBaseUrl = 'http://localhost/';
const TestSlug = 'users';
const GetTestRepository = () => {
    return new Repository(TestBaseUrl, TestSlug);
};
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
    it('list', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('list' in repo);
        let records = [];
        records.push(new TestModel(1, 'a0c643d9-c82e-4c36-9c9b-43321bad87bc'));
        let paginator = new Paginator();
        paginator.currentPage = 1;
        paginator.totalPages = 1;
        paginator.totalRecords = records.length;
        paginator.recordsOnCurrentPage = records.length;
        paginator.recordsPerPage = DefaultRecordsPerPage;
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(TestBaseUrl, TestSlug));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "GET");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(records), {
                    headers: {
                        'X-Paginator': paginator.toHeader(),
                    }
                }));
            });
        };
        yield repo.list().then(res => {
            assert.equal(JSON.stringify(res.records), JSON.stringify(records));
            assert.equal(JSON.stringify(res.paginator), JSON.stringify(paginator));
        }).catch(res => {
            throw res;
        });
    }));
    it('create', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('create' in repo);
        let record = new TestModel(1, 'a0c643d9-c82e-4c36-9c9b-43321bad87bc');
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(TestBaseUrl, TestSlug));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "POST");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(record)));
            });
        };
        yield repo.create(record).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    }));
    it('read', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('read' in repo);
        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "GET");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(record)));
            });
        };
        yield repo.read(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    }));
    it('update', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('update' in repo);
        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "PUT");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(record)));
            });
        };
        yield repo.update(record).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    }));
    it('delete', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('delete' in repo);
        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid) + '?hard=0');
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "DELETE");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(record)));
            });
        };
        yield repo.delete(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    }));
    it('restore', () => __awaiter(void 0, void 0, void 0, function* () {
        assert.isTrue('restore' in repo);
        let uuid = 'a0c643d9-c82e-4c36-9c9b-43321bad87bc';
        let record = new TestModel(1, uuid);
        repo.fetchHandler = (input, init) => {
            assert.equal(input.toString(), urlJoin(urlJoin(TestBaseUrl, TestSlug), uuid));
            assert.isNotNull(init);
            assert.isTrue('method' in init);
            assert.equal(init.method, "POST");
            return new Promise((resolve) => {
                resolve(new Response(JSON.stringify(record)));
            });
        };
        yield repo.restore(uuid).then(res => {
            assert.equal(JSON.stringify(res), JSON.stringify(record));
        }).catch(res => {
            throw res;
        });
    }));
});
describe('Repository list method', () => {
    it('filtering', () => {
    });
    it('pagination', () => {
    });
    it('filtering + pagination', () => {
    });
    it('bad request error', () => {
    });
    it('general errors', () => {
    });
});
