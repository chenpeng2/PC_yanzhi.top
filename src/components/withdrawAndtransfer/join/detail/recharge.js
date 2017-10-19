 /**
 * Created by Administrator on 2017/7/14.
 */
import React from 'react';
import {Input} from 'antd';
export default class Recharge extends React.Component{
    constructor(){
        super();
        this.state={
            moneyType:true,//判断类型
            moneyNum:null//具体人民币
        }
    }
    recharge=(e)=>{
        const reg=/^[1-9]{1}\d*(\.\d{1,2})?$|(^0\.[1-9]{1,2}$)|(^0\.\d{1}[1-9]{1}$)/,account=reg.test(e.target.value);
        this.setState({moneyType:account,moneyNum:e.target.value});
    };
    stepTwo=()=>{
        if(this.state.moneyNum==""||this.state.moneyNum==null||this.state.moneyNum>1000000){
            this.setState({moneyType:false});
            return;
        };
        this.props.rechargeSum(!this.state.moneyType,this.state.moneyNum);
    };
    render(){
        const message=this.state.moneyType?"":"请输入正确的金额且小数点后不超过2位";
        return(
            <div class="form_action">
                <div class="form_group">
                    <form action="">
                        <div class="rechargeDiv"><Input onChange={this.recharge}  size="large" type="text" placeholder="充值金额（元）"/></div>
                        <div class="error">{message}</div>
                        <div class="btnDiv"><button type="button" class="submitBtn" onClick={this.stepTwo}>确认充值</button></div>
                    </form>
                </div>
            </div>
        )
    }
}