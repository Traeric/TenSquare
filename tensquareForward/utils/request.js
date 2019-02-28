import axios from "axios";
import {getUser} from "./auth";

// 创建axios实例
const service = axios.create({
    // baseURL: "https://easy-mock.com/mock/5c40244a87eb837229ac1ec0",
    baseURL: "http://127.0.0.1:9012",
    timeout: 30000,     // 请求超时时间
    headers: {'Authorization': "Bearer " + getUser().token},        // 定义头信息，每次请求都将头信息带过去
});

// 导出
export default service;










