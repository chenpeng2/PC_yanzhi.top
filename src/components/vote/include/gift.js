import React from 'react';
import {Link} from 'react-router';
import {getCookie,needLogin} from '../../../actions/index.js';
import SuccessOrfailed from '../../withdrawAndtransfer/join/jumpPage/successOrfailed.js';
import AllRead from '../../Common/AllRead.js';
var base64 =require('base-64');
var utf8 = require('utf8');
import { message,notification} from 'antd';
export default class Gift extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            choosed:null,
            DiamondMoney:"",//选择礼物
            DiamondBalance:"",//钻石余额
            visible:false,
            response:"",
            senderror:"",//错误信息
        }
    };
    componentWillMount (){
        message.config({
            top: 300,
            duration: 2,
        });
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        if(NUMBERID==""||NUMBERID==null){return}//未登录处理
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
        fetch('http://192.168.1.129:92/product/v1/getDiamond.action',sendMessage).then(response => response.json()).then(json => {
            this.setState({
                DiamondBalance:json.data.accountList.Outcome,
                giftList:json.data
            });
        });
    };
    chooseGift=(e)=>{
        e.nativeEvent.stopImmediatePropagation();
        const choosed=(e.target.getAttribute('data-action'));
        this.setState({
            choosed:choosed,
            DiamondMoney:parseInt(e.target.getAttribute('data-value')),
        });
    };
    buyDimond=(e)=>{
        e.nativeEvent.stopImmediatePropagation();
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        if(this.state.DiamondMoney==""){return};
        let giftType;
        let choosed=this.state.choosed;
        switch(choosed){
            case '0':
                giftType='flower'
                break;
            case '1':
                giftType='beer'
                break;
            case '2':
                giftType='love'
                break;
            case '3':
                giftType='mike'
                break;
            case '4':
                giftType='lips'
                break;
            case '5':
                giftType='ship'
                break;
            case '6':
                giftType='car'
                break;
            case '7':
                giftType='earth'
                break;
            default:
                giftType=''
        };
        const twitter={...this.props.twitter};
        const data_code={
            data:{
                receiveUserId:twitter.userId,
                productType:giftType,
                count:1,
                dynamicId:twitter.dynamicId,
                diamondCount:this.state.DiamondMoney,
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
        fetch('http://192.168.1.129:92/product/v1/sendProduct.action',sendMessage).then(response => response.json()).then(json => {
            if(json.code=="SUCCESS"){
                this.setState({
                    DiamondBalance:json.data.accountList.Outcome,
                });
                this.props.closeGift(false,choosed);
                setTimeout(()=>{
                    this.props.closeGift(false,-1);
                },3000);
            }else if(json.data.code=="A1003"){
                this.setState({visible:true,response:true,senderror:json.data.message});
            }else if(json.data.code=="P1002"){
                this.setState({visible:true,response:false,senderror:json.data.message});
            };
        });
    };
    defalutmao=(e)=>{
        e.nativeEvent.stopImmediatePropagation();
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    render() {
        const giftArr=new Array();
        const giftList={...this.state.giftList};
        giftArr[0]=['/src/assets/images/liwu/hua.png',giftList.flower];
        giftArr[1]=['/src/assets/images/liwu/beer.png',giftList.beer];
        giftArr[2]=['/src/assets/images/liwu/love.png',giftList.love];
        giftArr[3]=['/src/assets/images/liwu/sing.png',giftList.mike];
        giftArr[4]=['/src/assets/images/liwu/mouth.png',giftList.lips];
        giftArr[5]=['/src/assets/images/liwu/beach.png',giftList.ship];
        giftArr[6]=['/src/assets/images/liwu/car.png',giftList.car];
        giftArr[7]=['/src/assets/images/liwu/earth.png',giftList.earth];
        return (
            <div class="giftParents" style={{display:this.props.toggleGift?"":"none"}}>
                <div class="giftImg">
                    {
                        giftArr.map((value,index)=>{
                            return(
                                <dl key={index} data-action={index} data-value={value[1]} class={this.state.choosed==index?"active":null} onClick={this.chooseGift}>
                                    <dt data-action={index} data-value={value[1]}>
                                        <img data-action={index} data-value={value[1]} src={value[0]} alt="" width="100%" height=""/>
                                    </dt>
                                    <dd data-action={index} data-value={value[1]}>
                                        <span data-action={index} data-value={value[1]}>
                                                {value[1]}
                                        </span>
                                        <img data-action={index} data-value={value[1]} src="/src/assets/images/liwu/diomand.svg"/>
                                    </dd>
                                </dl>
                                )
                        })
                    }
                </div>
                <div class="buyGift" onClick={this.defalutmao}>
                    <div class="buyGift_left" onClick={this.defalutmao}>
                        <Link to={"/acoutMain/diamondSupermaker"} target="_blank">
                        <span onClick={this.defalutmao}>充值></span>
                        </Link>
                        <span>余额：{this.state.DiamondBalance}<img src="/src/assets/images/liwu/diomand.svg"/></span>
                    </div>
                    <div class="buyGift_right" onClick={this.defalutmao}>
                        <button type="button" onClick={this.buyDimond}>
                            赠送
                        </button>
                    </div>
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
    };
}
