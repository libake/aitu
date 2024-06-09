export class Category {
    id: number;
    code: string;
    name: string;
    icon: string;
    scene: string;
    prompt: string[];
    platform?: string;
    parentId: number;
    sort: number;
    status: number;
    children: Category[];

    constructor() {
        this.id = 0;
        this.code = '';
        this.name = '';
        this.icon = '';
        this.scene = '';
        this.prompt = new Array();
        this.parentId = undefined!;
        this.sort = 0;
        this.status = 0;
        this.children = new Array();
    }
}