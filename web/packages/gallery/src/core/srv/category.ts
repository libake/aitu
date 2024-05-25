import { dto } from "@/core";
import { http } from "../http";

export class Category {

    static list(data: dto.Request): Promise<dto.Response> {
        let url = '/category/list';
        return http.post(url, data);
    }
}