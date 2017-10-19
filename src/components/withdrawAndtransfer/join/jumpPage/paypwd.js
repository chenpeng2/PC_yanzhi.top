/**
 * Created by user on 2017/8/15.
 */
import React from 'react';
import AllRead from '../../../../components/Common/AllRead.js';
import SuccessOrfailed from './successOrfailed';
import {Modal,Input} from 'antd';
import {Link} from 'react-router';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class Paypwd extends React.Component{
    constructor(){
        super();
        this.state={
            pwd:null,
            passwordValue:"",
            numberID:"",
            buystatu:null,
            reponpse:"",//充值成功返回信息
            visible:false,//显示隐藏是否成功
        }
    };
    handleCancel = (e) => {
        this.refs.errorpwd.innerHTML=""
        this.setState({passwordValue:"",});
        this.props.paySubmit(false,this.props.DiamondBalance);
    };
    surePayDiamond=()=>{
        let token=decodeURI(AllRead.getCookie('token'));
        if(this.state.passwordValue==""){
            this.setState({pwd:false});
            return;
        }else if(this.state.pwd){
            const data_code={
                data:{
                    'amount':this.props.DiamondMoney,
                    'count':this.props.count,
                    'password':this.state.passwordValue
                },
                explain:{
                    numberID:this.state.numberID,
                    appToken:token
                }
            };
            let jsons=JSON.stringify(data_code);
            let bytes = utf8.encode(jsons);
            let base64_data=base64.encode(bytes);
            const sendMessage={
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body:"data="+base64_data
            };
            fetch('http://192.168.1.129:92/account/v1/buyDiamond.action',sendMessage).then(response => response.json()).then(json => {
                if(json.code=="FAILURE"){
                    this.setState({buystatu:false,visible:false});
                    this.refs.errorpwd.innerHTML=(json.data.message);
                }else{
                    this.setState({passwordValue:"",buystatu:true,reponpse:true,visible:true});
                    // this.props.paySubmit(false,this.props.DiamondBalance);
                    // window.location.reload()
                }
            }).then(()=>{
                if(this.state.buystatu){
                    const data_code={
                        explain:{
                            numberID:this.state.numberID,
                            appToken:token
                        }
                    };
                    let jsons=JSON.stringify(data_code);
                    let bytes = utf8.encode(jsons);
                    let base64_data=base64.encode(bytes);
                    const sendMessage={
                        method: "post",
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                        body:"data="+base64_data
                    };
                    //请求刷新钻石额度
                    fetch('http://192.168.1.129:92/account/v1/getVirtualAccount.action',sendMessage).then(response => response.json()).then(json => {
                        this.props.paySubmit(false,json.data.accountList.Outcome);
                    });
                    //请求刷新账户余额
                    fetch('http://192.168.1.129:92/account/accountBalance.do',sendMessage).then(response => response.json()).then(json => {
                        if(json.code=="SUCCESS"){
                            this.props.balance(json.data.balance);
                        };
                    });
                }
            });
        }
    };
    testPayPwd=(e)=>{
        const reg=/^[a-zA-Z\d]{6,}$/, password=reg.test(e.target.value);
        this.setState({pwd:password,passwordValue:e.target.value});
    };
    componentWillMount(){
        var NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        this.setState({numberID:NUMBERID});
    };
    forgetPW=()=>{
        this.props.paySubmit(false,this.props.DiamondBalance);
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    render(){
        const pwderror=this.state.pwd==false?"密码必须为6位以上的字母数字组成":"";
        return(
            <div>
                <Modal
                    title="验证支付密码"
                    maskClosable={true}
                    visible={this.props.Paypwd}
                    onCancel={this.handleCancel}
                    footer={null}
                    width={380}
                    closable={true}
                    style={{top:"300"}}
                >
                    <div class="pickerBody">
                        <Input  placeholder="请输入支付密码" size="large" value={this.state.passwordValue} type="password" onChange={this.testPayPwd}/>
                        <div className="error" style={{width:"266px",marginLeft:"40px",textAlign:"left"}} ref="errorpwd">{pwderror}</div>
                        <Link to={'/acoutMain/payPassword'} target="_blank">
                            <div class="forgetPwd" onClick={this.forgetPW}>忘记支付密码</div>
                        </Link>
                        <div className="payBtnDiv"><button onClick={this.surePayDiamond} type="button" className="paybtn">确认</button></div>
                    </div>
                </Modal>
                {
                    this.state.visible?  <SuccessOrfailed
                        resultFunction={result=>this.resultFunction(result)}
                        result={this.state.visible}
                        reponpse={this.state.reponpse}/>:""
                }
            </div>

        )
    }
}