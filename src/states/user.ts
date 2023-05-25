import {UserType} from "../models/user";
//存储获取到的用户信息
 let currentUser: UserType;

const setCurrentUserState = (user: UserType) => {
    console.log(user)
    currentUser = user;
}

const getCurrentUserState = () : UserType => {
    console.log(currentUser)
    return currentUser;
}

export {
    setCurrentUserState,
    getCurrentUserState,
}