/**
 * Created by Administrator on 2017/7/27.
 */
import React from 'react';
import { message } from 'antd';
import Gift from './gift';
import AllRead from '../../../components/Common/AllRead.js';
import CollectionResult from './CollectionResult';
import {getCookie,needLogin} from '../../../actions/index.js';
import {connect} from 'react-redux';
let base64 =require('base-64');
let utf8 = require('utf8');
class Videocenrter extends React.Component{
    constructor(props){
        super(props);
        this.state={
            isliked:false,
            collection:false,
            zanId:"",//视频ID
            toggleGift:false,
            giftNum:-1,//送的礼物类型特效
            visible:false,//
            reponpse:"",//返回信息
            animate:false,//+1效果
            zanSum:"",//点赞数量
        };
    };
    componentWillMount() {
        let Sys = {};
        let ua = navigator.userAgent.toLowerCase();
        let s;
        (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
        (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
        if (Sys.firefox||Sys.safari){
            this.props.playpress(false);
        };
    };
    componentDidMount(){
        document.onclick=()=>{
            if(this.state.toggleGift){
                this.setState({toggleGift:false,});
            }
        };
        message.config({
            top: 300,
            duration: 2,
        });
    }
    handleplayer=(e)=>{
        this.video.play();
        this.props.playpress(false);
    };
    playEnd=()=>{
        this.props.playpress(true);
    };
    playstart=()=>{
        this.props.playpress(false);
    };

    likeadd=(e)=>{
        if(!AllRead.getCookie('NICKNAME')){
            this.props.dispatch(needLogin);
            return;
        } else if(this.state.isliked){
            this.fetchfollow('http://192.168.1.129:92/Zan/v1/delDetails.mvc');
            // message.info("取消点赞");
        }else{
            this.fetchfollow('http://192.168.1.129:92/Zan/v1/saveZan.mvc');
        }
    };
    fetchfollow=(url)=>{
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                zanId:this.state.zanId,
                delete:this.state.zanId,
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
            if(json.message=="点赞成功"){
                this.setState({isliked:true,animate:true,zanSum:this.state.zanSum+1});
            }else{
                this.setState({isliked:false,animate:false,zanSum:this.state.zanSum-1});
            }
        });
    };
    componentWillReceiveProps(nextProps){
        let data={...nextProps.data};
        if(nextProps.data.userId !== this.props.data.userId  ) {
            this.setState({isliked: data.praise, zanId: data.dynamicId, collection: data.collect,zanSum:data.praiseNums});
            const data_code = {
                data: {
                    list: [{
                        twitterId: data.dynamicId,
                        userId: data.userId,
                    }]
                },
            };
            let jsons = JSON.stringify(data_code);
            let bytes = utf8.encode(jsons);
            let base64_data = base64.encode(bytes);
            const sendMessage = {
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body: "data=" + base64_data
            };
            fetch('http://192.168.1.129:92/beauty/v1/addViewCount.do', sendMessage).then(response => response.json()).then(json => {

            });
        }
    };
    collection=()=>{
        if(!AllRead.getCookie('NICKNAME')){//未登录弹出登录
            this.props.dispatch(needLogin);
            return;
        } else if(this.state.collection){
            this.collectionFetch('http://192.168.1.129:92/collect//v1/cancelCollect.mvc');
            this.setState({collection:false,visible:true,reponpse:false});
        }else{
            this.collectionFetch('http://192.168.1.129:92/collect//v1/addCollect.mvc');
            this.setState({collection:true,visible:true,reponpse:true});

        };
    };
    collectionFetch=(url)=>{
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                typeId:this.state.zanId,
                collectType:'Dynamic',
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
            if(json.message=="C1000"){
            }
        });
    };
    toggleGift=(e)=>{
        e.nativeEvent.stopImmediatePropagation();
        if(!AllRead.getCookie('NICKNAME')){//未登录弹出登录
            this.props.dispatch(needLogin);
            return;
        };
        this.setState({toggleGift:!this.state.toggleGift});
    };
    closeGift=(close,giftType)=>{
        this.setState({
            toggleGift:close,
            giftNum:giftType,
        });
    };
    resultFunction=(result)=>{
        this.setState({visible:result});
    };
    render(){
        let twitter={...this.props.data};
        return(
            <div class="personal_video" id="personal_video">
                <div class="video_group">
                    <video
                        onEnded={this.playEnd}
                        onPlay={this.playstart}
                        ref={(node)=>this.video=node}
                        width="790" height="488"
                        controls
                        autoPlay={this.props.autoplay} id="video"
                        src={twitter.imageUrls} >

                    </video>
                    <div class="player" style={{display:this.props.playPush?"":"none"}}  onClick={this.handleplayer}  ><img  src="/src/assets/images/playred.svg" alt="" width="100%"/></div>
                    <div class="fly">
                        <dl>
                            <dt onClick={this.likeadd}><img src={this.state.isliked?"/src/assets/images/loved.svg":"/src/assets/images/love.svg"} alt="点赞" width="25px"/></dt>
                            <dd  onClick={this.toggleGift}><img src="/src/assets/images/gift.svg" alt="礼物" width="25px"/></dd>
                            <dd onClick={this.collection}><img src={this.state.collection?"/src/assets/images/shoucanged.svg":"/src/assets/images/shoucang.svg"} alt="收藏" width="25px"/></dd>
                            {/*<dd><img src="/src/assets/images/share.svg" alt="转发" width="25px"/></dd>*/}
                        </dl>
                    </div>
                    <div class={this.state.animate?"addone sixsix":"sixsix"}>+1</div>
                </div>
                <div class="personal_location">
                    <div class="personal_left">
                        <dl>
                            <dt>{twitter.content.length>30?twitter.content.substr(0,30)+"...":twitter.content}</dt>
                            <dd >
                                <span class="location" style={{background:twitter.address!==""?' url("/src/assets/images/lacation.png") no-repeat 0 center':""}}>{twitter.address}</span>
                            </dd>
                        </dl>
                    </div>
                    <div class="personal_right">
                        <dl>
                            <dt>{
                                new Date(twitter.createTime).getFullYear()+"年"
                                +((new Date(twitter.createTime).getMonth()+1)<10?("0"+(new Date(twitter.createTime).getMonth()+1)+"月"):(new Date(twitter.createTime).getMonth()+1)+"月")
                                +(new Date(twitter.createTime).getDate()<10?("0"+new Date(twitter.createTime).getDate()+"日"):(new Date(twitter.createTime).getDate()+"日"))
                              }
                            </dt>
                            <dd><span class="eye">{twitter.viewNums}</span><span class="xin">{this.state.zanSum}</span></dd>
                        </dl>
                    </div>
                </div>
                <div class="giftPlay">
                    {this.state.giftNum<0?'':<img  src={'/src/assets/images/liwu_playpic/'+this.state.giftNum+'.gif'}/>}
                </div>
                <Gift
                    toggleGift={this.state.toggleGift}
                    twitter={this.props.data}
                    closeGift={(close,giftType)=>this.closeGift(close,giftType)}
                />
                {
                    this.state.visible?  <CollectionResult
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
Videocenrter = connect(mapStateToProps, mapDispatchToProps)(Videocenrter)
export default Videocenrter