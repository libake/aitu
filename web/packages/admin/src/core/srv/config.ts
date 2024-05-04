import { dao, dto } from "@/core";
import { http } from "../http";

export class Task {

    static style(data: any): Promise<dto.Response> {
        let url = '/v1/services/aigc/text2image/image-synthesis';
        return http.post(url, data);
    }
}