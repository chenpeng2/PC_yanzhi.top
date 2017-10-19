import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper';
import Footer from './footer'
import ReMen_Detail from '../components/ReMen/ReMen_Detail'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../components/Common/AllRead.js'
export default class ReMenDetail extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
					details:[],
					fetchEnd:false
				}
  };
	componentWillMount(){
    document.title="动态详情页";
		let data=this.props.location.query.id;
		this.getDetails(data)
	};
	getDetails(data){
		if(AllRead.getCookie('NUMBERID')){
			this.dynamicDetail(data)
		}
		else{
			this.noLogindynamicDetail(data)
		}
	}
	noLogindynamicDetail(dynamicId){
		var data={twitterId:dynamicId,type:'hot'};
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
	  fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 	this.setState({details:json.data,fetchEnd:true});
	 });
	}
	dynamicDetail(dynamicId){
		var data={twitterId:dynamicId,type:'hot'};
	     var ori_data={
	       data:data,
	       explain: {
	               appToken:decodeURI(AllRead.getCookie('TOKEN')),
	               // busType:"notice1/getNoticeList",
	               // interfaceVersion:'v1',
	               numberID: decodeURI(AllRead.getCookie('NUMBERID'))||'',
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
	  fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
	 	.then(response => response.json()).then(json => {
		 this.setState({details:json.data,fetchEnd:true})
	 });
	}
	reload_hot(id,event){
		this.getDetails(id)
	}
	render() {
		return (
			<div class="wrapper clearfix">
					<Topper remen="active"/>
					<ReMen_Detail Query={this.props.location.query} datas={this.state.details} reload_hot={this.reload_hot.bind(this,this.props.location.query.id)} fetchEnd={this.state.fetchEnd}/>
          <Footer/>
			</div>
		);
	};
}
