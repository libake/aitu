export class Feedback {
    id: number;
    content: string;
    createAt?: string;
    updateAt?: string;

    constructor() {
        this.id = 0;
        this.content = '';
    }
}