import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
export default class Title extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		return (
			<div class="clearfix title">
					<div class="float_left"><i class={this.props.icon}></i><span>{this.props.title}</span></div>
				{this.props.click? <span style={{
                    float: 'left',
                    margin: '15px 0 0 20px',
                    color:'#666',
					cursor:'pointer'
                }} className="chengshi" onClick={()=>this.props.click(true)}>[切换城市]</span>:''}
					<div class="float_right">
						{this.props.refresh?<div><i class="icon-huanyihuan"></i><span>换一换</span></div>:''}
						{!this.props.refresh&&this.props.title=='热门动态'&&!this.props.hiddle?<Link style={{color:'#333'}} to="/remen/dyna" target="_blank">更多></Link>:''}
						{!this.props.refresh&&this.props.title=='票选'?<Link style={{color:'#333'}} to="/piaoxuan" target="_blank">更多></Link>:''}
						{!this.props.refresh&&this.props.title=='上海地区热门视频'?<Link style={{color:'#333'}} to="/remen/diqu" >更多></Link>:''}
						{!this.props.refresh&&this.props.title=='热门短视频'?<Link style={{color:'#333'}} to="/remen" target="_blank">更多></Link>:''}
						{!this.props.refresh&&this.props.title=='热门视频'&&!this.props.hiddle?<Link style={{color:'#333'}} to="/remen" >更多></Link>:''}
					</div>
			</div>
		);
	};
}
