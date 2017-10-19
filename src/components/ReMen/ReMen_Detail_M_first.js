import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
import TanKuang from '../Common/TanKuang'
import AllRead from '../Common/AllRead.js'
var base64 =require('base-64')
var utf8 = require('utf8');
import {getCookie,needLogin} from '../../actions/index.js'
import {connect} from 'react-redux'
class ReMen_Detail_MFirst extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					pinlun:false,
					hide_pinlun:[],
					getMore_pinlun:false,
					fuji_pinlu:false,
					twoContent:[],
					threeContNum:-1,
					firstCont:'',
					message:{},
					sign:'',
					commentCount:'',
					zanCount:'',
					praise:this.props.datas.praise,
					postBg2:'',
					postNum:'',
					praise2:false
				}
  };
	componentWillMount(){
		let hiddle=this.props.datas.childrenList?(this.props.datas.childrenList.length>=3?this.props.datas.childrenList.slice(0,3):this.props.datas.childrenList):[];
		this.setState({hide_pinlun:hiddle});
		//将评论和赞赋值
		this.setState({commentCount:this.props.datas.commentCount,zanCount:this.props.datas.zanCount})
	}
	componentWillReceiveProps(nextprops){
		let hiddle=nextprops.datas.childrenList?(nextprops.datas.childrenList.length>=3&&!this.state.getMore_pinlun?nextprops.datas.childrenList.slice(0,3):nextprops.datas.childrenList):[];
			this.setState({hide_pinlun:hiddle});
			//改变了发布评论背景
			this.setState({postBg2:nextprops.postBg2,postNum:nextprops.postNum})
	}
	zan(zanTypeId){
      var data={zanTypeId:zanTypeId};
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
  	  fetch("http://192.168.1.129:92/Zan/v1/saveZan.mvc", personalMessage)
  	 .then(response => response.json()).then(json => {
        if(json.code=='SUCCESS'){
          this.setState({zanCount:this.state.zanCount+1});
          // this.setState({sign: '成功', message: {message: '点赞成功'}});
        }else if(json.code=='PRESENCE'){
          this.setState({sign: '失败', message: {message: '你已点过该赞'}});
        }else{
					this.setState({sign: '失败', message: {message: '操作失败'}});
				}
  	 });
	}
	canclezan(zanTypeId){
      var data={zanTypeId:zanTypeId};
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
  	  fetch("http://192.168.1.129:92/Zan/v1/delDetails.mvc", personalMessage)
  	 .then(response => response.json()).then(json => {console.log(json)
       if(json.code=='SUCCESS'){
				   this.setState({zanCount:this.state.zanCount-1});
      }else if(json.code=='ERROR'){
        this.setState({sign: '失败', message: {message: '未查询到该赞'}});
      }else{
				this.setState({sign: '失败', message: {message: '操作失败'}});
			}
  	 });
  }
	clickZan(){
		//第一级的评论点赞+1
		if(!AllRead.getCookie('NICKNAME')){
		 this.props.dispatch(needLogin)
	 }else{
		 if(this.state.praise){
			 this.canclezan(this.props.datas.commentId)
		 }else{
			 this.zan(this.props.datas.commentId)
		 }
	 }
	}
	show_pinlun(){
		if(this.state.pinlun){
			this.setState({pinlun:false});
			this.setState({fuji_pinlu:false});
			$('.show_second_level').hide();
		}else{
			this.setState({pinlun:true});
			this.setState({fuji_pinlu:true});
			$(".second_level").hide();
			$('.show_second_level').show();
		}
	}
	sencond_level(index,event){
		// this.setState({threeContNum:index});
		// $('.show_second_level').hide();
		// $(".second_level").hide();
		console.log(index,$(".second_level"+index).css('display'))
		console.log($(".second_level"+index))
		if($(".second_level"+index).css('display')=='none'){
			$(".second_level"+index).show();
		}else{
			$(".second_level"+index).hide();
		}
	}
	fabu_content2(commentId,nickName){
		// let commentId=this.props.datas?this.props.datas.commentId:'';
		this.props.fabu_content2(commentId,3,nickName)
	}
	getMore_pinlun(){
		this.setState({hide_pinlun:this.props.datas.childrenList});
		this.setState({getMore_pinlun:true})
	}
	twoPinlun(num,event){
		this.props.textChange2(num,event.target.value)
	}
	cancel = () => {
			this.setState({sign: undefined})
	}
	render() {
		return (
			<div class="detail_module">
				<div class="detail_post clearfix">
					<div class="avatar"><Link target={'_blank'} to={'/zhuye'} query={{id:this.props.datas.userId}}><img src={this.props.datas.headPath?this.props.datas.headPath+'!GDSIZE':"/src/assets/images/filterBg.png"}/></Link></div>
					<div class="cont">
						<p><Link target={'_blank'} to={'/zhuye'} query={{id:this.props.datas.userId}}>{this.props.datas.nickName}</Link>{this.props.datas.leaguer?<img src={'/src/assets/images/黄钻.svg'}/>:null}</p>
						<p>{this.props.datas.createTime}</p>
					</div>
				</div>
				<div class="txt clearfix" style={{width:this.props.width_line+'px'}}>
					<div class="text">
						{this.props.datas.content}
						<div class="clearfix">
							<div class="float_left" onClick={this.show_pinlun.bind(this)}><i class="icon-huifu"></i><span>{this.state.commentCount}</span></div>
							<span class="v-line"></span>
							<div class="float_right" onClick={this.clickZan.bind(this)}><i class="icon-dianzan"></i><span>{this.state.zanCount}</span></div>
						</div>
					</div>
					{this.state.fuji_pinlu
					?<div className={"second_level show_second_level"}>
						<img src="/src/assets/images/pinlun/pinlun_arrow.png"/>
						<div class="clearfix">
							<div class="float_left">
									<span>回复{this.props.datas.nickName}</span><span>：</span>
									<input type="text" onChange={this.twoPinlun.bind(this,2)}/>
							</div>
							<div className={this.state.postBg2&&this.state.postNum==2?'fab':'fab nofabu_post'}  ><a href="javascript:void(0)"  onClick={this.props.fabu_content}>评论</a></div>
						</div>
					</div>
				:''}
					{this.state.pinlun
					?
					<div class="hide_pinlun">
						<div class="pl">
								{this.state.hide_pinlun.map((item,index)=>(
									<div key={index} class="hide_pinlun_pre">
											{/*在数据里给个参数区分是一级还是多级回复*/}
											<p><span>{item.nickName}：</span>回复<span>{item.parentNickName}：</span>{item.content}</p>
											<p>
												{item.createTime}
												<div class="clearfix">
													<div class="float_left" onClick={this.sencond_level.bind(this,index)}><span style={{marginRight:'5px'}}>回复</span></div>
													{/* <span class="v-line"></span>
													<div class="float_right"><i class="icon-dianzan"></i><span>{item.zanCount}</span></div> */}
												</div>
											</p>
											<div className={"second_level second_level"+index}>
												<img src="/src/assets/images/pinlun/pinlun_arrow.png"/>
												<div class="clearfix">
													<div class="float_left">
															<span>回复{item.nickName}：</span>
															<input type="text" onChange={this.twoPinlun.bind(this,3)}/>
													</div>
												<div className={this.state.postBg2&&this.state.postNum==3?'fab':'fab nofabu_post'} >	<a href="javascript:void(0)"  onClick={this.fabu_content2.bind(this,item.commentId,item.nickName)}>评论</a></div>
												</div>
											</div>
									</div>
								))}
						</div>
						{this.state.getMore_pinlun
						?''
						:this.props.datas.commentCount>3?
						<p class="more_pl" onClick={()=>this.getMore_pinlun()}>还有{this.props.datas.commentCount-3}条回复，<span>点击查看</span></p>
						:''
						}
					</div>
					:
					''
					}
					<div class="detail_line detail_line2" style={{width:this.props.width_line+'px'}}></div>
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
ReMen_Detail_MFirst = connect(mapStateToProps, mapDispatchToProps)(ReMen_Detail_MFirst)
 export default ReMen_Detail_MFirst
