import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import {Link} from 'react-router';
export default class ReMen_Detail_MSecond extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	componentDidMount(){

	};
	render() {
		console.log(this.props.datas)
		var msecond=[1,2,3,4]
		return (
			<div class="remen_detail_msecond">
				<button>TA的其他动态</button>
				{this.props.datas.length==0&&this.props.end?<div class="nodata_div"><img style={{width:'100%'}}  src="/src/assets/images/nodata/nodata2.jpg"/></div>:''}
				{this.props.datas.length==0&&!this.props.end?<div class="nodata_div"><img class="nodata"  src="/src/assets/images/nodata/load.gif"/></div>
				:
				this.props.datas.map((item,index)=>(
					<div key={index} className={(index==msecond.length-1)?'msecond_pre last':'msecond_pre'}>
						<Link to={{pathname: '/remen/detail', query: {id: item.dynamicId,userId:item.userId}}}
									target="_blank" style={{color:'#333'}}>
									<p style={{marginBottom:"6px"}}>{item.content}</p>
							{item.type==1
							?<Link to={'/videoMain/'+item.dynamicId} target="_blank" style={{display:'inline-block',color:'#333'}}><div class="otherDyna_mask" style={{background:`url(${item.videoThumb?item.videoThumb:""})`,backgroundSize:'cover'}}>
								<img src='/src/assets/images/playred.svg'/>
							</div>
							</Link>
							:
							<div class="pics_container clearfix">
								{item.imageUrls?
								item.imageUrls.split('&').map((item,index)=>(
										index<2?
										<div key={index} className={index==0?'float_left mar10':'float_left'} ><img src={item+'!W130'}/></div>
										:
										''
								))
								:''
								}
							</div>
							}

						<div class="ident_bottom clearfix">
							<p>{moment(item.createTime).format('YYYY'+'年'+'MM'+'月'+'DD'+'日'+' HH:mm')}</p>
							<div class="clearfix">
								<div class="float_left"><i class="icon-huifu"></i><span>{item.commentCount}</span></div>
								<span class="v-line"></span>
								<div class="float_right"><i class="icon-xihuan"></i><span>{item.praiseNums?item.praiseNums:0}</span></div>
							</div>
						</div>
					</Link>
					</div>
				))
				}
			</div>
		);
	};
}
