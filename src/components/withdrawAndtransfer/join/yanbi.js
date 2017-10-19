/**
 * Created by Administrator on 2017/7/21.
 */
import React from 'react';
import Paypwd from './jumpPage/paypwd';
import {Link} from 'react-router';
import AllRead from '../../../components/Common/AllRead.js';
import {Checkbox} from 'antd';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class Yanbi extends React.Component{
    constructor(){
        super();
        this.state={
            choosed:"4",
            datatype:"3",
            visible:false,
            DiamondMoney:1048,
            count:3668,
            checked:true,
            DiamondBalance:"",//钻石余额
            yanbi:"",//颜币余额
        }
    }
    checkboxChange=(e)=>{
        this.setState({checked:!this.state.checked})
        // console.log(`checked = ${e.target.checked}`);
    };
    paytype=(e)=>{
        const datatype=e.target.getAttribute('data-type');
        this.setState({datatype:datatype});
    };
    rechargeSum=(e)=>{
        const choosed=(e.target.getAttribute('data-action'));
        this.setState({
            choosed:choosed,
            DiamondMoney:parseInt(e.target.getAttribute('data-money')),
            count:parseInt(e.target.getAttribute('data-count')),

        });
    };
    paySubmit=()=>{
        if(!this.state.checked){return;}
        this.setState({visible:true});
    };
    closePicker=(visible,DiamondBalance)=>{
        this.setState({visible:visible,DiamondBalance:DiamondBalance});

    };
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            explain:{
                numberID:NUMBERID,
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
        fetch('http://192.168.1.129:92/account/v1/getVirtualAccount.action',sendMessage).then(response => response.json()).then(json => {
            this.setState({DiamondBalance:json.data.accountList.Outcome,yanbi:json.data.accountList.Income});
        });
    };
    render(){
        const rechargeList=new Array();
        rechargeList[0]=[30,'6￥'];
        rechargeList[1]=[90,'18￥'];
        rechargeList[2]=[340,'68￥'];
        rechargeList[3]=[2090,'418￥'];
        rechargeList[4]=[5240,'1048￥'];
        // rechargeList[5]=["自定义","充值数量"];
        return(
            <form action="">
                <div class="business">
                    <div class="yanbi_recharge">
                        <span>颜币：{this.state.yanbi}</span>
                        {/*暂时不做*/}
                        {/*<button class="yanbiBtn" type="button">提现</button>*/}
                    </div>
                    <div class="diamond">
                        <span class="diamond_money">钻石余额：{this.state.DiamondBalance}</span>
                    </div>
                    <div class="recharge_choose">
                        <div>充值数量：</div>
                        <div class="dlgroup">
                            {
                                rechargeList.map((value,index)=>{
                                    return(
                                        <dl class={this.state.choosed==index?"active":null} data-action={index} data-money={value[1]} data-count={value[0]} key={index} onClick={e=>this.rechargeSum(e)} >
                                            <dt data-action={index} data-money={value[1]} data-count={value[0]}>
                                                {value[0]}
                                            </dt>
                                            <dd data-action={index} data-money={value[1]} data-count={value[0]}>
                                                {value[1]}
                                            </dd>
                                        </dl>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div class="pay_money">
                        应付金额：<span>{this.state.DiamondMoney}</span>元
                    </div>
                    <div class="payType">
                        <div>支付方式：</div>
                        <ul>
                            {/*<li data-type="1" class={this.state.datatype=="1"?"active":null} onClick={this.paytype}><img data-type="1"  src="/src/assets/images/alipay.png" alt=""/></li>*/}
                            {/*<li data-type="2" class={this.state.datatype=="2"?"active":null}  onClick={this.paytype}><img data-type="2" src="/src/assets/images/wechatpay.png" alt=""/></li>*/}
                            <li data-type="3" class={this.state.datatype=="3"?"active":null}  onClick={this.paytype}><img  data-type="3" src="/src/assets/images/yuepay.svg" width="30" height="30" alt=""/><span  data-type="3">账户余额</span></li>
                        </ul>
                    </div>
                    <div class="rightawayPay">
                        <button class="paybtn" type="button" onClick={this.paySubmit}>立即支付</button>
                        <div class="checkbox">
                            <Checkbox defaultChecked={true} onChange={this.checkboxChange}>我已阅读并同意</Checkbox>
                            <Link to={'/'} target="_blank">
                                <span style={{fontSize:'12px',position:'relative',right:'16px',color:'#108ee9'}}>《用户充值协议》</span>
                            </Link>
                            <span class="error" style={{fontSize:'12px'}}>{this.state.checked?"":"请您先阅读用户充值协议"}</span>
                        </div>
                        <div  class="customer-service">充值遇到问题？请点击右上角联系客服<span >小颜~</span></div>
                    </div>
                    <Paypwd
                        balance={this.props.balance}
                        Paypwd={this.state.visible}
                        paySubmit={(visible,DiamondBalance)=>this.closePicker(visible,DiamondBalance)}
                        DiamondMoney={this.state.DiamondMoney}
                        DiamondBalance={this.state.DiamondBalance}
                        count={this.state.count}
                        // checked={this.state.checked}
                    />
                </div>
            </form>
        )
    }
}