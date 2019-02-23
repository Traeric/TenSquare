import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/article/column",
            method: "get",
        });
    },
    getListByPagination(currentPage, pageSize, searchMap) {
        return request({
            url: `/article/column/search/${currentPage}/${pageSize}`,
            method: "post",
            data: searchMap,
        });
    },
    getById(id) {
        return request({
            url: `/article/column/${id}`,
            method: "get",
        });
    },
    saveEnterprise(pojo) {
        return request({
            url: "/article/column",
            method: "post",
            data: pojo,
        });
    },
    updateById(id, pojo) {
        if (id === null || id === '') {
            return this.saveEnterprise(pojo)
        }
        return request({
            url: `/article/column/${id}`,
            method: "put",
            data: pojo,
        });
    },
    deleteById(id) {
        return request({
            url: `/article/column/${id}`,
            method: "delete",
        });
    },
    // 专栏审核
    examine(id) {
        return request({
            url: `/article/column/examine/${id}`,
            method: "put",
        });
    }
}
