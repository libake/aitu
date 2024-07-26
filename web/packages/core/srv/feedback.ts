import { dao, dto, http } from "..";

export class Feedback {
    /**
     * 新增反馈
     * @param data 
     * @returns 
     */
    static create(data: dao.Feedback): Promise<dto.Response> {
        let url = 'feedback/create';
        return http.post(url, data);
    }

    /**
     * 反馈列表
     * @param data 
     * @returns 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = 'feedback/list';
        return http.post(url, data);
    }
}