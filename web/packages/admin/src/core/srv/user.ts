import { dto } from "@/core";
import { http } from "../http";

export class User {

    static list(data: dto.Request): Promise<dto.Response> {
        let url = '/user/list';
        return http.post(url, data);
    }

    static signIn(data: {account: string, password: string}): Promise<dto.Response> {
        let url = '/auth/signIn';
        return http.post(url, data);
    }
}