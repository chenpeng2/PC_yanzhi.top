import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Search_Topper from '../Common/topper'
import GuanZhu from '../Common/guanzhu'
import Module_Text from '../../HuaTi/module_text'
import {Link} from 'react-router'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
import ReMen from '../../Index/Sub_NoLogined/Sub_ReMen'
export default class All extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getVideos:[],
					getUsers:[],
					getDynas:[],
					getTopics:[]
				}
  };
	componentWillMount(){

	};
	componentWillReceiveProps(nextprops){
		if(nextprops.datas.userInfoList){this.getUsers(nextprops)}
		if(nextprops.datas.dynamicList){this.getDynas(nextprops)}
		if(nextprops.datas.topicList){this.getTopics(nextprops)}
		if(nextprops.datas.videoList){this.getVideos(nextprops)}
	}
	getUsers(nextprops){
		if(nextprops.datas.userInfoList.list){
			let users=nextprops.datas.userInfoList.list
			if(users.length>4){
				this.setState({getUsers:users.slice(0,4)})
			}
			else{
				this.setState({getUsers:nextprops.datas.userInfoList.list})
			}
		}
	}
	getDynas(nextprops){
		if(nextprops.datas.dynamicList){
			let dynas=nextprops.datas.dynamicList
			if(dynas.length>4){
				this.setState({getDynas:dynas.slice(0,4)})
			}
			else{
				this.setState({getDynas:nextprops.datas.dynamicList})
			}
		}
	}
	getTopics(nextprops){
		if(nextprops.datas.topicList){
			let topics=nextprops.datas.topicList
			if(topics.length>4){
				this.setState({getTopics:topics.slice(0,4)})
			}
			else{
				this.setState({getTopics:nextprops.datas.topicList})
			}
		}
	}
	getVideos(nextprops){
		if(nextprops.datas.videoList){
			let videos=nextprops.datas.videoList
			if(videos.length>12){
				this.setState({getVideos:videos.slice(0,12)})
			}
			else{
				this.setState({getVideos:nextprops.datas.videoList})
			}
		}
	}
changeActiveKey(key){
	this.props.changeActiveKey(key)
}
	render() {

		return (
			<div class="search_all">
					<div class="user">
						<Search_Topper title='用户' titleName='user' changeActiveKey={this.changeActiveKey.bind(this)}/>
						<GuanZhu data={this.state.getUsers} title="关注" width="377" width_m="150" margin='10' end={this.props.end}/>
					</div>
					<div class="video">
						<Search_Topper title='视频' titleName='video' changeActiveKey={this.changeActiveKey.bind(this)}/>
						<div class="clearfix cont">
							<ReMen datas={this.state.getVideos} end={this.props.end}/>
						</div>
					</div>
					<div>
					<div class="dyna">
						<Search_Topper title='动态' titleName='dyna' changeActiveKey={this.changeActiveKey.bind(this)}/>
						<ReMen_Dyna logined="yes" datas={this.state.getDynas} end={this.props.end} nomargin="no"/>
					</div>
					<div class="huati">
						<Search_Topper title='话题' titleName='huati' changeActiveKey={this.changeActiveKey.bind(this)}/>
						<div class="huati_container">
							{this.state.getTopics.length==0?
								(this.props.end?
									<div class="nodata_div"><img  class="smallPic" src="/src/assets/images/nodata/nodata.jpg"/></div>
									:<div class="nodata_div"><img class="nodata"  src="/src/assets/images/nodata/load.gif"/></div>
								)
							:this.state.getTopics.map((item,index)=>(
								<div key={index} className={index==this.state.getTopics.length-1?'last':(index==0?'first':'')}><Module_Text keys={index} datas={item} indexs={index}/></div>
							))}

						</div>
					</div>
					</div>
			</div>
		);
	};
}
