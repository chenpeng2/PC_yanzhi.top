import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Uploader from './Upload'
import HuoDong from '../../Common/Sub_HuoDong'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../Common/AllRead.js'
import { Pagination } from 'antd';
export default class MyIndex extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getDynaData:[],
					getHuoDong:[],
					pageNo_get:1,
					perPage_get:10,
					total_get:0,
					numberID:''
				}
  };
	componentWillMount() {
				var NUMBERID=AllRead.getCookie('NUMBERID');
				this.setState({numberID:NUMBERID});
				this.getDynaData(decodeURI(NUMBERID),1,this.state.perPage_get);
				this.getHuoDong()
	 }
	getHuoDong(){
		var personalMessage=AllRead.getRanking(base64,utf8,'NOMAL');
		fetch("http://192.168.1.129:92/notice/v1/getNoticeList", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getHuoDong:json.data.noticeList})
	 });
	}
	getDynaData(numberId,pageNo,perPage){
		var data={type:2,pageNo:pageNo,perPage:perPage};
			 var ori_data={
				 data:data,
				 explain: {
	 							appToken:decodeURI(AllRead.getCookie('TOKEN')),
	 							// busType:"notice1/getNoticeList",
	 							// interfaceVersion:'v1',
	 							numberID: numberId || undefined,
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
		fetch("http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getDynaData:json.data.list,total_get:json.data.total})
	 });
	}
	PagenationSearch_get(page){
		this.getDynaData(this.state.numberID,page,this.state.perPage_get);
		this.setState({pageNo_get:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		return (
			<div>
          <Uploader/>
          <div style={{marginTop:'40px'}}><HuoDong datas={this.state.getHuoDong}/></div>
          <ReMen_Dyna logined={'yes'} interesting="need" datas={this.state.getDynaData}/>
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
		);
	};
}
