import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
export default class Bill_Board extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		console.log(this.props.datas)
		return (
          <div class="bills">
          {/*各个榜单*/}
            <div class="title logined_title clearfix">
              <p class="float_left">{this.props.title}</p>
              <p class="float_right">
							<Link to={'/huati'} style={{color:'#333'}}>更多></Link>
							</p>
            </div>
            <div style={{padding:'8px 0px'}}>
							{this.props.datas.length==0?
								<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
							:""
							}
              {this.props.datas.length!=0?this.props.datas.map((item,index)=>(
                <div key={index} className={(index!==0)?(index!==1)?'logined_bills_pre':'second logined_bills_pre':'first logined_bills_pre'}>
                    <i>{index+1}</i>
										<Link to={{pathname:"/huati/detail",state:{title:item.title}}}>
                    	<p class="logined_detail">{item.title}</p>
										</Link>
                </div>
              ))
							:''}
            </div>
          </div>
		);
	};
}
