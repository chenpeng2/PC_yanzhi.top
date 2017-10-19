/**
 * Created by Administrator on 2017/7/12.
 */
import React from 'react';
import { Tabs } from 'antd';
import Paypassword from './detail/paypassword';
import Recharge from  './detail/recharge';
import WithdrawIn from  './detail/withdrawIn';
import Fundflow from './detail/fundflow';
import Bindcard from './jumpPage/bindcard';
import RechargeType from  './jumpPage/rechargeType';
import AllRead from '../../../components/Common/AllRead.js';
import SuccessOrfailed from './jumpPage/successOrfailed';
let base64 =require('base-64');
let utf8 = require('utf8');
const TabPane = Tabs.TabPane;
export default class AccountIntro extends React.Component{
    constructor(){
        super();
        this.state={
            step:true,
            moneyNum:null,
            FULLNAME:"",
            AUTHENSTATUS:"",
            activeKey:"",
            loadingstatu:"",//资金流的加载状态
            datalist:[],//资金流的数据
            pagination:{},//资金流的参数
            withDrawType:false,//提现成功以后返回的状态用来更新资金流
            visible:false,//实名认证成功弹窗
        };
    };
    rechargeSum=(money,moneyNum)=>{
        this.setState({step:money,moneyNum:moneyNum})
    };
    componentWillMount(){
        switch(this.props.accoutType) {
            case 'recharge':
                this.setState({activeKey:'2'})
                break;
            case 'withdraw':
                this.setState({activeKey:'3'})
                break;
            case 'payPassword':
                this.setState({activeKey:'1'})
                break;
            default:
                this.setState({activeKey:'1'})
        };
        const AUTHENSTATUS=decodeURI(AllRead.getCookie('AUTHENSTATUS'));
        const fullname=decodeURI(AllRead.getCookie('FULLNAME'));
        this.setState({
            AUTHENSTATUS:AUTHENSTATUS,
            FULLNAME:fullname,
        });
    };
    componentDidMount(){

    };
    idstatus=(result,name)=>{
        this.setState({AUTHENSTATUS:result,FULLNAME:name,visible:result})
    };
    onTabClick=(key)=>{
        this.setState({activeKey:key});
    };
    changetype=(key)=>{
        this.setState({activeKey:key});
    };
    fetchFundflow=(loadingstatu,datalist,pagination,withDrawType)=>{
        this.setState({
            loadingstatu:loadingstatu,
            datalist:datalist,
            pagination:pagination,
            withDrawType:withDrawType
        });
    };
    changewithDrawType=(statu)=>{
        this.setState({withDrawType:statu});
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    rechargeDefalut=(value)=>{//充值成功以后返回充值默认状态
        this.setState({step:value});
    };
    render(){
        let whichRecharge,bindOrName;
        this.state.step?whichRecharge=<Recharge rechargeSum={(money,moneyNum)=>this.rechargeSum(money,moneyNum)}/>:whichRecharge=<RechargeType rechargeDefalut={this.rechargeDefalut} moneyNum={this.state.moneyNum}/>;
        this.state.AUTHENSTATUS==="false"?bindOrName=<WithdrawIn idstatus={(isok,name)=>this.idstatus(isok,name)}/>: bindOrName=<Bindcard
            fetchFundflow={(loadingstatu,datalist,pagination,withDrawType)=>this.fetchFundflow(loadingstatu,datalist,pagination,withDrawType)}//资金流更新方法
            withDrawSuccess={this.props.balance}
            changetype={this.changetype}
            balanceMoney={this.props.balanceMoney}
            nameValue={this.state.FULLNAME}/>;
        return(
            <div class="account_choose">
                <Tabs  activeKey={this.state.activeKey} onChange={this.onTabClick}>
                    <TabPane tab="支付密码" key="1">
                        <Paypassword></Paypassword>
                    </TabPane>
                    <TabPane tab="充值" key="2">
                        {whichRecharge }
                    </TabPane>
                    <TabPane tab="提现" key="3">
                        {bindOrName}
                    </TabPane>
                    <TabPane tab="资金流" key="4">
                        <Fundflow
                            //资金流一系列参数
                            changewithDrawType={statu=>this.changewithDrawType(statu)}
                            loadingstatu={this.state.loadingstatu}
                            datalist={this.state.datalist}
                            pagination={this.state.pagination}
                            withDrawType={this.state.withDrawType}
                        />
                    </TabPane>
                </Tabs>
                {
                    this.state.visible?  <SuccessOrfailed
                        resultFunction={result=>this.resultFunction(result)}
                        result={this.state.visible}
                        senderror={this.state.senderror}
                        reponpse={this.state.visible}/>:""
                }
            </div>
        )
    }
}