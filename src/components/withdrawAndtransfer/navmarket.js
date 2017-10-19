/**
 * Created by Administrator on 2017/7/12.
 */
import React from 'react';
import { Tabs, Select } from 'antd';
import MainTop from './join/mainTop';
import AccountIntro from './join/accountIntro';
import Yanbi from './join/yanbi';
const TabPane = Tabs.TabPane;
const Option = Select.Option;
let base64 =require('base-64');
let utf8 = require('utf8');
import AllRead from '../../components/Common/AllRead.js';
export default class Navmarket extends React.Component{
    constructor(){
        super();
        this.state={
            tabPosition: 'left',
            isshow:true,
            balanceMoney:"",
            defaultActiveKey:"2",//默认的主tabs
        }
    };
    componentWillMount(){
        switch(this.props.type) {
            case 'diamondSupermaker':
                this.setState({defaultActiveKey:'1'});
                break;
            case 'user':
                this.setState({defaultActiveKey:'2'});
                break;
            default:
                this.setState({defaultActiveKey:'2'});
        };
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                'numberID':NUMBERID,
            },
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
        fetch('http://192.168.1.129:92/account/accountBalance.do',sendMessage).then(response => response.json()).then(json => {
            if(json.code=="SUCCESS"){
                this.setState({balanceMoney:json.data.balance})
            }
        });

    };
    componentDidMount(){

    };
    balance=(value)=>{
        this.setState({balanceMoney:value});
    };

    callback=(key)=>{
      this.setState({defaultActiveKey:key});
    };
    render() {
        return (
            <div className="account_money">
                <Tabs tabPosition={this.state.tabPosition} activeKey={this.state.defaultActiveKey} onChange={this.callback} animated={false}>
                    <TabPane tab="钻石市场" key="1">
                        <MainTop
                            isshow={this.state.isshow}
                            balanceMoney={this.state.balanceMoney}
                        >
                        </MainTop>
                        <Yanbi
                            balance={value=>this.balance(value)}
                        >
                        </Yanbi>
                    </TabPane>
                    <TabPane tab="账户" key="2">
                        <MainTop
                            balanceMoney={this.state.balanceMoney}
                        >
                        </MainTop>
                        <AccountIntro
                            balance={value=>this.balance(value)}
                            balanceMoney={this.state.balanceMoney}
                            accoutType={this.props.type}
                        >

                        </AccountIntro>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
