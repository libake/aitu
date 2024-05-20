import { dto } from "..";
import { http } from "../http";

export class Common {

    /**
     * 获取验证码
     * @param data 
     * @returns 
     */
    static sendSms(data: {mobile: string, scene: number}): Promise<dto.Response> {
        let url = '/common/sendSms';
        return http.post(url, data);
    }

    /**
     * 文件上传
     * @param data 
     * @returns 
     */
    static upload(data: {}): Promise<dto.Response> {
        let url = 'http://localhost:8090/api/style/update';
        return http.post(url, data);
    }
}