import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/gathering/gathering",
            method: "get",
        });
    },
    getListByPagination(page, size, searchMap) {
        return request({
            url: `/gathering/gathering/search/${page}/${size}`,
            method: "post",
            data: searchMap,
        });
    },
    saveGathering(pojo) {
        return request({
            url: "/gathering/gathering",
            method: "post",
            data: pojo,
        });
    },
    findById(id) {
        return request({
            url: `/gathering/gathering/${id}`,
            method: "get",
        });
    },
    updateById(id, pojo) {
        if (id === null || id === '') {
            return this.saveGathering(pojo)
        }
        return request({
            url: `/gathering/gathering/${id}`,
            method: "put",
            data: pojo,
        });
    },
    deleteById(id) {
        return request({
            url: `/gathering/gathering/${id}`,
            method: "delete",
        });
    }
}



