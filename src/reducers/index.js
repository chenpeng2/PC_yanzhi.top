//reducer
import { combineReducers } from 'redux'
const initialState = {
    popState: 'no_need',
    popApply:'no_need',
    pinglun:0
}
function counter(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_TEXT':
        return {
            popState: 'ne'
        }
    case 'need_login':
        return{
           popState:'need'
        }
    case 'BUTTON_CLICK':
        return{
          popApply:'ne'
        }
    case 'apply_member':
        return{
          popApply:'need'
       }
    case 'search_topic':
        return{
          search_topic:'need'
        }
    case 'pinglun_redux':
        return{
          pinglun:state.pinglun+1
        }
    default:
        return initialState;
  }
}
function setCookie(name, value, days){
  var finalDays = 2; //cookie存储时间默认2天
  if (typeof (days) != "undefined" && !isNaN(days)){
      finalDays = parseInt(days);
  }
  var exp = new Date();
  exp.setTime(exp.getTime() + finalDays * 24 * 60 * 60 * 1000);
  document.cookie = name + "=" + value + ";path=/;expires=" + exp.toGMTString();//max-age 10*60*60 cookies 10小时后过期
}


function clearAllCookie() {
                var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
                if(keys) {
                    for(var i = keys.length; i--;)
                        document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()+';path=/'
                }
            }
function cookies(state = initialState, action) {
  switch (action.type) {
    case 'set_cookie':
      {setCookie(action.name,action.data,action.days);
      return false;}
    case 'delete_cookie':
      {clearAllCookie();
      return false;}
    default:
      return state
  }
}

const todoApp = combineReducers({ counter, cookies })
export default todoApp
