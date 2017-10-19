export const changeTextAction = {
        type:'CHANGE_TEXT'
}
export const buttonClickAction = {
        type:'BUTTON_CLICK'
}
export const needLogin = {
        type:'need_login'
}
export const applyMember = {
        type:'apply_member'
}
export const searchTopic = {
        type:'search_topic'
}
export const pinglun_redux = {
        type:'pinglun_redux'
}
export function setCookie(name,data,days) {
        return{type:'set_cookie',name,data,days}
}
export function getCookie(name) {
        return{type:'get_cookie',name}
}
export function deleteCookie() {
        return{type:'delete_cookie'}
}
