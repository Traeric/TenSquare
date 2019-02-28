import request from '@/utils/request';


export default {
    list(type, label, page, size) {
        return request({
            url: `/problem/${type}/${label}/${page}/${size}`,
            method: "get",
        });
    },
    getById(id) {
        return request({
            url: `/problem/${id}`,
            method: "get",
        });
    },
    save(pojo) {
        return request({
            url: "/problem",
            method: "post",
            data: pojo
        });
    },
}

