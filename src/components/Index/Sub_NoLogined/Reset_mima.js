import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Checkbox,Alert,message} from 'antd'
import CryptoJS from 'crypto-js'
var base64 =require('base-64')
var utf8 = require('utf8');
 export default  class Register extends React.Component {
   constructor(props, context) {
         super(props, context);
         this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
         this.state={
           daojishi:false,
           time:60,
           shouji_null:false,
           shouji_err:false,
           code_err:false,
           codeweishu:false,
           codeset:false
         }
   };
  onChange(e) { console.log(`checked = ${e.target.checked}`); }
  goRegister(){
    this.props.goRegister()
  }
  goLogin(){
    this.props.goLogin()
  }
  countDown(max_time){
    var _this=this;
    var count=setInterval(function(){
        var old=_this.state.time;old--;
        _this.setState({time:old});
        if(_this.state.time==0){_this.setState({daojishi:false});window.clearInterval(count);_this.setState({time:60});}
    },1000)
  }
  getCode(dataType){
    this.checkUserName();
    var data={address:'',msgType:'FIND_LOGINPASSWORD_VERIFY'};
    $('#form_reset').find('input[name="userName"]').each(function(){data.address=this.value});
       var ori_data={
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
    fetch("http://192.168.1.129:92/v2/msgHandle/sendMsg.html", personalMessage)
   .then(response => response.json()).then(json => {
     console.log(json)
     if(json.code=='SUCCESS'){this.clearAll();this.setState({daojishi:true});this.countDown(60)}
     else if(json.code=='NULL_ADDRESS'){this.clearAll();this.setState({shouji_null:true});}
     else if(json.code=='ERROR_USERNAME'){this.clearAll();this.setState({shouji_err:true});}
     else{}
   });
  }
  clearAll(){
    this.setState({shouji_err:false});
    this.setState({shouji_null:false});
    this.setState({code_err:false});
    this.setState({codeweishu:false});
    this.setState({codeset:false});
  }
  resetMima(){
    this.verifyResponseCode()
  }
  verifyResponseCode(){
    var data={address:'',msgType:'FIND_LOGINPASSWORD_VERIFY',code:''};
    $('#form_reset').find('input[name="code"]').each(function(){data.code=this.value});
    $('#form_reset').find('input[name="userName"]').each(function(){data.address=this.value});
       var ori_data={
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
    fetch("http://192.168.1.129:92/v1/msgHandle/verifyResponseCode.html", personalMessage)
   .then(response => response.json()).then(json => {
     if(json.code=='SUCCESS'){this.resetLoginPassword();}
     else{this.clearAll();this.setState({code_err:true})}
   });
  }
  resetLoginPassword(){
    var data={userName:'',msgType:'FIND_LOGINPASSWORD_VERIFY',code:'',password:''};
    $('#form_reset').find('input[name="code"],input[name="userName"],input[name="password"]').each(function(){data[this.name]=this.value});
       var ori_data={
         data:data
       }
       console.log(data)
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
    fetch("http://192.168.1.129:92/v1/operate/resetLoginPassword.html", personalMessage)
   .then(response => response.json()).then(json => {console.log(json)
     if(json.code=="SUCCESS"){this.success()}
     else if(json.code=="ERROR_COMPLEXITY"){this.clearAll();this.setState({codeweishu:true})}
     else if(json.code=="NULL_PASSWORD"){this.clearAll();this.setState({codeset:true})}
     else{}
   });
  }
  checkUserName(){
    var data={userName:''};
    $('#form_reset').find('input[name="userName"]').each(function(){data.userName=this.value});
       var ori_data={
         data:data
       }
       console.log(ori_data)
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
    fetch("http://192.168.1.129:92/v1/operate/checkUserName.html", personalMessage)
   .then(response => response.json()).then(json => {
     if(json.code=="ERROR_USERNAME"){this.clearAll();this.setState({shouji_err:true})}
     else if(json.code=="USERNAME_EXISTED_LOCAL"){}
     else{}
   });
  }
success = () => { message.success("密码设置完成!",2); this.props.disapper()};
  render() {
    return (
        <div class="reset_mima clearfix">
          <div class="login_err_message">
              {this.state.shouji_null?<div><Alert message="手机号为空" type="error" showIcon /></div>:''}
              {this.state.shouji_err?<div><Alert message="手机号不正确" type="error" showIcon /></div>:''}
              {this.state.code_err?<div><Alert message="验证码错误" type="error" showIcon /></div>:''}
              {this.state.codeweishu?<div><Alert message="密码复杂度不够" type="error" showIcon /></div>:''}
              {this.state.codeset?<div><Alert message="请输入设置密码" type="error" showIcon /></div>:''}
          </div>
          <div class="float_left login_form">
            <form id="form_reset" action="" method="get">
              <p><label><i class="icon-shouji"></i></label><input name="userName" onBlur={this.checkUserName.bind(this)} type="text" placeholder="手机号"/></p>
              <p class="yanzhengma"><label><i class="icon-yanzhengma"></i></label><input type="text" name="code" placeholder="验证码"/>
                {this.state.daojishi
                ?<input type="button" class="getCode" style={{backgroundColor:'#777'}}  value={'发送中'+this.state.time+'s'} />
                :<input type="button" class="getCode"  value="获取验证码" onClick={this.getCode.bind(this)}/>}
              </p>
              <p><label><i class="icon-mima"></i></label><input type="password" name="password" placeholder="设置密码（最少6位）"/></p>
              <input class="submit" type="button" onClick={this.resetMima.bind(this)} value="重置密码"/>
              <div class="reset clearfix"><span onClick={this.goRegister.bind(this)} style={{color:'#ffac2e'}} >去注册></span><span onClick={this.goLogin.bind(this)} class="float_right" style={{color:'#333333'}}>去登录></span></div>
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
