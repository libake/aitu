import { dao, dto, http } from "..";

export class Node {
    /**
     * 新增节点
     * @param data 
     * @returns 
     */
    static create(data: dao.Node): Promise<dto.Response> {
        let url = 'node/create';
        return http.post(url, data);
    }

    /**
     * 更新节点
     * @param data 
     * @returns 
     */
    static update(data: dao.Node): Promise<dto.Response> {
        let url = 'node/update';
        return http.post(url, data);
    }

    /**
     * 删除节点
     * @param data 
     * @returns 
     */
    static delete(data: {id: number}): Promise<dto.Response> {
        let url = 'node/delete';
        return http.post(url, data);
    }

    /**
     * 节点列表
     * @param data 
     * @returns 
     */
    static list(data: dto.Request): Promise<dto.Response> {
        let url = 'node/list';
        return http.post(url, data);
    }

    /**
     * 节点排序
     * @param data 
     * @returns 
     */
    static setSort(data: {id: number, sort: number}): Promise<dto.Response> {
        let url = 'node/setSort';
        return http.post(url, data);
    }

    /**
     * 节点排序
     * @param data 
     * @returns 
     */
    static setStatus(data: {id: number, status: number}): Promise<dto.Response> {
        let url = 'node/setStatus';
        return http.post(url, data);
    }
}