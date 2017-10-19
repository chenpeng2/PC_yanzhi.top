import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Title  from './title';
import {Link} from 'react-router';
export default class Sub_ReMen extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		return (
			<div class="middle_remen">
					{this.props.title?<Title hiddle={this.props.hiddenMore?this.props.hiddenMore:''} icon="icon-duanshipin" title={this.props.title} click={this.props.click}/>:''}
					{/*视频*/}
								{this.props.datas.length==0&&this.props.end?<div class="nodata_div"><img class="smallPic"  src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
								{this.props.datas.length==0&&!this.props.end?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
								:<div class="videos">
									{this.props.datas.map((item,index)=>(
									<div key={index}  className={(index+1)%4==0? 'class_a float_left video_pre' : 'float_left video_pre'}>
										<Link to={'/videoMain/'+item.dynamicId} target="_blank" style={{background:`url(${item.videoThumb?item.videoThumb:"/src/assets/images/video_default.png"})`,backgroundSize:'cover'}} title={item.content}>

										<div class="video_mask">
											<img src='/src/assets/images/playred.svg'/>
										</div>
										<div class="detail">
											<p class="text">{item.content}</p>
											<div class="message clearfix">
												<span class="touxia"><img src={item.headPath?item.headPath+'!GDSIZE':"/src/assets/images/filterBg.png"}/></span>
												<span class="name">{item.nickName}</span>
												<span>{item.isLeaguer?<img  style={{width:"20px",height:"20px",verticalAlign:'middle'}} src="/src/assets/images/黄钻.svg"/>:''}</span>
												<p class="float_right"><i class="icon-looked" style={{fontSize:'16px',marginRight:'2px'}}></i><span style={{verticalAlign:'middle'}}>{item.viewNums}</span></p>
											</div>
										</div>
										</Link>
									</div>
								))}
								</div>
								}
			</div>
		);
	};
}
