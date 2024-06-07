import { dto } from "@/core";
import { http } from "../http";

export class User {

    static list(params: dto.Request): Promise<dto.Response> {
        let url = 'router/rest';
        let data = {
            method: "hrm.user.list",
            params: {
                ...params
            }
        }
        return http.post(url, data);
    }

    static info(data?: {id: number}): Promise<dto.Response> {
        let url = 'user/info';
        return http.get(url, {params: data});
    }

    static signIn(data: {account: string, captcha: string}): Promise<dto.Response> {
        let url = '/auth/signIn';
        return http.post(url, data);
    }

    static logout(): Promise<dto.Response> {
        let url = '/user/logout';
        return http.get(url);
    }
}