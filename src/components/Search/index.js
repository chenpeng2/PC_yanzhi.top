import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from '../../containers/topper'
import Footer from '../../containers/footer'
import { Tabs,Affix } from 'antd'
const TabPane = Tabs.TabPane
import All from './Sub/all.js'
import Dyna from './Sub/dyna.js'
import User from './Sub/user.js'
import HuaTi from './Sub/huati.js'
import Video from './Sub/video.js'
import Bill_Board_HuaTi from '../Common/Bill_Board_HuaTi.js'
import CryptoJS from 'crypto-js'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../Common/AllRead.js'
var sliceArr=AllRead.sliceArr
import {connect} from 'react-redux'
class Search_Index extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
    				tabPosition: 'top',
						getHotSearch:[],
						getHistorySearch:[],
						pageNo:1,
						getAllDatas:[],
						getUsers:[],
						getVideos:[],
						getDynas:[],
						getTopics:[],
						allNodatas:false,
						search_end:false,
						logined:false,
						activeKey:'all'
				}
  };
	componentWillMount(){
		var searchData=this.props.searchData?this.props.searchData.search:'';
		this.init(searchData);
		// console.log(this.props.params)
	};
	init(searchData){
		var NUMBERID=AllRead.getCookie('NUMBERID');
		// console.log(this.props) 获取到搜索的关键字
		if(NUMBERID){
			this.setState({logined:true})
			this.getAllDatas(searchData,this.state.pageNo,12,NUMBERID);
			this.getHotSearch();
			this.getHistorySearch(NUMBERID)
		}else{
			this.getAllDatas(searchData,this.state.pageNo,12,'');
			this.getHotSearch();
		}
	}
	getHotSearch(){
		var data={};
				 var ori_data={
					 data:data
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
			fetch("http://192.168.1.129:92/keyWord/v1/getHotKeyWord.mvc", personalMessage)
		 .then(response => response.json()).then(json => {
			 this.setState({getHotSearch:json.data.list})
		 });
	}
	getHistorySearch(numberId){
		// 必须登录的
				var data={};
				 var ori_data={
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
			fetch("http://192.168.1.129:92/myKeyWord/v1/getMyKeyWord.mvc", personalMessage)
		 .then(response => response.json()).then(json => {
				this.setState({getHistorySearch:json.data.list})
		 });
	}
	getAllDatas(data,pageNo,perPage,numberId){
	 var data={context:data,pageNo:pageNo,perPage:perPage};
	 	if(numberId==''){
			var ori_data={
				data:data
			}
		}else{
			var ori_data={
				data:data,
				explain: {
								appToken:decodeURI(AllRead.getCookie('TOKEN')),
								// busType:"notice1/getNoticeList",
								// interfaceVersion:'v1',
								numberID: numberId || undefined,
						}
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
	 fetch("http://192.168.1.129:92/beauty/v1/getSearchAll.do", personalMessage)
	.then(response => response.json()).then(json => {
		if(json.message=='参数不能为空'){
			this.setState({allNodatas:true})
		}else{
			this.setState({
				getAllDatas:json.data,
				getUsers:json.data.userInfoList,
				getVideos:json.data.videoList,
				getDynas:json.data.dynamicList,
				getTopics:json.data.topicList,
				allNodatas:false,
				search_end:true
			})
		}
	});
	}
	search_type(key){
		this.setState({activeKey:key})
	}
	changeActiveKey(key){
		this.setState({activeKey:key})
	}
	componentWillReceiveProps(nextprops){
		if(nextprops.search_topic=='need'){
			var searchData=nextprops.searchData?nextprops.searchData.search:'';
			this.init(searchData);
		};

	}
	render() {
		return (
			<div class="page_huati clearfix">
					<div class="lef_content lef_search">
						<div class="search_top">搜索结果</div>
						<Tabs tabPosition={this.state.tabPosition} activeKey={this.state.activeKey}  animated={false} onChange={this.search_type.bind(this)}>
			          <TabPane tab="全部" key="all">
									{this.state.allNodatas?<div class="nodata_div"><img src="/src/assets/images/nodata/nodata.jpg"/></div>:<All datas={this.state.getAllDatas} end={this.state.search_end} changeActiveKey={this.changeActiveKey.bind(this)}/>}
								</TabPane>
			          <TabPane tab="用户" key="user">
									{this.state.allNodatas?<div class="nodata_div"><img src="/src/assets/images/nodata/nodata.jpg"/></div>:<User datas={this.state.getUsers} searchData={this.props.searchData}/>}
								</TabPane>
			          <TabPane tab="视频" key="video">
									{this.state.allNodatas?<div class="nodata_div"><img  src="/src/assets/images/nodata/nodata.jpg"/></div>:<Video datas={this.state.getVideos} searchData={this.props.searchData}/>}
								</TabPane>
								<TabPane tab="动态" key="dyna">
									{this.state.allNodatas?<div class="nodata_div"><img  src="/src/assets/images/nodata/nodata.jpg"/></div>:<Dyna datas={this.state.getDynas} searchData={this.props.searchData}/>}
								</TabPane>
			          <TabPane tab="话题" key="huati">
									{this.state.allNodatas?<div class="nodata_div"><img src="/src/assets/images/nodata/nodata.jpg"/></div>:<HuaTi datas={this.state.getTopics} searchData={this.props.searchData}/>}
							</TabPane>
        		</Tabs>
					</div>
					<div class="right_content">
						{this.state.logined?
						<div>
							<Bill_Board_HuaTi title='热门搜索' datas={this.state.getHotSearch}/>
							{this.state.getHistorySearch.length>=8?
							<Affix offsetTop={20} onChange={affixed => console.log(affixed)}><Bill_Board_HuaTi title='我的历史搜索' datas={this.state.getHistorySearch}/></Affix>
							:
							<Bill_Board_HuaTi title='我的历史搜索' datas={this.state.getHistorySearch}/>
							}
						</div>
						:
						<Affix offsetTop={20} onChange={affixed => console.log(affixed)}><Bill_Board_HuaTi title='热门搜索' datas={this.state.getHotSearch}/></Affix>
						}

					</div>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return {search_topic:state.counter.search_topic}
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Search_Index = connect(mapStateToProps, mapDispatchToProps)(Search_Index)
 export default Search_Index
