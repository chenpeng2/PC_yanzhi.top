import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import {Link} from 'react-router'
export default class Message_Module1 extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					liwu_maskShow:false,
					liwuPlayNum:-1
				}
  };
	liwyPlay(liwuType){
		this.setState({liwuPlayNum:-1});
		if(liwuType=='flower'){
			this.setState({liwuPlayNum:0})
		}else if(liwuType=='beer'){
			this.setState({liwuPlayNum:1})
		}
		else if(liwuType=='love'){
			this.setState({liwuPlayNum:2})
		}
		else if(liwuType=='mike'){
			this.setState({liwuPlayNum:3})
		}
		else if(liwuType=='lips'){
			this.setState({liwuPlayNum:4})
		}
		else if(liwuType=='ship'){
			this.setState({liwuPlayNum:5})
		}
		else if(liwuType=='car'){
			this.setState({liwuPlayNum:6})
		}else{
			this.setState({liwuPlayNum:7})
		}
		setTimeout(()=>this.setState({liwuPlayNum:-1})
		,3000)
	}
	goRemenDetail(){
		let searchId=this.props.datas.dynamicId;
		let indexof=window.location.href.indexOf('remen/detail');
		if(indexof>-1){
			 window.open('/remen/detail?id='+searchId,'_self')
		}else{
			window.open('/remen/detail?id='+searchId,'_blank')
		}
	}
	render() {
		return (
			<div class="message_modu">
				<Link to={{pathname: '/zhuye', query: {id: this.props.datas.userId || this.props.datas.numberId}}}
					/*title="看他的主页"*/
						target="_blank">
          <div class=" float_left avator"><img src={this.props.datas.headPath?this.props.datas.headPath+'!GDSIZE':'/src/assets/images/remen_avator.png'}/></div>
				</Link>
					<div class="detail">
            <p class="font_bold">
							<Link to={{pathname: '/zhuye', query: {id: this.props.datas.userId || this.props.datas.numberId}}}
							/*title="看他的主页"*/
								target="_blank">
							<span>{this.props.datas.nickName}</span>
							</Link>
							{this.props.datas.leaguer || this.props.datas.isLeaguer ?
<img style={{height:'20px',verticalAlign:'text-top',position:'relative',top:'1px'}}
src={'/src/assets/images/黄钻.svg'}/> : ''}
						</p>
            <p class="color">
							{this.props.datas.createTime<Date.parse(new Date(moment(new Date().getTime()).format('YYYY-MM-DD'+' '+'00:00:00')))
							?
							(
								Date.parse(new Date(moment(new Date().getTime()-24*60*60*1000).format('YYYY-MM-DD'+' '+'00:00:00')))<this.props.datas.createTime
								?
								'昨天 '+moment(this.props.datas.createTime).format('HH:mm')
								:moment(this.props.datas.createTime).format('MM-DD-HH:mm')
							)
							:'今日 '+moment(this.props.datas.createTime).format('HH:mm')
						 }
						</p>
          </div>
          <p class="top">给{this.props.post?'TA':'我'}送了一个<img onClick={()=>this.liwyPlay(this.props.datas.productType)} style={{width:'24px',verticalAlign:'middle',cursor:'pointer'}} src={"/src/assets/images/liwu_svg/"+this.props.datas.productType+".svg"}/></p>
          <div class="index_content" onClick={this.goRemenDetail.bind(this)}>
              <div class=" float_left avat"><img src={this.props.datas.dynamicHeadPath?this.props.datas.dynamicHeadPath+'!gdsize100':'/src/assets/images/gerentx.png'}/></div>
              <div class="detai">
                <p class="title">{this.props.datas.dynamicNickName}</p>
                <div>
	                {this.props.datas.dynamicContent}
                </div>
              </div>
          </div>
	        <div class="liwuPlay">
	          {this.state.liwuPlayNum<0?'':<img class="liwu_playpic" src={'/src/assets/images/liwu_playpic/'+this.state.liwuPlayNum+'.gif'}/>}
	        </div>
			</div>
		);
	};
}
