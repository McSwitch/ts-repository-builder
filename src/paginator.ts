export class Paginator {
    currentPage: number = null;
    totalPages: number = null;
    totalRecords: number = null;
    recordsPerPage: number = null;
    recordsOnCurrentPage: number = null;

    toHeader(): string {
        let paginatorJson = JSON.stringify(this);
        return btoa(paginatorJson);
    }
}
