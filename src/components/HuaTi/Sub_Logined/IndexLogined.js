import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Bill_Board_HuaTi from '../../Common/Bill_Board_HuaTi'
import {Slider} from 'amazeui-react'
import { Affix,BackTop,Pagination } from 'antd';
import Module_Text from '../module_text'
import AllRead from '../../Common/AllRead.js'
var base64 =require('base-64')
var utf8 = require('utf8');
import HuoDong from '../../Common/Sub_HuoDong'
export default class IndexNoLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					checkType:'',
					getHuoDong:[],
					getHuati_re:[],
					getHuati_re_pageNo:1,
					getHuati_new:[],
					getHuati_new_pageNo:1,
					numberId:'',
					canyuHuati:[],
					pageNo_re:1,
					total_re:0,
					perPage_re_new:8,
					pageNo_new:1,
					total_new:0
				}
  };
	componentWillMount(){
			var NUMBERID=AllRead.getCookie('NUMBERID');
			this.getHuoDong();
			this.getHuati(0,this.state.getHuati_re_pageNo,8,decodeURI(NUMBERID));
				//已经登陆了
				this.setState({numberId:decodeURI(NUMBERID)});
				this.canyuHuati(decodeURI(NUMBERID))
	};
	canyuHuati(numberId){
		var data={};
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
		fetch("http://192.168.1.129:92/beauty/v1/getTopicbyMy.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({canyuHuati:json.data.topicList})
	 });
	}
	getHuoDong(){
		var personalMessage=AllRead.getRanking(base64,utf8,'NOMAL');
		fetch("http://192.168.1.129:92/notice/v1/getNoticeList", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getHuoDong:json.data.noticeList})
	 });
	}
	getHuati(type,pageNo,perPage,numberId){
		var data={type:type,pageNo:pageNo,perPage:perPage};
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
		console.log(ori_data)
		fetch("http://192.168.1.129:92/beauty/v1/getNewDynamicTopic.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 if(type==0){
			 this.setState({getHuati_re:json.data.list,total_re:json.data.total})
		 }else{
				this.setState({getHuati_new:json.data.list,total_new:json.data.total})
		 }
	 });
	}
	huati_content(key,event){
		if(key=="re"){
			this.setState({checkType:''});
			this.getHuati(0,this.state.getHuati_re_pageNo,8,decodeURI(this.state.numberId));
		}else{
			this.setState({checkType:true});
			this.getHuati(1,this.state.getHuati_new_pageNo,8,decodeURI(this.state.numberId))
		}
	}
	PagenationSearch_re(page){
		this.getHuati(0,page,8,decodeURI(this.state.numberId));
		this.setState({pageNo_re:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_new(page){
		this.getHuati(1,page,8,decodeURI(this.state.numberId));
		this.setState({pageNo_new:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		var data = ['http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png'];
		var huatidata=['/src/assets/images/huati01.png','/src/assets/images/huati01.png']
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
		return (
			<div class="page_huati clearfix">

					<div class="lef_content" >
						<div class="lunbo">
							<HuoDong datas={this.state.getHuoDong}/>
						</div>
						<div class="contents">
								<div class="check_contentsType">
									<button className={this.state.checkType?'':'current'}  onClick={this.huati_content.bind(this,'re')}>最热</button>
									<button className={!this.state.checkType?'':'current'} onClick={this.huati_content.bind(this,'new')}>最新</button>
								</div>
								{this.state.checkType
								?
								<div class="check_contents">
									{this.state.getHuati_new.length==0?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
									:this.state.getHuati_new.map((item,index)=>(
										<div key={index} className={index==this.state.getHuati_re.length-1?"huati last":"huati"}>
												<Module_Text keys={index} datas={item} indexs={index}/>
										</div>
									))
									}
									{this.state.total_new>this.state.perPage_re_new
									?
									<div class="pagination pagi_video">
										<Pagination total={this.state.total_new} defaultPageSize={this.state.perPage_re_new}
											current={this.state.pageNo_new}
											onChange={(page) => this.PagenationSearch_new(page)}
																		itemRender={(page, type: ['page','prev','next']) => (
																				<span style={{padding:'0 3px'}}>
																						{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																						</span>)}/>
				</div>
									:''
									}
								</div>
								:
								<div class="check_contents">
									{this.state.getHuati_re.length==0?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
									:this.state.getHuati_re.map((item,index)=>(
										<div key={index} className={index==this.state.getHuati_re.length-1?"huati last":"huati"}>
												<Module_Text keys={index} datas={item} indexs={index}/>
										</div>
									))
									}
									{this.state.total_re>this.state.perPage_re_new
									?
									<div class="pagination pagi_video">
										<Pagination total={this.state.total_re} defaultPageSize={this.state.perPage_re_new}
											current={this.state.pageNo_re}
											onChange={(page) => this.PagenationSearch_re(page)}
																		itemRender={(page, type: ['page','prev','next']) => (
																				<span style={{padding:'0 3px'}}>
																						{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																						</span>)}/>
				</div>
									:''
									}
								</div>
								}
						</div>
					</div>

					<div class="right_content">
						{this.state.canyuHuati.length!=0?
							<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
								<Bill_Board_HuaTi title="我参与的话题" datas={this.state.canyuHuati.length>10?this.state.canyuHuati.slice(0,10):this.state.canyuHuati}/>
								<div class="activities logined_activities">
									{sliderIntance}
								</div>
							</Affix>
							:<Bill_Board_HuaTi title="我参与的话题" datas={[]}/>
						}
					</div>
					<div class="go_back">
						<BackTop>
							<i class="icon-go_back"></i><span>回顶部</span>
						</BackTop>
					</div>
			</div>
		);
	};
}
