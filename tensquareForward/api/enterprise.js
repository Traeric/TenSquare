import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/recruit/recruit",
            method: "get",
        });
    },
    getListByPagination(currentPage, pageSize, searchMap) {
        return request({
            url: `/recruit/enterprise/search/${currentPage}/${pageSize}`,
            method: "post",
            data: searchMap,
        });
    },
    getById(id) {
        return request({
            url: `/recruit/enterprise/${id}`,
            method: "get",
        });
    },
    saveEnterprise(pojo) {
        return request({
            url: "/recruit/enterprise",
            method: "post",
            data: pojo,
        });
    },
    updateById(id, pojo) {
        if (id === null || id === '') {
            return this.saveEnterprise(pojo)
        }
        return request({
            url: `/recruit/enterprise/${id}`,
            method: "put",
            data: pojo,
        });
    },
    deleteById(id) {
        return request({
            url: `/recruit/enterprise/${id}`,
            method: "delete",
        });
    },
    hotlist() {
        return request({
            url: "/recruit/enterprise/search/hotlist",
            method: "get",
        });
    },
}
