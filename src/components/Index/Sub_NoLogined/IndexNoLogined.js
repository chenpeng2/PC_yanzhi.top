import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReMen from './Sub_ReMen'
import HuoDong from '../../Common/Sub_HuoDong'
import PiaoXuan from './Sub_PiaoXuan'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
import Sub_BillBoard from '../../Common/Sub_BillBoard'
import {Slider} from 'amazeui-react'
import { Menu,BackTop } from 'antd';
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../Common/AllRead.js'
var sliceArr=AllRead.sliceArr
import {connect} from 'react-redux'
import {applyMember} from '../../../actions/index.js'
class IndexNoLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					current:'1',
					getRanking_data:'',
					getNewRanking_data:'',
					getContribuRanking:'',
					getVideoData:[],
					getPiaoXuanData:[],
					getDynaData:[],
					getHuoDong:[]
				}
  };
	componentWillMount() {
				this.getRanking();
				this.getNewRanking();
				this.getContribuRanking();
				this.getVideoData();
				this.getPiaoXuanData();
				this.getDynaData();
				this.getHuoDong()
   }
	 getDynaData(){
		 var data={type:5};
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
			this.setState({getDynaData:json.data.list})
    });
	 }
	 getVideoData(){
		 var data={type:4,pageNo:1,perPage:12};
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
			this.setState({getVideoData:json.data.list})
    });
	 }
	 getPiaoXuanData(){
     const personalMessage = {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:"",
     };
     fetch("http://192.168.1.129:92/vote/v2/getVoteUserLIstById.do", personalMessage)
    .then(response => response.json()).then(json => {
			this.setState({getPiaoXuanData:json.data})
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
	 getHuoDong(){
		 var personalMessage=AllRead.getRanking(base64,utf8,'NOMAL');
     fetch("http://192.168.1.129:92/notice/v1/getNoticeList", personalMessage)
    .then(response => response.json()).then(json => {
			this.setState({getHuoDong:json.data.noticeList})
    });
	 }
	handleClick(e){
    this.setState({
      current: e.key
    });
		const key=e.key;
		// var offset_top=$('.left_content').offset().top;
		if(key==1){
			$("html, body").animate({
            scrollTop: $("#remen").offset().top }, {duration: 500,easing: "swing"});
        return false;
		}else if(key==2){
			$("html, body").animate({
            scrollTop: $("#huodong").offset().top }, {duration: 500,easing: "swing"});
        return false;
		}else if(key==3){
			$("html, body").animate({
            scrollTop: $("#piaoxuan").offset().top }, {duration: 500,easing: "swing"});
        return false;
		}else if(key==4){
			$("html, body").animate({
            scrollTop: $("#remen_dyna").offset().top }, {duration: 500,easing: "swing"});
        return false;
		}
  }
	popApply(){
		this.props.dispatch(applyMember)
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
											<Menu.Item key="1">热门短视频</Menu.Item>
											<Menu.Item key="2" >活动</Menu.Item>
											<Menu.Item key="3">票选</Menu.Item>
											<Menu.Item key="4">热门动态</Menu.Item>
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
					<div class="middle_content">
						<div id="remen"><ReMen datas={this.state.getVideoData} title='热门短视频'/></div>
						<div id="huodong"><HuoDong datas={this.state.getHuoDong}/></div>
						<div id="piaoxuan"><PiaoXuan datas={this.state.getPiaoXuanData}/></div>
						<div id="remen_dyna"><ReMen_Dyna datas={this.state.getDynaData}/></div>
					</div>
					<div class="right_content">
						<div class="top font_bold" onClick={this.popApply.bind(this)}>申请会员，加入颜值圈</div>
						<Sub_BillBoard title="人气榜" datas={this.state.getRanking_data}/>
						<Sub_BillBoard title="新人榜" datas={this.state.getNewRanking_data}/>
						<Sub_BillBoard title="贡献榜" type='gongxian' datas={this.state.getContribuRanking}/>
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
IndexNoLogined = connect(mapStateToProps, mapDispatchToProps)(IndexNoLogined)
 export default IndexNoLogined
