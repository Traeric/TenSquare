import axios from "axios";


export default {
    getAccessToken(code) {
        return axios.get(`http://localhost:8888/?operation=token&code=${code}`);
    },
    getUserInfo(access_token, openid) {
        return axios.get(`http://localhost:8888/?operation=userInfo&access_token=${access_token}&openid=${openid}`);
    },
}
