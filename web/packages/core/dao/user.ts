export class User {
    id: number;
    nickname: string;
    mobile: string;
    email: string;
    password?: number;
    birthday: string;
    sex: number;
    wechat: string;
    alipay: string;
    accessKey: string;
    secretKey: string;
    status: number;
    updateAt?: string;
    createAt?: string;

    constructor() {
        this.id = 0;
        this.nickname = '';
        this.mobile = '';
        this.email = '';
        this.birthday = '';
        this.sex = 0;
        this.wechat = '';
        this.alipay = '';
        this.accessKey = '';
        this.secretKey = '';
        this.status = 1;
    }
}