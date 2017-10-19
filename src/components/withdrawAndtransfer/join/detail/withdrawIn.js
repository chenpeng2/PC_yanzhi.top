/**
 * Created by Administrator on 2017/7/14.
 */
import React from 'react';
import {Input,Alert} from 'antd';
import {connect} from 'react-redux';
import AllRead from '../../../../components/Common/AllRead.js';
import {setCookie,getCookie,deleteCookie} from '../../../../actions/index.js'
let base64 =require('base-64');
let utf8 = require('utf8');
class WithdrawIn extends React.Component{
    constructor(){
        super();
        this.state={
            namevalue:"",
            idcardvalue:"",
            name:null,
            idcard:null,
            numberID:"",
            isokidName:false,//是否认证通过
            responseMessage:"",//认证失败返回信息
        }
    };
    checkName=(e)=>{
        const reg=/(^[\u4E00-\u9FA5]{1,10}[\.|\s]?[\u4E00-\u9FA5]{1,10}$)/g,name=reg.test(e.target.value);
        this.setState({name:name,namevalue:e.target.value});
    };
    checkidcard=(e)=>{
        let reg=/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i,
            idcard=reg.test(e.target.value),
            idvalue=e.target.value;
        let city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
        if( idvalue=='' || !reg.test( idvalue)||!city[ idvalue.substr(0,2)]){
            this.setState({idcard:idcard});
            return false;
        }else{
            //18位身份证需要验证最后一位校验位
            if( idvalue.length == 18){
                const code =idvalue.split('');
                let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                //校验位
                let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                let sum = 0;
                let ai = 0;
                let wi = 0;
                for (let i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                // let last = parity[sum % 11];
                if(parity[sum % 11] != code[17]){
                    this.setState({idcard:idcard});
                    return false;
                }else {
                    this.setState({idcard:idcard,idcardvalue:idvalue});
                }
            }
        };
    };
    formNameID=(e)=>{
        if(this.state.idcardvalue==""){
            this.setState({idcard:false});
            return;
        }else if(this.state.namevalue==""){
            this.setState({name:false});
            return;
        }
        if(this.state.name&&this.state.idcard){
            const token=decodeURI(AllRead.getCookie('token'));
            const data_code={
                data:{
                    'checkType':1,
                    'name':this.state.namevalue,
                    'cardNo':this.state.idcardvalue,
                },
                explain:{
                    numberID:this.state.numberID,
                    appToken:token
                }
            };
            let jsons=JSON.stringify(data_code);
            let bytes = utf8.encode(jsons);
            let base64_data=base64.encode(bytes);
            const Message={
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body:"data="+base64_data
            };
            fetch("http://192.168.1.129:92/beauty/v1/inputIdcardInfo.do",Message).then(response=>response.json()).then(json=>{
                if(json.code!=="FAILURE"){
                    this.props.dispatch(setCookie('AUTHENSTATUS',"true"),2);//认证成功修改cookie值
                    this.props.dispatch(setCookie('FULLNAME',encodeURI(this.state.namevalue)),2);//认证成功保存真是姓名
                    this.props.idstatus(true,this.state.namevalue);
                }else{
                    this.setState({responseMessage:json.message,isokidName:true});
                }
            });
        };
    };
    componentWillMount(){
        let NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        this.setState({numberID:NUMBERID});
    };
    render(){
        const nameMessage=this.state.name==false?"真实姓名不能为空且必须正确的真实姓名":"";
        const idMessage=this.state.idcard==false?"身份证号码不能为空且必须是正确的身份证号码":"";
        return (
            <div class="form_action">
                <div class="form_group">
                    <Alert
                        // message="Error"
                        description={this.state.responseMessage}
                        type="error"
                        showIcon
                        style={{display:this.state.isokidName?"":"none"}}
                    />
                    <form action="" id="withdraw_form">
                        <div class="marginB"><Input onChange={this.checkName}  placeholder="请输入真实姓名" size="large" type="text"/></div>
                        <div class="error errorName">{nameMessage}</div>
                        <div class="marginB"><Input onChange={this.checkidcard} placeholder="请输入个人身份证号" size="large" type="text" maxLength="18"/></div>
                        <div class="error errorID">{idMessage}</div>
                        <div class="btnDiv"><button class="submitBtn" type="button" onClick={this.formNameID}>确认并校验</button></div>
                        <div class="prompt">身份信息将用于申请会员和余额提现，请确保真实</div>
                    </form>
                </div>
            </div>
        )
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
WithdrawIn = connect(mapStateToProps, mapDispatchToProps)(WithdrawIn)
export default WithdrawIn
