import { dao, dto } from "@/core";
import { http } from "../http";

export class Aigc {

    static text2image(data: any): Promise<dto.Response> {
        let url = '/v1/services/aigc/text2image/image-synthesis';
        return http.post(url, data);
    }

    static recommend(data: {lastId: number, pageSize: number}): Promise<dto.Response> {
        let url = '/aigc/recommend';
        return http.post(url, data);
    }
}