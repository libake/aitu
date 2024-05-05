import { dto } from "@/core";
import { http } from "../http";

export class User {
    /**
     * 用户列表
     * @param data 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = '/user/list';
        return http.post(url, data);
    }

    /**
     * 登录
     * @param data 
     */
    static signIn(data: {account: string, password: string}): Promise<dto.Response> {
        let url = '/auth/signIn';
        return http.post(url, data);
    }

    /**
     * 退出登录
     */
    static logout(): Promise<dto.Response> {
        let url = '/user/logout';
        return http.get(url);
    }
}