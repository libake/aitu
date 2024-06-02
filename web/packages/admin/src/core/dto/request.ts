type OrderBy = {
    col: string,
    asc: boolean
}

type QueryBy = {
    col: string,
    val: any
}

export class Request {
    currPage?: number;
    pageSize?: number;
    orderBy?: OrderBy[];
    queryBy?: QueryBy[];
    omit?: string;
    tree?: boolean;

    constructor(pagination?: { currPage: number, pageSize: number }) {
        if (!!pagination) {
            this.currPage = pagination.currPage;
            this.pageSize = pagination.pageSize;
        } else {
            this.currPage = 1;
            this.pageSize = 10;
        }
    }
}
