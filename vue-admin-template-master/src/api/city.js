import request from '@/utils/request'

export default {
    getList() {
        return request({
            url: "/base/city",
            method: "get",
        });
    }
}

