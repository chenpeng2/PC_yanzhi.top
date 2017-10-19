import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
export default class Bill_Board_HuaTi extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		return (
          <div>
          {/*各个榜单*/}
					{this.props.datas.length==0?
						<div  class="bills">
							<div class="title logined_title clearfix">
								<p class="huati">{this.props.title}</p>
							</div>
							<div class="nodata_div_huati" style={{backgroundColor:'#fff',overflow:'hidden'}}><img class="smallPic_huati"   src="/src/assets/images/nodata/nodata.jpg"/></div>
						</div>
					:
					<div  class="bills">
						<div class="title logined_title clearfix">
							<p class="huati">{this.props.title}</p>
						</div>
						<div style={{padding:'8px 0px'}}>
							{this.props.datas.map((item,index)=>(
								<div key={index} className={(index!==0)?(index!==1)?'logined_bills_pre':'second logined_bills_pre':'first logined_bills_pre'}>
										<i>{index+1}</i>
										{/* <Link to={{pathname:"/huati/detail",state:{title:item.title||item.keyWord}}}> */}
											<p class="logined_detail">{item.title||item.keyWord}</p>
										{/* </Link> */}
								</div>
							))}
						</div>
					</div>
					}
          </div>
		);
	};
}
