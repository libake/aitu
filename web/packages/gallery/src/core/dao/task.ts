export class Task {
    id: number;
    taskId: string;
    input: {
        prompt?: string;
        negative_prompt?: string;
        ref_img?: string;
    };
    parameters?: {
        style?: string;
        size?: string;
        n?: number;
        seed?: number;
        ref_strength?: number;
        ref_mode?: string;
    }
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