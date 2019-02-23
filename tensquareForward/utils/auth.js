import Cookie from "js-cookie";

const tokenKey = "userToken";
const nameKey = "userName";
const avatarKey = "userAvatar";
const idKey = "userId";


export function setUser(id, token, name, avatar) {
    Cookie.set(idKey, id);
    Cookie.set(tokenKey, token);
    Cookie.set(nameKey, name);
    Cookie.set(avatarKey, avatar);
}

export function getUser() {
    return {
        id: Cookie.get(idKey),
        token: Cookie.get(tokenKey),
        name: Cookie.get(nameKey),
        avatar: Cookie.get(avatarKey),
    };
}

export function removeUser() {
    Cookie.remove(idKey);
    Cookie.remove(tokenKey);
    Cookie.remove(nameKey);
    Cookie.remove(avatarKey);
}

