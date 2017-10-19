import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
import ReMen from '../../Index/Sub_NoLogined/Sub_ReMen'
import BillBoard from '../../Common/Bill_Board'
import {Slider,ScrollSpyNav,Sticky} from 'amazeui-react'
import { Menu,Affix,BackTop,Pagination} from 'antd';
const SubMenu = Menu.SubMenu;
var base64 =require('base-64')
var utf8 = require('utf8');
import {browserHistory} from 'react-router';
export default class IndexNoLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					current:this.props.current,
					getRanking_data:'',
					getNewRanking_data:'',
					getVideoData:[],
					getDynaData:[],
					getHuatis:[],
					pageNo_get:1,
					total_get:0,
					perPage_get:10,
					pageNo_shipin:1,
					total_shipin:0,
					perPage_shipin:12
				}
  };
	componentWillMount(){
		if(this.props.type=='shipin'){
			this.getVideoData()
		}else{
			this.getDynaData(1)
		}
		this.getHuatis()
	};
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
	getVideoData(page){
 		 var data={type:2,pageNo:page,perPage:12};
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
      fetch("http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do", personalMessage)
     .then(response => response.json()).then(json => {
			 this.setState({getVideoData:json.data.list,total_shipin:json.data.total})
     });
	}
	getDynaData(page){
		var data={type:5,pageNo:page,perPage:10};
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
		fetch("http://192.168.1.129:92/beauty/v3/getDynamicByTypePc.do", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 this.setState({getDynaData:json.data.list,total_get:json.data.total})
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
		this.setState({pageNo_get:page},$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"}));
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
									{this.props.type==='shipin'?['热门视频'].map((item, index)=>(<ReMen key={index} title={item} datas={this.state.getVideoData} hiddenMore='yes'/>)):<ReMen_Dyna hiddenMore='yes' datas={this.state.getDynaData}/>}
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
									{this.props.type!=='shipin'&&this.state.total_get>this.state.perPage_get?
									<div class="pagination">
										<Pagination total={this.state.total_get} defaultPageSize={this.state.perPage_get}
											current={this.state.pageNo_get}
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
						{this.props.type=='shipin'?
							<div>
									{this.state.getHuatis.length==0?''
									:
									<div>
										<BillBoard title="实时热门话题榜" datas={this.state.getHuatis}/>
										<div class="activities logined_activities">
											{sliderIntance}
										</div>
									</div>
									}
								</div>
						:
							<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
								{this.state.getHuatis.length==0?''
								:
								<div>
									<BillBoard title="实时热门话题榜" datas={this.state.getHuatis}/>
									<div class="activities logined_activities">
										{sliderIntance}
									</div>
								</div>
								}
							</Affix>
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
