import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/article/channel",
            method: "get",
        });
    },
    getListByPagination(currentPage, pageSize, searchMap) {
        return request({
            url: `/article/channel/search/${currentPage}/${pageSize}`,
            method: "post",
            data: searchMap,
        });
    },
    getById(id) {
        return request({
            url: `/article/channel/${id}`,
            method: "get",
        });
    },
    saveEnterprise(pojo) {
        return request({
            url: "/article/channel",
            method: "post",
            data: pojo,
        });
    },
    updateById(id, pojo) {
        if (id === null || id === '') {
            return this.saveEnterprise(pojo)
        }
        return request({
            url: `/article/channel/${id}`,
            method: "put",
            data: pojo,
        });
    },
    deleteById(id) {
        return request({
            url: `/article/channel/${id}`,
            method: "delete",
        });
    }
}
