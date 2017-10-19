/**
 * Created by Administrator on 2017/7/27.
 */
import React from 'react';
import Nevleft from './include/nevleft';
import Nevright from './include/nevright';
import Videocenter from './include/videocenter';
import PinLun from '../Common/Pin_Lun';
import AllRead from '../../components/Common/AllRead.js';
import RecommendVideo from  './include/RecommendVideo';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class VideoDetail extends React.Component{
    constructor(props){
        super(props);
        this.state={
            playPush:true,
            autoplay:false,
            datalist:{content: ''},//动态ID的数据
            Revenue:"",//活跃度
            dynamicId:"",//动态ID
            checkType:"",
            content:""
        }
    };
    fetch=()=>{//视频数据
        let NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        let data_code;
        if(!AllRead.getCookie('NICKNAME')){
             data_code={
                data:{
                    twitterId:this.state.dynamicId,
                }
            };
        }else{
             data_code={
                data:{
                    twitterId:this.state.dynamicId,
                },
                explain:{
                    numberID:NUMBERID,
                    appToken:token
                }
            };
        };
        let jsons=JSON.stringify(data_code);
        let bytes = utf8.encode(jsons);
        let base64_data=base64.encode(bytes);
        const sendMessage={
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body:"data="+base64_data
        };
        fetch('http://192.168.1.129:92/beauty/v2/twitterDetail.do',sendMessage).then(response => response.json()).then(json => {
            this.setState({
                datalist:json.data.twitter,
                Revenue:json.data,
                userId:json.data.twitter.userId
            });
        });
    };
    autoplay=(value)=>{
        this.setState({autoplay:value});
    };
    changesrc=(dynamicId)=>{
        this.setState({dynamicId:dynamicId});
        setTimeout(()=>{
            this.fetch();
        },0)
    };
    playpress=(press)=>{
        this.setState({playPush:press})
    };
    componentWillMount(){
      // this.setState({dynamicId:this.props.videosrc,});
    };
    componentDidMount(){
        this.setState({dynamicId:this.props.videosrc,},()=>this.fetch());
    };
    checkType=()=>{
        this.setState({checkType:false});
    };
    render(){
        return(
            <div class="videomain">
                <Nevleft data={this.state.datalist} Revenue={this.state.Revenue}/>
                <Videocenter
                    data={this.state.datalist}
                    playpress={press=>this.playpress(press)}
                    playPush={this.state.playPush}
                    autoplay={this.state.autoplay}
                />
                <Nevright
                    data={this.state.datalist}
                    playpress={press=>this.playpress(press)}
                    changesrc={dynamicId=>this.changesrc(dynamicId)}
                    autoplay={autoplay=>this.autoplay(autoplay)}
                    checkType={this.checkType}
                />
                <div className="remen_detail" style={{clear:"both",marginLeft:"270px",width:"792px",paddingTop:"20px",overflow:"hidden"}}>
                    <PinLun width_text="605" width_line="700" dynamicId={this.state.dynamicId} checkType={this.state.checkType}/>
                </div>
                {/*其他视频推荐暂时取消*/}
                {/*<RecommendVideo/>*/}
            </div>
        )
    }
}
