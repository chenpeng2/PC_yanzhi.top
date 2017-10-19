import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Tabs,Pagination } from 'antd'
const TabPane = Tabs.TabPane
import Message_Module3 from './Common/message_module3'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../../Common/AllRead.js'
export default class Zan extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					zans:[],
					zan_end:false,
					pageNo_get:1,
					total_get:0,
					perPage_get:10
				}
  };
	componentWillMount(){
		// 评论和赞的接口一样
		this.zans(1)
	}
	zans(page){
		var data={type:1,pageNo:page,perPage:10};
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
		fetch("http://192.168.1.129:92/beauty/v1/getNoOpenZanAndCommentList.do", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
				if(json.code=='SUCCESS'){
				this.setState({zans:json.data.noOpenZanAndCommentInfo,zan_end:true,total_get:json.data.total})
			}
	 });
	}
	PagenationSearch_get(page){
		this.zans(page);
		this.setState({pageNo_get:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
var message_module=[1,2,3,4]
		return (
			<div	class="two_tabs">
				{this.state.zans.length==0&&this.state.zan_end?<div class="nodata_div backColor"><img class="smallPic"  src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
				{this.state.zans.length==0&&!this.state.zan_end?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
				:
				this.state.zans.map((item,index)=>(
					<Message_Module3 key={index} datas={item}/>
				))
				}
				{this.state.total_get>this.state.perPage_get
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
			</div>
		);
	};
}
