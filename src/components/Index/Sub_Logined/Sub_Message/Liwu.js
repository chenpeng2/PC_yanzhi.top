import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Tabs,Pagination } from 'antd'
const TabPane = Tabs.TabPane
import Message_Module1 from './Common/message_module1'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../../Common/AllRead.js'
export default class Liwu extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
    				tabPosition: 'top',
						getLiwus:[],
						postLiwus:[],
						getEnd:false,
						postEnd:false,
						firstPost:true,
						pageNo_get:1,
						total_get:0,
						perPage_get:10,
						pageNo_post:1,
						total_post:0,
						perPage_post:10
				}
  };
	search_type(key){
		if(key=="post"&&this.state.firstPost){
			this.postLiwus(1)
		}
	}
	componentWillMount(){
		this.getLiwus(1);
	}
	getLiwus(page){
		var data={pageNo:page,perPage:10};
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
		fetch("http://192.168.1.129:92/product/v1/getReceiveProduct.action", personalMessage)
	 .then(response => response.json()).then(json => {
		 	if(json.code=='SUCCESS'){
				this.setState({getLiwus:json.data.receiveList,total_get:json.data.total});
			}
			this.setState({getEnd:true})
	 });
	}
	postLiwus(page){
		var data={pageNo:page};
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
		fetch("http://192.168.1.129:92/product/v1/getSendProduct.action", personalMessage)
	 .then(response => response.json()).then(json => {
				if(json.code=='SUCCESS'){
				this.setState({postLiwus:json.data.sendList,total_post:json.data.total})
			}
			this.setState({postEnd:true,firstPost:false})
	 });
	}
	PagenationSearch_get(page){
		this.getLiwus(page);
		this.setState({pageNo_get:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_post(page){
		this.postLiwus(page);
		this.setState({pageNo_post:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		var message_module=[1,2,3,4]
		return (
			<div>
					<Tabs tabPosition={this.state.tabPosition} class="two_tabs"  animated={false} onChange={this.search_type.bind(this)}>
							<TabPane tab="收到的礼物" key="get">
								{this.state.getLiwus.length==0&&this.state.getEnd?<div class="nodata_div backColor"><img class="smallPic" src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
								{this.state.getLiwus.length==0&&!this.state.getEnd?<div class="nodata_div"><img class="nodata"  src="/src/assets/images/nodata/load.gif"/></div>
								:
								this.state.getLiwus.map((item,index)=>(
									<Message_Module1 key={index} datas={item}/>
								))
								}
								{this.state.total_post>this.state.perPage_post
								?
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
							</TabPane>
							<TabPane tab="送出的礼物" key="post">
								{this.state.postLiwus.length==0&&this.state.postEnd?<div class="nodata_div backColor"><img class="smallPic"   src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
								{this.state.postLiwus.length==0&&!this.state.postEnd?<div class="nodata_div"><img class="nodata"  src="/src/assets/images/nodata/load.gif"/></div>
								:
								this.state.postLiwus.map((item,index)=>(
									<Message_Module1 key={index} datas={item} post="yes"/>
								))
								}
								{this.state.total_post>this.state.perPage_post
								?
								<div class="pagination pagi_video">
										<Pagination total={this.state.total_post} defaultPageSize={this.state.perPage_post}
											current={this.state.pageNo_post}
											onChange={(page) => this.PagenationSearch_post(page)}
																						itemRender={(page, type: ['page','prev','next']) => (
																								<span style={{padding:'0 3px'}}>
																										{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																										</span>)}/>
				</div>
					:''}
							</TabPane>
					</Tabs>
			</div>
		);
	};
}
