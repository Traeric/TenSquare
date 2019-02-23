import request from '@/utils/request';

export default {
    getListByPagination(currentPage, pageSize, searchMap) {
        return request({
            url: `/spit/spit/search/${currentPage}/${pageSize}`,
            method: "post",
            data: searchMap,
        });
    },
    getById(id) {
        return request({
            url: `/spit/spit/${id}`,
            method: "get",
        });
    },
    commentList(id) {
        return request({
            url:`/spit/spit/commentlist/${id}`,
            method: "get",
        });
    },
    thumbup(id) {
        return request({
            url: `/spit/spit/thumbup/${id}`,
            method: "put",
        });
    },
    save(pojo) {
        return request({
            url: "/spit/spit",
            method: "post",
            data: pojo
        });
    },
}

