import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {browserHistory} from 'react-router'
import ReMen from '../../Index/Sub_NoLogined/Sub_ReMen'
import Sub_BillBoard from '../../Common/Sub_BillBoard'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
import Bill_Board from '../../Common/Bill_Board'
import {Slider} from 'amazeui-react'
import { Menu,Affix,BackTop,Pagination} from 'antd';
const SubMenu = Menu.SubMenu;
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../Common/AllRead.js'
var sliceArr=AllRead.sliceArr
export default class IndexLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					current:this.props.current,
					getRanking_data:'',
					getNewRanking_data:'',
					getContribuRanking:'',
					getVideoData:[],
					getDynaData:[],
					pageNo_dyna:1,
					total_dyna:0,
					perPage_dyna:10,
					getHuatis:[],
					pageNo_shipin:1,
					total_shipin:0,
					perPage_shipin:12
				}
  };

	componentWillMount(){
			this.getRanking();
			this.getNewRanking();
			this.getContribuRanking();
			this.getHuatis();
		if(this.props.type=='shipin'){
			this.getVideoData()
		}else{
			this.getDynaData(1)
		}
	};
	getDynaData(page){
		var data={type:5,pageNo:page,perPage:10};
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
		console.log(ori_data)
		fetch("http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 this.setState({getDynaData:json.data.list,total_dyna:json.data.total})
	 });
	}
	getVideoData(page){
		var data={type:4,pageNo:page,perPage:12};
			 var ori_data={
				 data:data
			 }
		 var jsons=JSON.stringify(ori_data)
		 var bytes = utf8.encode(jsons);
		 var base64_data=base64.encode(bytes);
		const personalMessage = {
					 method: "post",
					 headers: {
							 'Content-Type': 'application/x-www-form-urlencoded'
					 },
					 body:"data="+base64_data,
		};
		fetch("http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 this.setState({getVideoData:json.data.list,total_shipin:json.data.total})
	 });
	}
	getRanking(){
		var personalMessage=AllRead.getRanking(base64,utf8,1);
		fetch("http://192.168.1.129:92/ranking/v1/getRanking.do", personalMessage)
	 .then(response => response.json()).then(json => {this.setState({getRanking_data:sliceArr(json.data.list,10)[0]});});
	}
	getNewRanking(){
		var personalMessage=AllRead.getRanking(base64,utf8,1);
		fetch("http://192.168.1.129:92/ranking/v1/getNewRanking.do", personalMessage)
	 .then(response => response.json()).then(json => {this.setState({getNewRanking_data:sliceArr(json.data.list,10)[0]});});
	}
	getContribuRanking(){
		var personalMessage=AllRead.getRanking(base64,utf8,1);
		fetch("http://192.168.1.129:92/ranking/v1/rewardRankingList.do", personalMessage)
	 .then(response => response.json()).then(json => {this.setState({getContribuRanking:sliceArr(json.data.list,10)[0]});});
	}
	getHuatis(){
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
		 fetch("http://192.168.1.129:92/beauty/v1/getHotTopic.do", personalMessage)
		.then(response => response.json()).then(json => {
			this.setState({getHuatis:json.data.list})
		});
	}
	handleClick(e){
    console.log('click ', e);
    this.setState({
      current: e.key
    });
    if(e.key==1){
			browserHistory.push('/remen/shipin')
		}else if(e.key==2){
			browserHistory.push('/remen/dyna')
		}else{

		}
  }
	PagenationSearch_shipin(page){
		this.getVideoData(page);
		this.setState({pageNo_shipin:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	PagenationSearch_get(page){
		this.getDynaData(page);
		this.setState({pageNo_dyna:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		var data = ['http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png'];

var themes = ['b1'];

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
			<div class="containers clearfix">
					<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
					<div class="left_content">
							<div class="titles">
									<Menu
										theme={'light'}
										onClick={this.handleClick.bind(this)}
										style={{ width: 130 }}
										defaultOpenKeys={['sub1']}
										selectedKeys={[this.state.current]}
										mode="inline"
									>
											<Menu.Item key="1">热门视频</Menu.Item>
											<Menu.Item key="2">热门动态</Menu.Item>
									</Menu>
									<div class="scan_code">
										<img src="/src/assets/images/scan_code.png"/>
										<p>扫一扫，加入高颜值玩转颜值圈</p>
									</div>
							</div>
							<div class="activities">
								{sliderIntance}
							</div>
					</div>
		  		</Affix>
					<div class="middle_content">
                        {this.props.type==='shipin'?['热门视频'].map((item, index)=>(<ReMen key={index} title={item} datas={this.state.getVideoData} hiddenMore='yes'/>)):<ReMen_Dyna datas={this.state.getDynaData} hiddenMore='yes'/>}
												{this.props.type==='shipin'&&this.state.total_shipin>this.state.perPage_shipin?
												<div class="pagination">
													<Pagination total={this.state.total_shipin} defaultPageSize={this.state.perPage_shipin}
														current={this.state.pageNo_shipin}
														onChange={(page) => this.PagenationSearch_shipin(page)}
						                                    itemRender={(page, type: ['page','prev','next']) => (
						                                        <span style={{padding:'0 3px'}}>
						                                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
						                                            </span>)}/>
										</div>
										:''
										}
												{this.props.type!=='shipin'&&this.state.total_dyna>this.state.perPage_dyna?
												<div class="pagination">
													<Pagination total={this.state.total_dyna} defaultPageSize={this.state.perPage_dyna}
														current={this.state.pageNo_dyna}
														onChange={(page) => this.PagenationSearch_get(page)}
						                                    itemRender={(page, type: ['page','prev','next']) => (
						                                        <span style={{padding:'0 3px'}}>
						                                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
						                                            </span>)}/>
											</div>
											:''
											}
					</div>
					<div class="right_content">
						<Sub_BillBoard title="人气榜" datas={this.state.getRanking_data}/>
						<Sub_BillBoard title="新人榜" datas={this.state.getNewRanking_data}/>
							<Sub_BillBoard title="贡献榜" datas={this.state.getContribuRanking}/>
							<Bill_Board title="话题榜" datas={this.state.getHuatis}/>
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
