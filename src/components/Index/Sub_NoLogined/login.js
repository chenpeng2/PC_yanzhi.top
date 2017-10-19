import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Checkbox,message,Alert } from 'antd'
import CryptoJS from 'crypto-js'
var base64 =require('base-64')
var utf8 = require('utf8');
import {connect} from 'react-redux'
import {setCookie,getCookie,deleteCookie} from '../../../actions/index.js'
class Login extends React.Component {
   constructor(props, context) {
         super(props, context);
         this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
   			 this.state={
            login_all_read:true,
            login_err:false,
            shouji_null:false,
            mima_null:false,
            checked:true,
            all_null:false,
            mima_30:false,
            username_err:false
   				}
   };
  Encrypt(word,iv,key){
      var encrypted = CryptoJS.AES.encrypt(word, key, { iv: iv,mode:CryptoJS.mode.CBC,padding: CryptoJS.pad.Pkcs7});
      return encrypted.toString();
  }
  componentDidMount(){

  }
  fetch(data){
      var ori_data ={
                    data:data
                    }
       var jsons=JSON.stringify(ori_data)
       var bytes = utf8.encode(jsons);
       var base64_data=base64.encode(bytes)
       const personalMessage = {
              method: "post",
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded'
              },
              body:"data="+base64_data,
       };
       fetch("http://192.168.1.129:92/v1/operate/userLogin.html", personalMessage)
   		.then(response => response.json()).then(json => {console.log(json)
        if(json.code=='SUCCESS'){
          if(this.state.login_all_read){
            localStorage.setItem('userN',data.userName);
          }
          this.loginSuccess(json)
        }
        else if(json.code=="ERROR_USERNAME"){this.clearAll();this.setState({username_err:true})}
        else if(json.code=="TOOMUCH_COUNT"){this.clearAll();this.setState({mima_30:true})}
        else if(json.code=='ERROR_LOGININFO'){this.clearAll();this.setState({login_err:true})}
        else if(json.code=="NULL_DATA"){this.clearAll();this.setState({all_null:true})}
        else if(json.code=='NULL_USERNAME'){this.clearAll();this.setState({shouji_null:true})}
        else if(json.code=='NULL_PASSWORD'){this.clearAll();this.setState({mima_null:true})}
        else{}
      });
  }
  clearAll(){
    this.setState({login_err:false});
    this.setState({shouji_null:false});
    this.setState({mima_null:false});
    this.setState({all_null:false});
    this.setState({mima_30:false});
    this.setState({username_err:false});
  }
  onChange(e) {
  this.setState({
     checked: e.target.checked,
   });
  if(e.target.checked){
    this.setState({login_all_read:true})
  }else{
    this.setState({login_all_read:false})
  }
 }
  reset_mima(){
    this.props.forgetPass();
  }
  loginSuccess(json){
      this.props.dispatch(setCookie('PAYPASSWORDSTATUS',encodeURI(json.PAYPASSWORDSTATUS),2));
      this.props.dispatch(setCookie('AUTHENSTATUS',encodeURI(json.AUTHENSTATUS)),2);
      this.props.dispatch(setCookie('FULLNAME',encodeURI(json.FULLNAME),2));
      this.props.dispatch(setCookie('token',encodeURI(json.token),2));
      if(json.NUMBERID){
      this.props.dispatch(setCookie('NUMBERID',encodeURI(json.NUMBERID),2))
    }
    if(json.NICKNAME){
      this.props.dispatch(setCookie('NICKNAME',encodeURI(json.NICKNAME),2))
    }
    if(json.HEADPATH){
      this.props.dispatch(setCookie('HEADPATH',encodeURI(json.HEADPATH),2))
    }
    this.props.dispatch(setCookie('TOKEN',encodeURI(json.token),2))
    this.props.disapper();
  }
  handleSubmit(){
    var data={userName:'',password:'',code:''};
    $('#form_login').find('input[type="text"],input[type="password"]').each(function(){data[this.name]=this.value});
    // if(this.state.login_all_read){
        data.userName?this.props.dispatch(setCookie('PHONE',encodeURI(data.userName)),2):'';
        this.fetch(data);
    // }else{
    //   this.error()
    // }
  }
  enterCheck(e){
    if(e.keyCode=='13'){
      this.handleSubmit()
    }
  }
  onChange_user(e){
    if(e.target.value){
      this.setState({shouji_null:false});
      this.setState({login_err:false});
      this.setState({all_null:false});
    }
  }
  onChange_mima(e){
    if(e.target.value){
      this.setState({mima_null:false});
      this.setState({login_err:false});
      this.setState({all_null:false});
    }
  }
  // error = () => { message.error("请勾选记住我!"); };
  onFocus_user=()=>this.setState({shouji_err:false})
  onFocus_mima=()=>this.setState({mima_err:false})
  render() {
    return (
        <div class="clearfix">
          <div class="login_err_message">
              {this.state.username_err?<div><Alert message="手机号或者密码错误" type="error" showIcon /></div>:''}
              {this.state.login_err?<div><Alert message="手机号或者密码错误" type="error" showIcon /></div>:''}
              {this.state.all_null?<div><Alert message="手机号密码为空" type="error" showIcon /></div>:''}
              {this.state.shouji_null?<div><Alert message="手机号为空" type="error" showIcon /></div>:''}
              {this.state.mima_null?<div><Alert message="密码为空" type="error" showIcon /></div>:''}
              {this.state.mima_30?<div><Alert message="密码输错3次,请半个小时再试!" type="error" showIcon /></div>:''}
          </div>
          <div class="float_left login_form">
            <form id='form_login'   method="post" >
              <p><label><i class="icon-shouji"></i></label><input id="userName" value={undefined} onKeyDown={this.enterCheck.bind(this)} onChange={this.onChange_user.bind(this)} onFocus={this.onFocus_user.bind(this)}  type="text" name="userName" placeholder="手机号"/></p>
              <p><label><i class="icon-mima"></i></label><input  onKeyDown={this.enterCheck.bind(this)} onChange={this.onChange_mima.bind(this)} onFocus={this.onFocus_mima.bind(this)}  type="password" name="password" placeholder="密码"/></p>
              <input class="submit" type="button" value="登录" onClick={this.handleSubmit.bind(this)}/>
              <div class="xieyi clearfix"><Checkbox checked={this.state.checked} onChange={this.onChange.bind(this)}>记住我</Checkbox><div class="float_right"><span style={{color:'#007fba',cursor:'pointer'}} onClick={this.reset_mima.bind(this)}>忘记密码</span></div></div>
            </form>
          </div>
          {/* <div class="float_right other_login">
              <p class="title">其他登录方式</p>
              <p class="oth_login weibo"><i class="icon-weibo"></i>微博账号登录</p>
              <p class="oth_login weixin"><i class="icon-weixin"></i>微信账号登录</p>
          </div> */}
        </div>
    );
  }
}
function mapStateToProps(state) {
    return { }
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Login = connect(mapStateToProps, mapDispatchToProps)(Login)
 export default Login
