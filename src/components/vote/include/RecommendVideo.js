/**
 * Created by user on 2017/8/7.
 */
import React from "react";
import {Link} from 'react-router';
import AllRead from '../../../components/Common/AllRead.js';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class RecommendVideo extends React.Component{
    constructor(){
        super();
        this.state={
            recommendVideo:[],
            numberID:"",
        }
    };
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        this.setState({numberID:NUMBERID});
        const data_code={
            data:{
                'type':4,
                'pageNo':1,
                'perPage':8,
            },
            explain:{
                numberID:this.state.numberID,
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
        fetch('http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do ',sendMessage).then(response => response.json()).then(json => {
            this.setState({recommendVideo:json.data.list});
        });
    }
    render(){
        const {recommendVideo}=this.state;
        return(
            <div class="middle_remen" style={{width: '845px',margin:'20px auto'}}>
                <div class="video_h1">相关视频推荐</div>
                {recommendVideo.length==0?<div style={{fontSize:'16px'}}>暂无数据</div>
                    :<div class="videos">
                        {recommendVideo.map((item,index)=>(
                            <div key={index}  className={(index+1)%4==0? 'class_a float_left video_pre' : 'float_left video_pre'}>
                                <Link target="_blank" to={'/videoMain/'+btoa(item.imageUrls)} style={{background:`url(${item.headPath?item.headPath:"/src/assets/images/video_default.png"})`,backgroundSize:'cover'}}>

                                    <div class="video_mask">
                                        <img src='/src/assets/images/playred.svg'/>
                                    </div>
                                    <div class="detail">
                                        <p class="text">{item.content}</p>
                                        <div class="message clearfix">
                                            <span class="touxia"><img src={item.headPath?item.headPath:"/src/assets/images/touxiang.png"}/></span>
                                            <span class="name">{item.nickName}</span>
                                            <p class="float_right"><i class="icon-looked" style={{fontSize:'16px',marginRight:'2px'}}></i><span style={{verticalAlign:'middle'}}>{item.viewNums}</span></p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                }
            </div>

        )
    }
}
