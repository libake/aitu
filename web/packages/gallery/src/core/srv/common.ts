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
}