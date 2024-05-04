export class Task {
    id: number;
    taskId: string;
    taskInput: {
        styleType?: string;
        text?: string;
        prompt?: string;
    };
    taskType: string;
    taskRate: number;
    taskResult: Array<{url: string}>;

    constructor() {
        this.id = 0;
        this.taskId = '';
        this.taskInput = {};
        this.taskType = '';
        this.taskRate = 0;
        this.taskResult = [];
    }
}