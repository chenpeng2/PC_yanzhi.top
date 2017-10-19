/**
 * Created by Administrator on 2017/7/27.
 */
import React from 'react';
import {browserHistory} from 'react-router';
import {Pagination} from 'antd';
let base64 =require('base-64');
let utf8 = require('utf8');
export default class Nevright extends React.Component{
    constructor(props){
        super(props);
        this.state={
            videoList:[],
            current:1,//当前页数
            params:{},//保存父组件传过来的数据
        }
    };
    player=(e)=>{
        this.props.changesrc(e.target.getAttribute('data-action'));
        this.props.autoplay(true);
        this.props.playpress(false);
        this.props.checkType("");
        browserHistory.push('/videoMain/'+e.target.getAttribute('data-action'));
    };
    componentWillReceiveProps(nextProps){
        this.setState({params:nextProps.data});
        if(nextProps.data.dynamicId !== this.props.data.dynamicId  ){
            let data={...nextProps.data};
            const data_code={
                data:{
                    userId:data.userId,
                    dynamicId:data.dynamicId,
                    video:1,
                    pageNo:this.state.current,
                    perPage:6,
                },
            };
            let jsons=JSON.stringify(data_code);
            let bytes = utf8.encode(jsons);
            let base64_data=base64.encode(bytes);
            const sendMessage={
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                body:"data="+base64_data
            };
            fetch('http://192.168.1.129:92/beauty/v2/getTaOtherDynamic',sendMessage).then(response => response.json()).then(json => {
                this.setState({
                    videoList:json.data.list,
                    videolenght:json.data.total,
                });
            });
        };
    };
    changePage=(page)=>{
      let data={...this.state.params};
        const data_code={
            data:{
                userId:data.userId,
                dynamicId:data.dynamicId,
                video:1,
                pageNo:page,
                perPage:6,
            },
        };
        let jsons=JSON.stringify(data_code);
        let bytes = utf8.encode(jsons);
        let base64_data=base64.encode(bytes);
        const sendMessage={
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body:"data="+base64_data
        };
        fetch('http://192.168.1.129:92/beauty/v2/getTaOtherDynamic',sendMessage).then(response => response.json()).then(json => {
            this.setState({
                videoList:json.data.list,
                videolenght:json.data.total,
            });
        });
    };
    componentDidMount (){

    };
    render(){
        let {videoList}=this.state;
        const selectBankList=videoList.length?videoList.map((value,index)=>(
            <div class="otherVideo" key={index}>
                {/*<video onClick={e=>this.player(e)}  width="100" height="60" poster="" src={value.imageUrls} data-src={value.imageUrls}>*/}
                {/*</video>*/}
                <div
                    data-action={value.dynamicId}
                    onClick={e=>this.player(e)}
                    style={{width:"100px",height:"60px",display:"inline-block"}}
                >
                    <img src={value.videoThumb} width="100px" height="60px" alt=""  data-action={value.dynamicId}/>
                </div>
                <dl>
                    <dt style={{height:"42px"}}
                        data-action={value.dynamicId}
                        onClick={e=>this.player(e)}

                    >
                        {value.content.length>22?value.content.substr(0,19)+"...":value.content}
                    </dt>
                    <dd><span class="eye">{value.viewNums}</span><span class="xin">{value.praiseNums}</span></dd>
                </dl>
                <div
                    data-action={value.dynamicId}
                    onClick={e=>this.player(e)}
                      class="player2"
                >
                    <img  src="/src/assets/images/playred.svg"  data-action={value.dynamicId} alt="" width="25px"/>
                </div>
            </div>
        )): <img width='100%' src="/src/assets/images/nodata/nodata2.jpg" alt=""/>;
        return(
            <div class="nev_right">
                <div class="nev_title">TA的其它视频</div>
                {selectBankList}
                {/*视频只显示6条 以下分页暂时注释*/}
                {/*<Pagination defaultCurrent={this.state.current} defaultPageSize={6}  total={this.state.videolenght} onChange={this.changePage}/>*/}
            </div>
        )
    }
}