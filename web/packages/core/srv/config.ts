import { dto, http } from "..";

export class Task {

    static style(data: any): Promise<dto.Response> {
        let url = '/v1/services/aigc/text2image/image-synthesis';
        return http.post(url, data);
    }
}