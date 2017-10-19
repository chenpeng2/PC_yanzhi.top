import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Checkbox,message,Alert} from 'antd'
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
           login_all_read:true,
           shouji_err:false,
           shouji_haved:false,
           shouji_null:false,
           mima_weishu:false,
           mima_null:false,
           code_err:false,
           nicheng_haved:false,
           checked:true,
           code_null:false,
           nicheng_null:false,
           net_err:false
         }
   };
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
       fetch("http://192.168.1.129:92/v2/operate/doRegister.html", personalMessage)
   		.then(response => response.json()).then(json => {console.log(json)
          if(json.code=='SUCCESS'){this.success();this.props.disapper();}
          else if(json.code=='ERROR_INTERNET'){
            //网络异常
            this.clearAll();this.setState({net_err:true})
          }
          else if(json.code=='NULL_NICKNAME'){
            this.clearAll();this.setState({nicheng_null:true})
          }
          else{}
      });
  }
  countDown(max_time){
    var _this=this;
    var count=setInterval(function(){
        var old=_this.state.time;old--;
        _this.setState({time:old});
        if(_this.state.time==0){_this.setState({daojishi:false});window.clearInterval(count);_this.setState({time:60});}
    },1000)
  }
  handleSubmit(){
    var data={userName:'',code:'',password:'',spreadId:'',nickName:''};
    $('#form_regis').find('input[type="text"],input[type="password"]').each(function(){data[this.name]=this.value});
    if(this.state.login_all_read){
      this.verifyResponseCode(data);
    }else{
      this.error()
    }
  }
  verifyResponseCode(register_data){
    var data={address:'',msgType:'REGISTER_VERIFY',code:''};
    $('#form_regis').find('input[name="code"]').each(function(){data.code=this.value});
    $('#form_regis').find('input[name="userName"]').each(function(){data.address=this.value});
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
     .then(response => response.json()).then(json => {console.log(json)
       var reg = /(?:\d.*_)|(?:_.*\d)|(?:[A-Za-z].*_)|(?:_.*[A-Za-z])|(?:[A-Za-z].*\d)|(?:\d.*[A-Za-z])/;
       var value=$('#form_regis').find('input[type="password"]')[0].value;
       if(json.code=='SUCCESS'){
         if(value.length>=6&&value.length<=20&&reg.test(value)){
           this.fetch(register_data)
         }else if(value==''){
           this.clearAll();this.setState({mima_null:true})
         }else{
           this.clearAll();this.setState({mima_weishu:true})
         }
       }
       else if(json.code=='NULL_ADDRESS'){this.clearAll();this.setState({shouji_null:true})}
       else if(json.code=='FAIL'){this.clearAll();this.setState({code_err:true})}
       else if(json.code=="NULL_CODE"){this.clearAll();this.setState({code_null:true})}
       else{}
   });
  }
  error = () => { message.error("请勾选注册协议!"); };
  success = () => { message.success("注册成功!"); };
  getCode(dataType){
    var data={address:'',msgType:'REGISTER_VERIFY'};
    $('#form_regis').find('input[name="userName"]').each(function(){data.address=this.value});
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
     if(json.code=='SUCCESS'){
       this.setState({daojishi:true});this.countDown(60);
       if(this.state.shouji_haved){
         this.clearAll();this.setState({shouji_haved:true})
       }
     }
     else if(json.code=='NULL_ADD RESS'){this.clearAll();this.setState({shouji_null:true});}
     else if(json.code=='ERROR_USERNAME'){this.clearAll();this.setState({shouji_err:true});}
     else{}
   });
  }
  clearAll(){
    this.setState({shouji_err:false});
    this.setState({shouji_haved:false});
    this.setState({shouji_null:false});
    this.setState({code_err:false});
    this.setState({nicheng_haved:false});
    this.setState({code_null:false});
    this.setState({mima_weishu:false});
    this.setState({mima_null:false});
      this.setState({nicheng_null:false});
  }
  checkUserName(){
    var data={userName:''};
    $('#form_regis').find('input[name="userName"]').each(function(){data.userName=this.value});
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
     if(json.code=="ERROR_USERNAME"){this.clearAll();this.setState({shouji_err:true});}
     else if(json.code=="USERNAME_EXISTED_LOCAL"){this.clearAll();this.setState({shouji_haved:true});}
     else if(json.code=='SUCCESS'){this.clearAll()}
     else if(json.code=="NULL_USERNAME"){this.clearAll();this.setState({shouji_null:true});}
     else{}
   });
  }
  checkNickName(){
    var data={nickName:''};
    $('#form_regis').find('input[name="nickName"]').each(function(){data.nickName=this.value});
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
    fetch("http://192.168.1.129:92/v1/operate/checkNickName.html", personalMessage)
   .then(response => response.json()).then(json => {
     if(json.code=='NICKNAME_EXISTED'){this.clearAll();this.setState({nicheng_haved:true})}
     else{
       this.setState({nicheng_haved:false})
     }
   });
  }
  onChange(){
    this.clearAll()
  }
  render() {
    return (
        <div class="clearfix">
          <div class="login_err_message">
              {this.state.shouji_null?<div><Alert message="手机号为空" type="error" showIcon /></div>:''}
              {this.state.shouji_err?<div><Alert message="手机号不正确" type="error" showIcon /></div>:''}
              {this.state.shouji_haved?<div><Alert message="手机号已注册" type="error" showIcon /></div>:''}
              {this.state.mima_null?<div><Alert message="密码为空" type="error" showIcon /></div>:''}
              {this.state.mima_weishu?<div><Alert message="密码规则不正确" type="error" showIcon /></div>:''}
              {this.state.nicheng_haved?<div><Alert message="高验值昵称已注册" type="error" showIcon /></div>:''}
              {this.state.nicheng_null?<div><Alert message="昵称为空" type="error" showIcon /></div>:''}
              {this.state.code_err?<div><Alert message="验证码错误" type="error" showIcon /></div>:''}
              {this.state.code_null?<div><Alert message="验证码为空" type="error" showIcon /></div>:''}
              {this.state.net_err?<div><Alert message="网络异常" type="error" showIcon /></div>:''}
          </div>
          <div class="float_left login_form">
            <form id="form_regis" action="" method="get">
              <p><label><i class="icon-shouji"></i></label><input type="text" onChange={this.onChange.bind(this)} onBlur={this.checkUserName.bind(this)} name="userName" placeholder="手机号"/></p>
              <p><label><i class="icon-mima"></i></label><input type="password" onChange={this.onChange.bind(this)} name="password" placeholder="密码(6位数字字母或下划线组合)"/></p>
              <p class="yanzhengma"><label><i class="icon-yanzhengma"></i></label><input onChange={this.onChange.bind(this)} type="text" name="code" placeholder="验证码"/>
                {this.state.daojishi
                ?<input type="button" class="getCode" style={{backgroundColor:'#777'}}  value={'发送中'+this.state.time+'s'} />
                :<input type="button" class="getCode"  value="获取验证码" onClick={this.getCode.bind(this)}/>}
              </p>
              <p><label><i class="icon-shouji"></i></label><input type="text" onChange={this.onChange.bind(this)} onBlur={this.checkNickName.bind(this)} name="nickName" placeholder="取一个高颜值专属昵称"/></p>
              <p><label><i class="icon-nicheng"></i></label><input type="text" onChange={this.onChange.bind(this)} name="spreadId" placeholder="推荐人ID(选填，必须是数字)"/></p>
              <input class="submit" type="button" value="注册" onClick={this.handleSubmit.bind(this)}/>
              <div class="xieyi"><Checkbox checked={this.state.checked} onChange={this.onChange.bind(this)}></Checkbox>阅读并同意<a target="_blank" href="http://yanzhi.top/staticpage/userAgreementPC.html" class="register">注册协议</a></div>
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
