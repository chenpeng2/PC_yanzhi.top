import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
import AllRead from '../Common/AllRead.js'
import {getCookie,needLogin} from '../../actions/index.js'
import {connect} from 'react-redux'
var base64 =require('base-64')
var utf8 = require('utf8');
import TanKuang from '../Common/TanKuang'
class IndexNoLogined extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					addsocang:this.props.datas.isTopicCollect,
					message:{},
					sign:'',
					collectCount:this.props.datas.collectCount
				}

  };
	componentWillMount(){
		// console.log(this.props.datas.collectCount,this.props.datas)
	};
	componentWillReceiveProps(nextprops){
        this.setState({collectCount:nextprops.datas.collectCount,addsocang:nextprops.datas.isTopicCollect});
	}
	cancleAddSoCang(){
		var data={typeId:this.props.datas.titleId,collectType:'Topic'};
			 var ori_data={
				 data:data,
				 explain: {
								 appToken:decodeURI(AllRead.getCookie('TOKEN')),
								 // busType:"notice1/getNoticeList",
								 // interfaceVersion:'v1',
								 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
						 }

			 }
			 console.log(ori_data)
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
		fetch("http://192.168.1.129:92/collect//v1/cancelCollect.mvc", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 if(json.code=="C1000"){
			 this.setState({sign: '成功', message: {message: '取消收藏成功'},collectCount:this.state.collectCount-1});
 			 this.setState({addsocang:!this.state.addsocang})
		 }else{
			 this.setState({sign: '失败', message: {message: '取消收藏失败'}});
		 }

	 });
	}
	AddSoCang(){
		var data={typeId:this.props.datas.titleId,collectType:'Topic'};
			 var ori_data={
				 data:data,
				 explain: {
								 appToken:decodeURI(AllRead.getCookie('TOKEN')),
								 // busType:"notice1/getNoticeList",
								 // interfaceVersion:'v1',
								 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
						 }

			 }
			 console.log(ori_data)
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
		fetch("http://192.168.1.129:92/collect//v1/addCollect.mvc", personalMessage)
	 .then(response => response.json()).then(json => {console.log(json)
		 if(json.code=='C1000'){
			 this.setState({sign: '成功', message: {message: '收藏成功'},collectCount:this.state.collectCount+1});
 			 this.setState({addsocang:!this.state.addsocang})
		 }else{
			 this.setState({sign: '失败', message: {message: '收藏失败'}});
		 }
	 });
	}
	addsocang(){
    if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
   }else{
     if(this.state.addsocang){
       //取消收藏
       this.cancleAddSoCang();
     }else{
       this.AddSoCang()
     }
   }
	}
	cancel = () => {
      this.setState({sign: undefined})
  }
	render() {
		return (
			<div className={this.props.keys!=0?this.props.keys!=1?'huati_text':'huati_text second':"huati_text first"}>
					<div class="top clearfix">
							<Link to={{pathname:"/huati/detail",state:this.props.datas}}>
							<div class="float_left top_left">
									<div class="float_left"><i class="icon-paixu"></i><span>{this.props.indexs+1}</span></div>
									<div class="float_left text">{this.props.datas.title}</div>
							</div>
							</Link>
							{this.props.noadd?''
							:
							<div className="float_right" onClick={this.addsocang.bind(this)}>
									<i className={this.state.addsocang?'icon-guanzhued':"icon-guanzhu"}
										 style={{marginRight: '2px'}}/>
									{this.state.addsocang? <span >已收藏</span> : <span>收藏</span>}
							</div>
							}
					</div>
					<Link to={{pathname:"/huati/detail",state:this.props.datas}}>
						<p class="textStyle text">{this.props.datas.content}</p>
					</Link>
					<div class="textStyle clearfix">
						<div class="float_left"><span>{this.props.datas.joinUserCount?this.props.datas.joinUserCount:0}</span>人参与</div>
						<div class="float_left">&nbsp;|&nbsp;</div>
						<div class="float_left"><span>{this.state.collectCount?this.state.collectCount:0}</span>人收藏</div>
					</div>
					<TanKuang flags={this.state.sign} message={this.state.message}
										cancel={this.cancel}/>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return { }
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
