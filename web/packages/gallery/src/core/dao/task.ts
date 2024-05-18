export class Task {
    id: number;
    taskId: string;
    input: {
        styleType?: string;
        text?: string;
        prompt?: string;
    };
    taskType: string;
    taskRate: number;
    results: Array<{url: string}>;
    createAt?: string;
    updateAt?: string;

    constructor() {
        this.id = 0;
        this.taskId = '';
        this.input = {};
        this.taskType = '';
        this.taskRate = 0;
        this.results = new Array();
    }
}