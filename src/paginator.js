export class Paginator {
    constructor() {
        this.currentPage = null;
        this.totalPages = null;
        this.totalRecords = null;
        this.recordsPerPage = null;
        this.recordsOnCurrentPage = null;
    }
    toHeader() {
        let paginatorJson = JSON.stringify(this);
        return btoa(paginatorJson);
    }
}
