export class Node {
    id: number;
    icon: string;
    name: string;
    meta: string;
    type: number;
    parentId?: number;
    path: string;
    sort: number;
    scope: string;
    status: number;
    leaf?: boolean;
    level?: number;
    createAt?: string;
    updateAt?: string;
    children?: Node[];

    constructor() {
        this.id = 0;
        this.icon = '';
        this.name = '';
        this.meta = '';
        this.path = '';
        this.type = 3;
        this.sort = 255;
        this.scope = '';
        this.status = 0;
    }
}