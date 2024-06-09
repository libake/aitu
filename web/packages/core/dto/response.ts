export class Response {
    code: number;
    desc: string;
    data?: any;

    constructor() {
        this.code = 0;
        this.desc = '';
    }
}
