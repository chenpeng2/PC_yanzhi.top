import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Pagination,BackTop} from 'antd'
import ReMenDyna from '../Common/Sub_ReMen_Dyna'
import ReMenDetailMSecond from './ReMen_Detail_M_second'
import PilLun from '../Common/Pin_Lun'
import AllRead from '../Common/AllRead.js'
var base64 =require('base-64')
var utf8 = require('utf8');
import {Link} from 'react-router'
export default class ReMen_Detail extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getDynaData:[],
					objToarray:[],
					pingluns:[],
					pageNo:1,
					perPage:4,
					pages:-1,
					getOtherDynas:[],
					end:false,
					dynamicId:'',
					pinglun_fetch:false,
					zanList:[]
				}

  };
	componentWillMount(){
		this.addView(this.props.Query)
	};
	addView(query){
		var NUMBERID=AllRead.getCookie('NUMBERID');
		var list=`[{'twitterId':${query.id},'userId':${query.userId}}]`;
		var ori_data=NUMBERID?{
			data:{list:list},
			explain: {
							appToken:decodeURI(AllRead.getCookie('TOKEN')),
							// busType:"notice1/getNoticeList",
							// interfaceVersion:'v1',
							numberID: decodeURI(NUMBERID) || '',
					}

		}
		:{
			data:{list:list},
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
	 fetch("http://192.168.1.129:92/beauty/v1/addViewCount.do", personalMessage)
	.then(response => response.json()).then(json => {
		// console.log( json)
	});
	}
	getOtherDynas(userId,dynamicId){
		var NUMBERID=AllRead.getCookie('NUMBERID');
		// var HEADPATH=AllRead.getCookie('HEADPATH');
		var data={userId:userId,dynamicId:dynamicId,pageNo:this.state.pageNo,perPage:this.state.perPage};
		var ori_data={
			data:data,
			explain: {
							appToken:decodeURI(AllRead.getCookie('TOKEN')),
							// busType:"notice1/getNoticeList",
							// interfaceVersion:'v1',
							numberID: decodeURI(NUMBERID) || '',
					}
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
		fetch("http://192.168.1.129:92/beauty/v2/getTaOtherDynamic", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 	if(json.code=='SUCCESS'){
				this.setState({getOtherDynas:json.data.list,end:true,pages:json.data.pages})
			}
	 });
	}
componentWillReceiveProps(nextprops){console.log(nextprops)
	let tojson=JSON.stringify(nextprops.datas.twitter)
	let toarray=JSON.parse('['+tojson+']')
	this.setState({objToarray:toarray,dynamicId:nextprops.datas.twitter.dynamicId,zanList:nextprops.datas.twitter.zanList?nextprops.datas.twitter.zanList:[]});
	this.getOtherDynas(nextprops.datas.twitter.userId,nextprops.datas.twitter.dynamicId)
}
addMore(){
	let page=this.state.pageNo;
	page++;
	if(page<=this.state.pages){
		this.setState({pageNo:page},this.getOtherDynas(this.state.dynamicId))
	}else{
		this.setState({pageNo:1},this.getOtherDynas(this.state.dynamicId))
	}
}
	render() {console.log(this.state.zanList)
		return (
			<div class="remen_detail clearfix">
					<div class="lef_content">
						<ReMenDyna logined={'yes'}  datas={this.state.objToarray} canclebottom='yes'/>
						<div class="detail_renyuan">
							{this.state.zanList.length!=0?<i class="icon-xihuan_hover" style={{marginRight:'8px',fontSize:'16px',position:"relative",top:'-1px'}}></i>:''}
							{this.state.zanList.map((item,index)=>(
								<span key={index} ><Link to="/zhuye" query={{id: item.userId}} target="_blank">{item.nickName}</Link>{index==this.state.zanList.length-1?'':<span style={{padding:'0 5px'}}>,</span>}</span>
							))}
						</div>
						<PilLun width_text="555" width_line="640"  dynamicId={this.state.dynamicId}/>
					</div>
					<div class="right_content">
							<ReMenDetailMSecond datas={this.state.getOtherDynas} end={this.state.end}/>
							<div>
								{this.state.getOtherDynas.length>4?
								<div class="rem_det_more" onClick={this.addMore.bind(this)}>换一批动态>></div>
								:''
								}
							</div>
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
