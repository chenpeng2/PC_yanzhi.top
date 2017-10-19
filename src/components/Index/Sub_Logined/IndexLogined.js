import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Middle_Index from './Middle_Index'
import Bill_Board from '../../Common/Bill_Board'
import {Slider} from 'amazeui-react'
import { Affix,BackTop,Menu,Icon } from 'antd';
const SubMenu = Menu.SubMenu;
import {Link,browserHistory} from 'react-router'
import My_Message from './My_Message'
import My_Collection from './My_Collection'
import {connect} from 'react-redux'
import {applyMember} from '../../../actions/index.js'
import AllRead from '../../Common/AllRead.js'
var base64 =require('base-64')
var utf8 = require('utf8');
 class IndexLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					current:'',
					openKeys: [],
					type:'',
					params_a:'',
					params_b:'',
          liwuCount:0,
          pinglunCount:0,
          zanCount:0,
          getHuatis:[]
				}
  };

	componentWillMount(){
		let params=this.props.props.params;
		this.setState({params_a:params.typea,params_b:params.typeb});
    this.getCount();
    this.getHuatis()
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
  getCount(){
		var data={};
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
		fetch("http://192.168.1.129:92/message/v2/getMessageCountPc.do", personalMessage)
	 .then(response => response.json()).then(json => {
      this.setState({liwuCount:json.data.noOpenProductCount,pinglunCount:json.data.noOpenCommentCount,zanCount:json.data.noOpenZanCount})
	 });
	}
	push_url(key,event){
		console.log(key)
		const w=window.open('about:blank');
		w.location.href='#/remen/detail?a=1'
	}
	handleClick_M = (e) => {
	 console.log('Clicked: ', e);
	 this.setState({ current: e.key });
	//  this.setState({type:''});
	this.selectType();
 }
 onOpenChange = (openKeys) => {
	 const state = this.state;
	 const latestOpenKey = openKeys.find(key => !(state.openKeys.indexOf(key) > -1));
	 const latestCloseKey = state.openKeys.find(key => !(openKeys.indexOf(key) > -1));

	 let nextOpenKeys = [];
	 if (latestOpenKey) {
		 nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
	 }
	 if (latestCloseKey) {
		 nextOpenKeys = this.getAncestorKeys(latestCloseKey);
	 }
	 this.setState({ openKeys: nextOpenKeys });
 }
 getAncestorKeys = (key) => {
	 const map = {
		 sub3: ['sub2'],
	 };
	 return map[key] || [];
 }
 check_type(typ,event){
	 this.setState({params_a:typ});
	 if(typ=='message'){
		 this.setState({current:'3'});
		 browserHistory.push('/index/'+typ+'?type=liwu')
	 }else if(typ=='shipin'||typ=='dyna'){
		 browserHistory.push('/remen/'+typ)
	 }else{
		 browserHistory.push('/index/'+typ)
	 }
	//  localStorage.setItem('select_type',typ)
 }
 selectType(){
	 return this.state.current
 }
 popApply(){
	 this.props.dispatch(applyMember)
 }
	render() {
		var my_message='2'
		var col='3'
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
			<div  className={this.state.params_a=='message'||this.state.params_a=='collection'?'containers clearfix logindedIndex':'containers clearfix'}>
					<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
					<div class="left_content">
							<div class="titles daohang">
									<Menu
						         mode="inline"
						         openKeys={this.state.openKeys}
						         selectedKeys={[this.state.current]}
						         style={{ width: 240 }}
						         onOpenChange={this.onOpenChange}
						         onClick={this.handleClick_M}
						       >
						         <SubMenu key="sub1" title={<span><span className={this.state.params_a=='index'?"tit back_bg":"tit"}><Link to={'/zhuye'} >我的主页</Link></span></span>}>

						         </SubMenu>
						         <SubMenu class="my_message" key="sub2" title={<span onClick={this.check_type.bind(this,'message')}><span className={this.state.params_a=='message'?"tit back_bg":"tit"}>我的消息</span></span>}>
						           <Menu.Item key="3"><Link to={{pathname:'/index/message',query:{type:'liwu'}}}><div class="liwu"><i class="icon-liwu"></i><span>礼物</span>{this.state.liwuCount!=0?<span class="count">{this.state.liwuCount}</span>:''}</div></Link></Menu.Item>
						           <Menu.Item key="4"><Link to={{pathname:'/index/message',query:{type:'pinlun'}}}><div class="liwu"><i class="icon-pinlun"></i><span>评论</span>{this.state.pinglunCount!=0?<span class="count">{this.state.pinglunCount}</span>:''}</div></Link></Menu.Item>
											 <Menu.Item key="5"><Link to={{pathname:'/index/message',query:{type:'zan'}}}><div class="liwu"><i class="icon-xihuan_hover"></i><span>赞</span>{this.state.zanCount!=0?<span class="count">{this.state.zanCount}</span>:''}</div></Link></Menu.Item>
											 <Menu.Item key="6"><Link to={{pathname:'/index/message',query:{type:'message'}}}><div class="liwu"><i class="icon-message"></i><span>私信</span></div></Link></Menu.Item>
						         </SubMenu>
						         <SubMenu key="sub4" title={<span onClick={this.check_type.bind(this,'collection')}><span className={this.state.params_a=='collection'?"tit back_bg":"tit"}>我的收藏</span></span>}>

						         </SubMenu>
										 <SubMenu key="sub5" title={<span onClick={this.check_type.bind(this,'shipin')}><span class="tit">热门视频</span></span>}></SubMenu>
										 <SubMenu key="sub6" title={<span onClick={this.check_type.bind(this,'dyna')}><span class="tit">热门动态</span></span>}></SubMenu>
						       </Menu>
									<div class="scan_code">
										<img src="/src/assets/images/scan_code.png"/>
										<p>扫一扫，加入高颜值玩转颜值圈</p>
									</div>
							</div>
					</div>
		  		</Affix>
					{this.state.params_a=='index'?
						<div>
							<div class="middle_content remen_detail" style={{width:"800px",margin: '0 20px 0 150px',}}>
									<Middle_Index/>
							</div>
							<div class="right_content">
								<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
									<div class="top font_bold" onClick={this.popApply.bind(this)}>申请会员，加入颜值圈</div>
									<Bill_Board title="话题榜" datas={this.state.getHuatis}/>
									<div class="activities logined_activities">
										{sliderIntance}
									</div>
								</Affix>
							</div>
						</div>
						:(this.state.params_a=='message'?<My_Message selectIndexType={this.state.current}/>
						:this.state.params_a=='collection'?<My_Collection />:<div style={{position:"relative"}}><img style={{position:"absolute",left:"50%",marginLeft:"-150px"}} src="/src/assets/images/404.png"/></div>
						)
						}
      		<div class="go_back">
						<BackTop>
							<i class="icon-go_back"></i><span>回顶部</span>
						</BackTop>
					</div>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return {

    }
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
IndexLogined = connect(mapStateToProps, mapDispatchToProps)(IndexLogined)
 export default IndexLogined
