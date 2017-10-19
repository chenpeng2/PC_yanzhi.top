import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Sub_BillBoard from '../Common/Sub_BillBoard'
import {Slider} from 'amazeui-react'
import { Affix,BackTop,Pagination } from 'antd';
import ReMen_Dyna from '../Common/Sub_ReMen_Dyna'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../Common/AllRead.js'
import {getCookie,needLogin} from '../../actions/index.js'
import {connect} from 'react-redux'
import {browserHistory} from 'react-router'
import TanKuang from '../Common/TanKuang'
class HuatiDetail extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getDynaData:[],
					pageNo:1,
					getRenqi:[],
					addsocang:false,
					collectCount:'',
					dynamicCount:'',
					joinUserCount:'',
					pageNo_get:1,
					total_get:0,
					perPage_get:10,
					numberId:0,
					message:{},
					sign:'',
					titleId:''
				}
  };
	componentWillMount(){
		//通过传过来的话题来搜索动态列表
		var NUMBERID=AllRead.getCookie('NUMBERID');
		this.setState({logined:AllRead.getCookie('NICKNAME'),numberId:NUMBERID});
		if(NUMBERID){
			this.setState({numberId:decodeURI(NUMBERID)});
			this.getRenqi(this.props.datas.title,decodeURI(NUMBERID));
			this.getHuatis(this.props.datas.title,this.state.pageNo,decodeURI(NUMBERID));
		}else{
			this.getRenqi(this.props.datas.title,'');
			this.getHuatis(this.props.datas.title,this.state.pageNo,'');
		}
	};
	getRenqi(topic,numberId){
		var data={topic:topic};
		var ori_data=numberId==''?{
			 data:data
		}:{
		 data:data,
		 explain: {
						 appToken:decodeURI(AllRead.getCookie('TOKEN')),
						 // busType:"notice1/getNoticeList",
						 // interfaceVersion:'v1',
						 numberID: numberId || '',
				 }

	 }
		 var jsons=JSON.stringify(ori_data)
		 var bytes = utf8.encode(jsons);
		 var base64_data=base64.encode(bytes)
		const personalMessage = {
					 method: "post",
					 headers: {
							 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 body:"data="+base64_data,
		};
		fetch("http://192.168.1.129:92/beauty/v1/getTopicByDynamicSumCount.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getRenqi:json.data.list})
	 });
	}
	getHuatis(topic,pageNo,numberId){
		var data={topic:topic,pageNo:pageNo,perPage:8};
		var ori_data=numberId==''?{
			data:data
	 }
	 :
	 {
		data:data,
		explain: {
						appToken:decodeURI(AllRead.getCookie('TOKEN')),
						// busType:"notice1/getNoticeList",
						// interfaceVersion:'v1',
						numberID: numberId || '',
				}

	}
		 var jsons=JSON.stringify(ori_data)
		 var bytes = utf8.encode(jsons);
		 var base64_data=base64.encode(bytes)
		const personalMessage = {
					 method: "post",
					 headers: {
							 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 body:"data="+base64_data,
		};
		fetch("http://192.168.1.129:92/beauty/v1/getDynamicTopic.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getDynaData:json.data.list,total_get:json.data.total,addsocang:json.data.isCollect,joinUserCount:json.data.joinUserCount,
			 collectCount:json.data.collectCount,dynamicCount:json.data.total,titleId:json.data.dynamicTopicId})
	 });
	}
	cancleAddSoCang(){
		var data={typeId:this.state.titleId,collectType:'Topic'};
			 var ori_data={
				 data:data,
				 explain: {
								 appToken:decodeURI(AllRead.getCookie('TOKEN')),
								 // busType:"notice1/getNoticeList",
								 // interfaceVersion:'v1',
								 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
						 }

			 }
			 console.log(ori_data)
		 var jsons=JSON.stringify(ori_data)
		 var bytes = utf8.encode(jsons);
		 var base64_data=base64.encode(bytes)
		const personalMessage = {
					 method: "post",
					 headers: {
							 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 body:"data="+base64_data,
		};
		console.log(ori_data)
		fetch("http://192.168.1.129:92/collect//v1/cancelCollect.mvc", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 	if(json.code=="C1000"){
				this.setState({sign: '成功', message: {message: '取消收藏成功'}});
 			 	this.setState({addsocang:!this.state.addsocang});
				this.setState({collectCount:this.state.collectCount-1})
			}else{
				this.setState({sign: '失败', message: {message: '取消收藏失败'}});
			}
	 });
	}
	AddSoCang(){
		var data={typeId:this.state.titleId,collectType:'Topic'};
			 var ori_data={
				 data:data,
				 explain: {
								 appToken:decodeURI(AllRead.getCookie('TOKEN')),
								 // busType:"notice1/getNoticeList",
								 // interfaceVersion:'v1',
								 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
						 }

			 }
		 var jsons=JSON.stringify(ori_data)
		 var bytes = utf8.encode(jsons);
		 var base64_data=base64.encode(bytes)
		const personalMessage = {
					 method: "post",
					 headers: {
							 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 body:"data="+base64_data,
		};
		fetch("http://192.168.1.129:92/collect//v1/addCollect.mvc", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json);
		 	if(json.code=="C1000"){
				this.setState({sign: '成功', message: {message: '收藏成功'}});
 			 	this.setState({addsocang:!this.state.addsocang});
				this.setState({collectCount:this.state.collectCount+1})
			}else{
				this.setState({sign: '失败', message: {message: '收藏失败'}});
			}

	 });
	}
	addsocang(){
		if(!AllRead.getCookie('NICKNAME')){
		 this.props.dispatch(needLogin)
	 }else{
		 console.log(this.state.addsocang)
		 if(this.state.addsocang){
			 //取消收藏
			 this.cancleAddSoCang();
		 }else{
			 this.AddSoCang()
		 }
	 }
	}
	fabu_dyna(){
		if(!AllRead.getCookie('NICKNAME')){
		 this.props.dispatch(needLogin)
	 }else{
		 window.open('/index/index?title='+this.props.datas.title,'_blank')
	 }
	}
	PagenationSearch_get(page){
		this.getHuatis(this.props.datas.title,page,decodeURI(this.state.numberId));
		this.setState({pageNo_get:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		var data = ['http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png'];
		var huatidata=['./src/assets/images/huati01.png','./src/assets/images/huati01.png']
		var themes = ['b1'];
		var huati_themes=['a4']
		var sliderIntance = (
			<div>
				{themes.map(function(t, i) {
					return (
						<div key={i} className="am-margin-bottom">
							<Slider theme={t}>
								{data.map(function(item, i) {
									return (
										<Slider.Item key={i}>
											<img src={item} />
										</Slider.Item>
									);
								})}
							</Slider>
						</div>
					);
				})}
			</div>
		);
		var huati_text=[1,2,3,4,5]
		return (
			<div class="page_huati clearfix">

					<div class="lef_content">
						<div class="top_detail" style={{background:'url("/src/assets/images/HuaTi_Detail.png")'}}>
							<h1>{this.props.datas.title}</h1>
							<div class="operate">
								<button class="left" onClick={this.addsocang.bind(this)}>
									 <i className={this.state.addsocang?'icon-guanzhued':"icon-guanzhu"}></i>
									 {this.state.addsocang? <span >已收藏</span> : <span>收藏</span>}
								 </button>
								<button class="right" onClick={this.fabu_dyna.bind(this)}><i class="icon-fabu"></i><span>发布动态</span></button>
							</div>
							<div class="details">
								<div class="details_pre"><p><span>{this.state.joinUserCount}</span>人</p><p>讨论</p></div>
								<div class="details_pre"><p><span>{this.state.dynamicCount}</span>条</p><p>相关动态</p></div>
								<div class="details_pre"><p><span>{this.state.collectCount}</span>人</p><p>收藏</p></div>
							</div>
						</div>
						<div class="detail_contents">
								<ReMen_Dyna logined={'yes'}    datas={this.state.getDynaData} interesting=''/>
						</div>
						{this.state.total_get>this.state.perPage_get?
						<div class="pagination pagi_video">
							<Pagination total={this.state.total_get} defaultPageSize={this.state.perPage_get}
								current={this.state.pageNo_get}
								onChange={(page) => this.PagenationSearch_get(page)}
															itemRender={(page, type: ['page','prev','next']) => (
																	<span style={{padding:'0 3px'}}>
																			{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																			</span>)}/>
					</div>
					:''}
					</div>

					<div class="right_content">
							{this.state.getRenqi.length==0?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
							:
							<Sub_BillBoard title="话题人气榜" datas={this.state.getRenqi}/>
							}
					</div>
					<div class="go_back">
						<BackTop>
							<i class="icon-go_back"></i><span>回顶部</span>
						</BackTop>
					</div>
					<TanKuang flags={this.state.sign} message={this.state.message}
										cancel={this.cancel}/>
			</div>
		);
	};
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
HuatiDetail = connect(mapStateToProps, mapDispatchToProps)(HuatiDetail)
 export default HuatiDetail
