import { dao, dto, http } from "..";

export class Category {
    /**
     * 新增分类
     * @param data 
     * @returns 
     */
    static create(data: dao.Category): Promise<dto.Response> {
        let url = 'category/create';
        return http.post(url, data);
    }

    /**
     * 更新分类
     * @param data 
     * @returns 
     */
    static update(data: dao.Category): Promise<dto.Response> {
        let url = 'category/update';
        return http.post(url, data);
    }

    /**
     * 删除分类
     * @param data 
     * @returns 
     */
    static delete(data: {id: number}): Promise<dto.Response> {
        let url = 'category/delete';
        return http.post(url, data);
    }

    /**
     * 分类列表
     * @param data 
     * @returns 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = 'category/list';
        return http.post(url, data);
    }

    /**
     * 分类排序
     * @param data 
     * @returns 
     */
    static setSort(data: {id: number, sort: number}): Promise<dto.Response> {
        let url = 'category/setSort';
        return http.post(url, data);
    }

    /**
     * 分类状态
     * @param data 
     * @returns 
     */
    static setStatus(data: {id: number, status: number}): Promise<dto.Response> {
        let url = 'category/setStatus';
        return http.post(url, data);
    }
}