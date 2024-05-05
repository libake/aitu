import { dao, dto } from "@/core";
import { http } from "../http";

export class Aigc {
    /**
     * 文本生成图像
     * @param data 
     */
    static text2image(data: any): Promise<dto.Response> {
        let url = '/v1/services/aigc/text2image/image-synthesis';
        return http.post(url, data);
    }

    /**
     * 推荐列表
     * @param data 
     */
    static recommend(data: {lastId: number, pageSize: number}): Promise<dto.Response> {
        let url = '/aigc/recommend';
        return http.post(url, data);
    }

    /**
     * 查询任务
     * @param data 
     */
    static task(data: {taskId: string}): Promise<dto.Response> {
        let url = `/aigc/task?taskId=${data.taskId}`;
        return http.get(url);
    }
}