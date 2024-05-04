export class Recommend {
    id: number;
    avatarUrl: string;
    image: { url: string };
    taskId: string;
    taskInput: {
        prompt: string;
        ratio: string;
    };
    taskType: string;
    userId: string;
    userPhone: string;

    constructor() {
        this.id = 0;
        this.avatarUrl = '';
        this.image = {
            url: '',
        };
        this.taskId = '';
        this.taskInput = {
            prompt: '',
            ratio: '',
        };
        this.taskType = '';
        this.userId = '';
        this.userPhone = '';
    }
}