export class User {
    id: number;
    nickname: string;
    mobile: string;
    email: string;
    password?: number;
    birthday: string;
    gender: number;
    status: number;
    lastTime?: string;
    power: number;
    updateAt?: string;
    createAt?: string;

    constructor() {
        this.id = 0;
        this.nickname = '';
        this.mobile = '';
        this.email = '';
        this.birthday = '';
        this.gender = 0;
        this.status = 1;
        this.power = 0;
    }
}