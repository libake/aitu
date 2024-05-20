import { dao, dto } from "@/core";
import { http } from "../http";

export class Style {
    /**
     * 风格详情
     * @param data 
     * @returns 
     */
    static info(data: {id: number}): Promise<dto.Response> {
        let url = '/style/info';
        return http.get(url, {params: data});
    }

    /**
     * 风格列表
     * @param data 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = `/style/list`;
        return http.post(url, data);
    }
}