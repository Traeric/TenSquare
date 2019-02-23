import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/article/article",
            method: "get",
        });
    },
    getListByPagination(currentPage, pageSize, searchMap) {
        return request({
            url: `/article/article/search/${currentPage}/${pageSize}`,
            method: "post",
            data: searchMap,
        });
    },
    getById(id) {
        return request({
            url: `/article/article/${id}`,
            method: "get",
        });
    },
    saveEnterprise(pojo) {
        return request({
            url: "/article/article",
            method: "post",
            data: pojo,
        });
    },
    updateById(id, pojo) {
        if (id === null || id === '') {
            return this.saveEnterprise(pojo)
        }
        return request({
            url: `/article/article/${id}`,
            method: "put",
            data: pojo,
        });
    },
    deleteById(id) {
        return request({
            url: `/article/article/${id}`,
            method: "delete",
        });
    },
    // 文章审核
    examine(id) {
        return request({
            url: `/article/article/examine/${id}`,
            method: "put",
        });
    }
}
