import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Tabs,Pagination } from 'antd'
const TabPane = Tabs.TabPane
import Sub_Remen_Dyna from '../../Common/Sub_ReMen_Dyna'
import Module_Text from '../../HuaTi/module_text'
import AllRead from '../../Common/AllRead.js'
var base64 =require('base-64')
var utf8 = require('utf8');
import { browserHistory } from 'react-router'
export default class My_Collection extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
    				tabPosition: 'top',
						search_focus:true,
						dynas:[],
						videos:[],
						zans:[],
						huatis:[],
						dyna_end:false,
						video_end:false,
						zan_end:false,
						huati_end:false,
						pageNo_dyna:1,
						total_dyna:0,
						perPage_dyna:7,
						pageNo_video:1,
						total_video:0,
						perPage_video:5,
						pageNo_zan:1,
						total_zan:0,
						perPage_zan:7,
						pageNo_huati:1,
						total_huati:0,
						perPage_huati:10,
						searchText:''
				}
  };
	componentWillMount(){
		this.getCollections(1,'',1,7);
	}
	search_type(key){
		if(key=='dyna'&&this.state.dynas.length==0){
			this.getCollections(1,'',1,7);
		}
		if(key=='video'&&this.state.videos.length==0){
			this.getCollections(2,'',1,5);
		}
		if(key=='zan'&&this.state.zans.length==0){
			this.getCollections(0,'',1,7);
		}
		if(key=='huati'&&this.state.huatis.length==0){
			this.getCollections(3,'',1,10);
		}
	}
	search_focus(){
		this.setState({search_focus:false})
	}
	search_blur(e){
		if(e.target.value==''){
			this.setState({search_focus:true})
		}
	}
	keylogin(type,e){console.log(e.target.value)
		let searchData=e.target.value;
		let typ,perPage;
		if(e.keyCode == "13"){
			if(type=='dyna'){
				typ=1;
				perPage=7
			}else if(type=='video'){
				typ=2;
				perPage=5
			}else if(type=='zan'){
				typ=0;
				perPage=7
			}else{
				typ=3;
				perPage=10
			}
			this.setState({searchText:searchData})
			this.getCollections(typ,searchData,1,perPage)
	 }
	}
	getCollections(number,content,page,perPage){
		var data={type:number,content:content,pageNo:page,perPage:perPage};
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
		fetch("http://192.168.1.129:92/beauty/v3/getMyDynamicByTypePc.do", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 if(number==1){this.setState({dynas:json.data.list,dyna_end:true,total_dyna:json.data.total})}
		 else if(number==0){this.setState({zans:json.data.list,zan_end:true,total_zan:json.data.total})}
		 else if(number==2){this.setState({videos:json.data.list,video_end:true,total_video:json.data.total})}
		 else{this.setState({huatis:json.data.list,huati_end:true,total_huati:json.data.total})}
	 })
	}
	PagenationSearch_dyna(page){
			this.getCollections(1,this.state.searchText,page,7)
			this.setState({pageNo_dyna:page},()=>{$("html, body").animate({
						scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_video(page){
			this.getCollections(2,this.state.searchText,page,5)
			this.setState({pageNo_video:page},()=>{$("html, body").animate({
						scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_zan(page){
			this.getCollections(0,this.state.searchText,page,7)
			this.setState({pageNo_zan:page},()=>{$("html, body").animate({
						scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_huati(page){
			this.getCollections(3,this.state.searchText,page,10)
			this.setState({pageNo_huati:page},()=>{$("html, body").animate({
						scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		var huati=[1,2,3,4,5]
		return (
			<div class="myindex_collection">
			<Tabs tabPosition={this.state.tabPosition}   animated={false} onChange={this.search_type.bind(this)}>
					<TabPane tab="动态" key="dyna">
						<div>
								<div class="collection_search"><input type='text' onKeyDown={this.keylogin.bind(this,'dyna')} className={this.state.search_focus?'opacity':''} onFocus={this.search_focus.bind(this)} onBlur={this.search_blur.bind(this)}/>
								{this.state.search_focus?<div><i class="icon-sousuo"></i><span>搜索我收藏的动态</span></div>:''}
								</div>
								<Sub_Remen_Dyna logined='yes' interesting="" datas={this.state.dynas} end={this.state.dyna_end}/>
								{this.state.total_dyna>this.state.perPage_dyna
								?
								<div class="pagination pagi_video">
			    <Pagination total={this.state.total_dyna} defaultPageSize={this.state.perPage_dyna}
						current={this.state.pageNo_dyna}
						onChange={(page) => this.PagenationSearch_dyna(page)}
			                            itemRender={(page, type: ['page','prev','next']) => (
			                                <span style={{padding:'0 3px'}}>
			                                    {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
			                                    </span>)}/>
			  </div>
				:''
				}
						</div>
					</TabPane>
					<TabPane tab="视频" key="video">
					<div>
							<div class="collection_search"><input type='text' onKeyDown={this.keylogin.bind(this,'video')} className={this.state.search_focus?'opacity':''} onFocus={this.search_focus.bind(this)} onBlur={this.search_blur.bind(this)}/>
							{this.state.search_focus?<div><i class="icon-sousuo"></i><span>搜索我收藏的视频</span></div>:''}
							</div>
							<Sub_Remen_Dyna logined='yes' interesting="" datas={this.state.videos} end={this.state.video_end}/>
								{this.state.total_video>this.state.perPage_video
								?
								<div class="pagination pagi_video">
								<Pagination total={this.state.total_video} defaultPageSize={this.state.perPage_video}
			 					 current={this.state.pageNo_video}
			 					 onChange={(page) => this.PagenationSearch_video(page)}
																itemRender={(page, type: ['page','prev','next']) => (
																		<span style={{padding:'0 3px'}}>
																				{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																				</span>)}/>
								</div>
								:''
								}
					</div>
					</TabPane>
					<TabPane tab="我的赞" key="zan">
					<div>
							<div class="collection_search"><input type='text' onKeyDown={this.keylogin.bind(this,'zan')} className={this.state.search_focus?'opacity':''} onFocus={this.search_focus.bind(this)} onBlur={this.search_blur.bind(this)}/>
							{this.state.search_focus?<div><i class="icon-sousuo"></i><span>搜索我点的赞</span></div>:''}
							</div>
							<Sub_Remen_Dyna logined='yes' interesting="" datas={this.state.zans} end={this.state.zan_end}/>
							{this.state.total_zan>this.state.perPage_zan
							?
							<div class="pagination pagi_video">
								<Pagination total={this.state.total_zan} defaultPageSize={this.state.perPage_zan}
								 current={this.state.pageNo_zan}
								 onChange={(page) => this.PagenationSearch_zan(page)}
																itemRender={(page, type: ['page','prev','next']) => (
																		<span style={{padding:'0 3px'}}>
																				{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																				</span>)}/>
			</div>
			:''
			}
					</div>
					</TabPane>
					<TabPane tab="话题" key="huati">
					<div>
							<div class="collection_search"><input type='text' onKeyDown={this.keylogin.bind(this,'huati')} className={this.state.search_focus?'opacity':''} onFocus={this.search_focus.bind(this)} onBlur={this.search_blur.bind(this)}/>
							{this.state.search_focus?<div><i class="icon-sousuo"></i><span>搜索我的话题</span></div>:''}
							</div>
							 <div class="soucang_huati">
								 {this.state.huatis.length==0&&this.state.huati_end?<div class="nodata_div"><img class="smallPic" src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
 								{this.state.huatis.length==0&&!this.state.huati_end?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
							 	:
								<div>
									{this.state.huatis.map((item,index)=>(
									 <Module_Text noadd="yes" key={index} keys={index} datas={item} indexs={index} />
								 	))}
								</div>
								}
							 </div>
							 {this.state.total_huati>this.state.perPage_huati
							 ?
							<div class="pagination pagi_video">
								<Pagination total={this.state.total_huati} defaultPageSize={this.state.perPage_huati}
								 current={this.state.pageNo_huati}
								 onChange={(page) => this.PagenationSearch_huati(page)}
																itemRender={(page, type: ['page','prev','next']) => (
																		<span style={{padding:'0 3px'}}>
																				{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
																				</span>)}/>
			</div>
			:''
			}
					</div>
					</TabPane>
			</Tabs>
			</div>
		);
	};
}
