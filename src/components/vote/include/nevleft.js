/**
 * Created by Administrator on 2017/7/27.
 */
import React from 'react';
import {Link,browserHistory} from 'react-router';
import {message} from 'antd';
import AllRead from '../../../components/Common/AllRead.js';
import FollowResult from './follow';
import {getCookie,needLogin} from '../../../actions/index.js';
import {connect} from 'react-redux';
let base64 =require('base-64');
let utf8 = require('utf8');
class Nevleft extends React.Component{
    constructor(props) {
        super(props)
        let hour, minute
        if (props.data && props.data.states) {
            hour = parseInt(props.data.time / 60)
            minute = props.data.time - (60 * hour)
            console.log(props.data.time, hour, minute)
        }
        this.state = {
            follow: props.data.isLike||false,
            dataList:{},
            time: minute,
            hours: hour,
            timer: 0,
            visible:false,//
            reponpse:"",//返回信息
        }
    };
   componentDidMount(){
       message.config({
           top: 300,
           duration: 2,
       });
       if(this.props.type==='vote') {
           this.timer=setInterval(() => {
               let time = this.state.time, hours = this.state.hours
               time <= 0 ? this.setState({time: 59, hours: hours - 1}) : this.setState({time: time - 1})
           }, 60000)
       }

   };
    componentWillReceiveProps(nextProps){
       let data={...nextProps.data};
       this.setState({follow:data.like||data.isLike,dataList:data});
   };
    componentWillUnmount(){
       clearInterval(this.timer);
    };
    fetchfollow=(url)=>{
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        let data={...this.state.dataList,...this.props.data};
        const data_code={
            data:{
                likeId:data.userId,
                recieverId:data.userId
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
        fetch(url,sendMessage).then(response => response.json()).then(json => {
              if(json.message=="添加喜欢成功"){
                  this.setState({follow:true,visible:true,reponpse:json.message});
              }
              // else{
              //     this.setState({follow:false,visible:true,reponpse:json.message});
              // }
        });
    };
    follow=()=>{
        if(!AllRead.getCookie('NICKNAME')){
            this.props.dispatch(needLogin);
            return;
        }else if(this.state.follow){
            // this.fetchfollow('http://192.168.1.129:92/Fan/v1/noLike.mvc');
        }else {
            this.fetchfollow('http://192.168.1.129:92/Fan/v1/saveFans.mvc');
        }
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    render(){
        let data={...this.state.dataList,...this.props.data};
        let Revenue={...this.props.Revenue};
        return(
            <div class="nev_left"  id="person_message">
                <div class="nev_group">
                    <div class="person_message">
                        <Link to="/zhuye" query={{id:data.userId}} target="_blank">
                            <img src={(data.headPath ?data.headPath+'!GDSIZE':'/src/assets/images/filterBg.png')} alt=""/>
                        </Link>
                        <dl>
                            <Link to="/zhuye" query={{id:data.userId}} target="_blank">
                                <dt>{data.nickName}{data.leaguer?<img  src="/src/assets/images/黄钻.svg"/>:""}</dt>
                            </Link>
                            <dd>{data.signature}</dd>
                        </dl>
                        <span onClick={this.follow}
                              style={{display:this.state.follow?"none":"",background:this.state.follow? "url('/src/assets/images/addguanzhued.svg') no-repeat 5px center":"url('/src/assets/images/addguanzhu.png') no-repeat 8px center"}}>{this.state.follow?"已关注":"关注"}
                        </span>
                    </div>
                    <div class="activetotal">
                        {this.props.type==='vote'?
                            <dl>
                                <dt>已有<span>{data.noPassNumber + data.passNumber||0}人</span>投过</dt>
                                {data.states ?
                                    <dd>投票剩余<span>{this.state.hours}</span>时<span>{this.state.time}</span>分</dd> :
                                    <dd>投票已结束 <span style={{display:'block',padding:0}}>{data.time}</span></dd>}
                            </dl>:
                            <dl>
                                <dt>本月活跃：<span>{Revenue.monthRevenue}</span></dt>
                                <dd>累计活跃：<span>{Revenue.totalRevenue}</span></dd>
                            </dl>
                        }
                    </div>
                    <div class="codedown">
                        <img src="/src/assets/images/codelogo.jpg" alt=""/>
                    </div>
                </div>
                {
                    this.state.visible?  <FollowResult
                        resultFunction={result=>this.resultFunction(result)}
                        result={this.state.visible}
                        reponpse={this.state.reponpse}/>:""
                }
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
Nevleft = connect(mapStateToProps, mapDispatchToProps)(Nevleft)
export default Nevleft
