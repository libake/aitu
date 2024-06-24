export class Template {
    id: number;
    code: string;
    name: string;
    innerImage: string;
    outerImage: string;
    categoryId: number;
    sort: number;
    status: number;
    prompt: string[];

    constructor() {
        this.id = 0;
        this.code = '';
        this.name = '';
        this.innerImage = '';
        this.outerImage = '';
        this.categoryId = undefined!;
        this.sort = 0;
        this.status = 0;
        this.prompt = [];
    }
}