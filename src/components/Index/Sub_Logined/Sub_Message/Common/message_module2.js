import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import {Link} from 'react-router'
export default class Message_Module2 extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
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
          <div class=" float_left avator"><img src={this.props.datas.headUrls?this.props.datas.headUrls+'!GDSIZE':'/src/assets/images/remen_avator.png'}/></div>
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
							{this.props.datas.sendTime<Date.parse(new Date(moment(new Date().getTime()).format('YYYY-MM-DD'+' '+'00:00:00')))
							?
							(
								Date.parse(new Date(moment(new Date().getTime()-24*60*60*1000).format('YYYY-MM-DD'+' '+'00:00:00')))<this.props.datas.sendTime
								?
								'昨天 '+moment(this.props.datas.sendTime).format('HH:mm')
								:moment(this.props.datas.sendTime).format('MM-DD-HH:mm')
							)
							:'今日 '+moment(this.props.datas.sendTime).format('HH:mm')
						 }
						</p>
          </div>
          <p class="top">评论了你的动态：<span>{this.props.datas.content}</span></p>
          <div class="index_content" onClick={this.goRemenDetail.bind(this)}>
              <div class=" float_left avat"><img src={this.props.datas.dynamicHeadUrls?this.props.datas.dynamicHeadUrls+'!gdsize100':'/src/assets/images/gerentx.png'}/></div>
              <div class="detai">
                <p class="title">{this.props.datas.dynamicNickName}</p>
                <div>
	                {this.props.datas.dynamicContent}
                </div>
              </div>
          </div>
			</div>
		);
	};
}
