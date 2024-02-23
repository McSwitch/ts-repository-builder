'use strict';
import { assert } from "chai";
import { Repository } from "../src/repository.js";
class TestModel {
}
const TestSlug = 'users';
const GetTestRepository = () => {
    return new Repository(TestSlug);
};
describe('Repository implements LCRUDR methods', () => {
    let repo = GetTestRepository();
    it('List', () => {
        assert.isTrue('List' in repo);
    });
    it('Create', () => {
        assert.isTrue('Create' in repo);
    });
    it('Read', () => {
        assert.isTrue('Read' in repo);
    });
    it('Update', () => {
        assert.isTrue('Update' in repo);
    });
    it('Delete', () => {
        assert.isTrue('Delete' in repo);
    });
    it('Restore', () => {
        assert.isTrue('Restore' in repo);
    });
});
describe('Repository has required properties', () => {
    let repo = GetTestRepository();
    it('slug', () => {
        assert.isTrue('slug' in repo);
    });
    it('fields', () => {
        assert.isTrue('fields' in repo);
    });
    it('groups', () => {
        assert.isTrue('groups' in repo);
    });
    it('columns', () => {
        assert.isTrue('columns' in repo);
    });
});
