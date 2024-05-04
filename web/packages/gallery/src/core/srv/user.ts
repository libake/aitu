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
}