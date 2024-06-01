export class Category {
    id: number;
    code: string;
    name: string;
    icon: string;
    scene: string;
    innerImage: string;
    outerImage: string;
    prompt: string[];
    active?: boolean;
    children: Category[];

    constructor() {
        this.id = 0;
        this.code = '';
        this.name = '';
        this.icon = '';
        this.scene = '';
        this.innerImage = '';
        this.outerImage = '';
        this.prompt = new Array();
        this.children = new Array();
    }
}