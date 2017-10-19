
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import GuanZhu_Module from './guanzhu_module'
import {Link} from 'react-router'
export default class Follow extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					end:false
				}
  };
  componentWillMount() {

	}
	componentWillReceiveProps(nextprops){

	}
	render() {
		return (
      <div className="follow">
          {this.props.data.length==0&&!this.props.end?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
          :
          <div className="content clearfix">
              {this.props.data.map((item, index) => (
                  <div key={index} class="guanzhu">
										  <Link to="/zhuye" query={{id: item.numberId}} target="_blank">
	                      <div className="float_left">
	                          <img src={item.headPath?item.headPath+'!GDSIZE':"/src/assets/images/remen_avator.png"}/>
	                      </div>
											</Link>
                      <div className="middle" >
                          <p>
														<Link to="/zhuye" query={{id: item.numberId}} target="_blank">{item.nickName?item.nickName:'伊黎'}</Link>
														{item.isLeaguer || item.isLeaguer ?
				<img style={{heigh:'20px',verticalAlign:'text-top'}}
				src={'/src/assets/images/黄钻.svg'}/> : ''}
													</p>
                          <p className="font">{item.signature?item.signature:'人生海海，荒野流星'}</p>
                          <p className="font">粉丝：<span>{item.likeHeTotal?item.likeHeTotal:0}</span></p>
                      </div>
                      <GuanZhu_Module datas={item}/>
                  </div>
              ))}
          </div>
          }
          {this.props.data.length==0&&this.props.end?<div class="nodata_div"><img class="smallPic" src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
      </div>
		);
	};
}
