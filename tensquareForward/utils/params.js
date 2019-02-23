export function getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=(^&*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
        return unescape(r[2]);
    }
    return null;
}
