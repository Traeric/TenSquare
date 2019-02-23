import request from '@/utils/request'

export default {
    sendsms(mobile) {
        return request({
            url: `/user/user/sendsms/${mobile}`,
            method: "put",
        });
    },
    register(user, code) {
        return request({
            url: `/user/user/register/${code}`,
            method: "post",
            data: user,
        });
    },
    login(mobile, password) {
        return request({
            url: "/user/user/login",
            method: "post",
            data: {
                mobile,
                password,
            },
        });
    },
}



