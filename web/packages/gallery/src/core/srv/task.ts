import { dao, dto } from "@/core";
import { http } from "../http";

export class Task {
    /**
     * 创建任务
     * @param data 
     */
    static create(data: any): Promise<dto.Response> {
        let url = `/task/create`;
        return http.post(url, data);
    }

    /**
     * 删除任务
     * @param data 
     */
    static delete(data: {id: number[]}): Promise<dto.Response> {
        let url = `/task/delete`;
        return http.post(url, data);
    }

    static text2image(data: any): Promise<dto.Response> {
        let url = '/v1/services/aigc/text2image/image-synthesis';
        return http.post(url, data);
    }

    static info(data: {taskId: string}): Promise<dto.Response> {
        let url = '/task/info';
        return http.get(url, {params: data});
    }

    /**
     * 查询作品
     * @param data 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = `/task/list`;
        return http.post(url, data);
    }

    /**
     * 创建艺术字
     * @param data 
     */
    static wordArt(data: any): Promise<dto.Response> {
        let url = `/task/wordArt`;
        return http.post(url, data);
    }
}