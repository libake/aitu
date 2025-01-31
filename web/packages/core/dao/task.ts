class Input {
    prompt?: string;
    negative_prompt?: string;
    ref_img?: string;
    text: {
        text_content?: string;
        outpat_image_ratio?: string;
    };
    texture_style?: string;

    constructor() {
        this.text = {};
    }
}

class Parameters {
    style?: string;
    size?: string;
    n?: number;
    seed?: number;
    ref_strength?: number;
    ref_mode?: string;

    constructor() {
        this.n = 4;
    }
}

export class Task {
    id: number;
    taskId: string;
    input: Input;
    parameters?: Parameters;
    taskType: string;
    results: Array<string>;
    taskStatus: string;
    other?: any;
    createAt?: string;
    updateAt?: string;

    constructor() {
        this.id = 0;
        this.taskId = '';
        this.input = new Input();
        this.taskType = '';
        this.results = new Array();
        this.taskStatus = '';
    }
}

export class TaskUser extends Task {
    mobile: string;
    avatar: string;

    constructor() {
        super();
        this.mobile = '';
        this.avatar = '';
    }
}