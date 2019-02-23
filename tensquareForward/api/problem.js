import request from '@/utils/request';


export default {
    list(type, label, page, size) {
        return request({
            url: `/qa/problem/${type}/${label}/${page}/${size}`,
            method: "get",
        });
    },
    getById(id) {
        return request({
            url: `/qa/problem/${id}`,
            method: "get",
        });
    },
    save(pojo) {
        return request({
            url: "/qa/problem",
            method: "post",
            data: pojo
        });
    },
}

