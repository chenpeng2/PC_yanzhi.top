/**
 * Created by Administrator on 2017/7/20.
 */
import React from 'react';
import AllRead from '../../../../components/Common/AllRead.js';
import { Modal } from 'antd';
import QRCode from 'qrcode.react';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class RechargeType extends React.Component{
    constructor(props){
        super(props);
        this.state={
            borderColor:1,
            dataCode:"",
            numberID:"",
            qrcode:"",//二维码
            errorMsg:"",//错误返回信息
            visible:false,
        }
    };
    addstrong=(e)=>{
        this.setState({borderColor:e.target.value});
    };
    rechargeSubmit=()=>{
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                'amount':this.props.moneyNum,
                'payType':'AliScanPay',
                'memo':"test"
            },
            explain:{
                numberID:this.state.numberID,
                appToken:token
            }
        };
        let jsons=JSON.stringify(data_code);
        let bytes = utf8.encode(jsons);
        let base64_data=base64.encode(bytes);
        this.setState({dataCode:base64_data});
        const sendMessage={
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body:"data="+base64_data
        };
        if(this.state.borderColor=="1"){
            setTimeout(()=>{
                this.refs.rechargeSubmit.action="http://192.168.1.129:92/web/recharge/apply";
                this.refs.rechargeSubmit.submit();
                this.props.rechargeDefalut(true);
            },0);
        }else if(this.state.borderColor=="2"){
            fetch('http://192.168.1.129:92/v1Pc/rechargeAppScan/apply',sendMessage).then(response => response.json()).then(json => {
              if(json.code=="SUCCESS") {
                  this.setState({qrcode:json.data.qrCode,visible:true});
              }else{
                   this.setSate({errorMsg:json.message,visible:true});
              };
            });
        }

    };
    handleCancel = () => {
        this.props.rechargeDefalut(true);
        this.setState({visible:false});
    };
    componentWillMount(){
        var NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        this.setState({numberID:NUMBERID});
    };
    render(){
        return(
            <div class="form_action">
                <div class="rechargeType">
                    <form action="" method="post" ref="rechargeSubmit" id="rechargeSubmit"  target="_blank">
                        <input name="data" value={this.state.dataCode} type="hidden"/>
                        <div>充值金额：￥<span class="money">{this.props.moneyNum}</span></div>
                        <div>请选择支付方式：</div>
                        <div class="payType">
                            <ul>
                                <li style={{border:this.state.borderColor==1?"2px solid #ff7b98":"1px solid #ddd"}}>
                                    <label >
                                        <input onClick={this.addstrong} type="radio" name="pay" value="1" defaultChecked/>
                                        <img src="/src/assets/images/madailogo.png" alt=""/>
                                        <span class="moresafe">更安全</span>
                                        <span>更快捷</span>
                                    </label>

                                </li>
                                <li style={{border:this.state.borderColor==2?"2px solid #ff7b98":"1px solid #ddd"}}>
                                    <label>
                                        <input onClick={this.addstrong} type="radio" name="pay" value="2"/>
                                        <img src="/src/assets/images/alipay.png" alt=""/>
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <button class="rechargeBtn" type="button" onClick={this.rechargeSubmit}>确认充值 {this.props.moneyNum}元</button>
                        </div>
                    </form>

                    <Modal
                        title=""
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        footer={null}
                        width={500}
                        closable={true}
                        style={{top:200}}
                    >
                        <p style={{textAlign:"center",marginTop:"20px",color:"#0bd9ca"}}>充值金额：{this.props.moneyNum}元</p>
                        <p style={{textAlign:"center",color:"#d2d1d1",margin:"12px 0 30px 0"}}>为确保安全，请尽快完成支付</p>
                        <div  style={{textAlign:"center"}}>
                            <QRCode value={this.state.qrcode} size={200}/>
                        </div>
                        <p style={{textAlign:"center"}}>{this.state.errorMsg}</p>
                        <p style={{textAlign:"center",margin:"20px 0 15px 0"}}>请使用支付宝扫码二维码进行支付</p>
                    </Modal>

                </div>
            </div>
        )
    }
}