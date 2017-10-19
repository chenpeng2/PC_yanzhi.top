/**
 * Created by Administrator on 2017/7/14.
 */
import React from 'react';
import AllRead from '../../../../components/Common/AllRead.js';
import { Input ,Icon} from 'antd';
import SuccessOrfailed from './../jumpPage/successOrfailed';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class Paypassword extends React.Component{
    constructor(){
        super();
        this.state={
            disabled:true,
            count:60,
            password:undefined,//密码状态
            passwordnum:null,//密码
            code:undefined,
            codenum:null,
            inputType:true,
            visible:null,//返回成功失败弹窗
            codeSuccess:false,//短信发送成功
            senderror:null,//短信发送失败返回信息
            reponpse:null,//返回成功失败的内容
            timer:null,
            numberID:"",
            phoneNumHide:"",
            PHONE:"",
            PAYPASSWORDSTATUS:null,//是否设置过支付密码
        }
    };
    sendCodeClick=()=>{
        let timer=null;
        if(this.state.disabled){
            timer=setInterval(function () {
                let count=this.state.count;
                this.setState({disabled:false})
                count-=1;
                if(count<0){
                    this.setState({disabled:true});
                    count=60;
                    clearInterval(timer);
                }
                this.setState({count:count})
            }.bind(this),1000);
            this.setState({timer:timer});
            const data_code={
                data:{
                    'address':this.state.PHONE,
                    'msgType':"FIND_PAYPASSWORD_VERIFY",
                },
            };
            let jsons=JSON.stringify(data_code);
            let bytes = utf8.encode(jsons);
            let base64_data=base64.encode(bytes);
            const sendMessage={
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body:"data="+base64_data
            };
            fetch('http://192.168.1.129:92/v2/msgHandle/sendMsg.html',sendMessage).then(response => response.json()).then(json => {
                console.log(json);
                if(json.code=="NOTENOUGH_MSG"){
                    this.setState({senderror:json.message,visible:true,reponpse:false});
                }
            });
        };
    };
    componentWillUnmount(){
        clearInterval(this.state.timer);
        this.setState({timer:null})
    };
    setCode=(e)=>{
        const reg=/^\d{6}$/,codevlue=reg.test(e.target.value);
        this.setState({codenum:e.target.value,code:codevlue});
    };
    setPW=(e)=>{
        const reg=/^[a-zA-Z\d]{6,}$/, password=reg.test(e.target.value);
        this.setState({passwordnum:e.target.value,password:password});
    };
  fetch=(url)=>{
      if(this.state.code&&this.state.password) {
          const token=decodeURI(AllRead.getCookie('token'));
          const data_code = {
              data: {
                  'msgType': "FIND_PAYPASSWORD_VERIFY",
                  'code': this.state.codenum,
                  'password':this.state.passwordnum,
                  'numberID': this.state.numberID,
              },
              explain: {
                  numberID: this.state.numberID,
                  appToken:token
              }
          };
          let jsons = JSON.stringify(data_code);
          let bytes = utf8.encode(jsons);
          let base64_data = base64.encode(bytes);
          const sendMessage = {
              method: "post",
              headers: {'Content-Type': 'application/x-www-form-urlencoded'},
              body: "data=" + base64_data
          };
          fetch(url, sendMessage).then(response => response.json()).then(json => {
              if(json.code=="SUCCESS"){
                   this.setState({
                       reponpse:true,
                       visible:true,
                       passwordnum:null,
                       codenum:null,
                   });
               }else{
                  this.setState({senderror:json.message,visible:true,reponpse:false});
              }
          });
      }
    //以下是通过原密码修改支付密码暂留
      // if(this.state.code&&this.state.password){
      //     const data_code={
      //         data:{
      //             'address':this.state.PHONE,
      //             'msgType':"FIND_PAYPASSWORD_VERIFY",
      //             'code':this.state.codenum,
      //         },
      //         explain:{
      //             numberID:this.state.numberID,
      //         }
      //     };
      //     let jsons=JSON.stringify(data_code);
      //     let bytes = utf8.encode(jsons);
      //     let base64_data=base64.encode(bytes);
      //     const sendMessage={
      //         method: "post",
      //         headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //         body:"data="+base64_data
      //     };
      //     fetch('http://192.168.1.129:92/v1/msgHandle/verifyResponseCode.html',sendMessage).then(response => response.json()).then(json => {
      //         if(json.code=="SUCCESS"){
      //             this.setState({codeSuccess:true});
      //         }else{
      //             this.setState({senderror:"您输入的验证码错误",visible:true,reponpse:false});
      //         }
      //     }).then(()=>{
      //         if(this.state.codeSuccess){//验证码验证成功后将支付密码抛给后台
      //             const data_payword={
      //                 data:{
      //                     'password':this.state.passwordnum,
      //                     'numberID':this.state.numberID,
      //                 },
      //                 explain:{
      //                     numberID:this.state.numberID,
      //                 }
      //             };
      //             let jsonspay=JSON.stringify(data_payword);
      //             let bytespay = utf8.encode(jsonspay);
      //             let base64_datapay=base64.encode(bytespay);
      //             const payWord={
      //                 method: "post",
      //                 headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      //                 body:"data="+base64_datapay
      //             };
      //             fetch(url,payWord).then(response => response.json()).then(json => {
      //                 if(json.code=="SUCCESS"){
      //                     this.setState({reponpse:true,visible:true,});
      //                 }else{
      //                     this.setState({senderror:json.message,visible:true,reponpse:false});
      //                 }
      //             });
      //         }
      //     });
      // }else{
      //     // this.setState({code:false,password:false})
      // }
  };
    formSubmit=()=>{
        if(this.state.passwordnum==null){
            this.setState({password:false})
            return;
        }else if(this.state.codenum==null){
            this.setState({code:false});
            return;
        };
        if(this.state.PAYPASSWORDSTATUS==="false"){
             this.fetch('http://192.168.1.129:92/v1/operate/setPayPassword.html');
        }else{
            this.fetch('http://192.168.1.129:92/v1/operate/resetPayPassword.html');
        };

    };
    typetx=()=>{
        this.setState({inputType:false});
    };
    typepd=()=>{
        this.setState({inputType:true});
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID')),
              PHONE=decodeURI(AllRead.getCookie('PHONE')),
               PAYPASSWORDSTATUS=decodeURI(AllRead.getCookie('PAYPASSWORDSTATUS')),
               NEWPHONE=PHONE.substr(0,3)+"****"+PHONE.substr(7,4);
        this.setState({numberID:NUMBERID,phoneNumHide:NEWPHONE,PHONE:PHONE,PAYPASSWORDSTATUS:PAYPASSWORDSTATUS});
    };
    render() {
        const text=this.state.disabled?'发送验证码':+this.state.count+"s后重发";
        const message=this.state.code===false?"验证码不能为空且必须是6位数字":"";
        const passWord=this.state.password===false?"密码不能为空且长度必须为6位以上的字母数字组成":"";
        return (
            <div class="form_action">
                <div class="form_group">
                    <form action="" id="formpassword">
                        <div class="placeholder_div">请输入<span class="telNum">{this.state.phoneNumHide}</span>收到的验证码</div>
                        <div className="codeDiv"><Input onChange={this.setCode} value={this.state.codenum} maxLength="6"  size="large" type="text"/>
                            <button type="button" class="getCode"
                                    style={{background:!this.state.disabled&&"#999"}}
                                    disabled={!this.state.disabled}
                                    onClick={this.sendCodeClick}>{text}
                            </button>
                        </div>
                        <div class="error" ref="code">{message}</div>
                        <div class="placeholder_div">请输入你要{this.state.PAYPASSWORDSTATUS==="false"?"设置":"修改"}的支付密码</div>
                        <div class="passwd_div">
                            <Input onChange={this.setPW} value={this.state.passwordnum} placeholder="密码（数字字母或者下划线组合）" size="large" type={this.state.inputType?"password":"text"}/>
                            <img class="eye" src="/src/assets/images/eye.svg" alt="" onMouseDown={this.typetx}  onMouseUp={this.typepd}/>
                        </div>
                        <div class="error" ref="password">{passWord}</div>
                        <div class="btnDiv"><button type="button" class="submitBtn" onClick={this.formSubmit}>确定</button></div>
                    </form>
                </div>
                {
                    this.state.visible?  <SuccessOrfailed
                        resultFunction={result=>this.resultFunction(result)}
                        result={this.state.visible}
                        senderror={this.state.senderror}
                        reponpse={this.state.reponpse}/>:""
                }
            </div>
        );
    }
}
