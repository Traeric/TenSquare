import request from '@/utils/request';


export default {
    getLabelByPage(page, size) {
        return request({
            url: `/base/label/search/${page}/${size}`,
            method: "post",
        });
    },
    hotLabel() {
        return request({
            url: "/base/label/toplist",
            method: "get",
        });
    },
}


