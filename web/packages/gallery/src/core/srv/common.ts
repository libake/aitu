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
        let url = '/file/upload';
        return http.post(url, data);

        // let url = 'https://test.miao333.com/api/upload/upload_file';
        // return fetch(url, {method: "POST", body: data});
    }
}