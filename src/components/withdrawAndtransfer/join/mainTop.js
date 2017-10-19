/**
 * Created by Administrator on 2017/7/12.
 */
import React from  'react';
import AllRead from '../../../components/Common/AllRead.js';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class MainTop extends React.Component{
    constructor(){
        super();
        this.state={
            balance:null,
            numberID:"",
            NICKNAME:"",//昵称
            HEADPATH:"",//头像
        }
    };
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const NICKNAME=decodeURI(AllRead.getCookie('NICKNAME'));
        const HEADPATH=decodeURI(AllRead.getCookie('HEADPATH'));
        this.setState({numberID:NUMBERID,NICKNAME:NICKNAME,HEADPATH:HEADPATH});
    }
    render(){
        return(
            <div class="account_top diamond_top" style={{width:(this.props.isshow)?"620px":"100%",margin:(this.props.isshow)?"0 auto":"0",padding:this.props.isshow?"30px 0 0 0":"30px 24px 0 0"}}>
                <div class="momentUser"><span>当前账号：</span></div>
                <div class="account_message">
                    <div class="user_left float_left">
                        <ul>
                            <li >
                                 <img src={this.state.HEADPATH!==''?this.state.HEADPATH+'!MIN100':'/src/assets/images/filterBg.png'} alt=""/>
                            </li>
                            <li><span class="userName">{this.state.NICKNAME}</span></li>
                            <li><span>（ID：{this.state.numberID}）</span></li>
                        </ul>
                    </div>
                    <div class="user_right float_right" style={{display:(this.props.isshow)?"none":""}}>
                        <ul>
                            <li><span>账户余额:</span></li>
                            <li><span class="money">￥{this.props.balanceMoney}</span></li>

                        </ul>
                    </div>
                </div>

            </div>
        )
    }
}