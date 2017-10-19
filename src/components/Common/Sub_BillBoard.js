import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'

export default class Sub_BillBoard extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		return (
          <div class="bills">
          {/*各个榜单*/}
						{this.props.datas==''
						?''
						:<div>
						<div class="title">{this.props.title}</div>
						{this.props.datas.slice(0,10).map((item,index)=>(
									<div key={index} className={(index!==0)?(index!==1)?'bills_pre':'second bills_pre':'first bills_pre'}>
											<i>{index+1}</i>
											<div class="detail">
                                                <Link to="/zhuye" query={{id: item.userId}} target="_blank">
                                                    <div class="float_left">
                                                        <img
                                                            src={!item.headPath && !item.headUrls
                                                                ? '/src/assets/images/filterBg.png'
                                                                : (item.headPath || item.headUrls) + '!GDSIZE'}/>
                                                    </div>
													<div style={item.signature ? null : {padding: '6px 0'}}>
														<p><span>{item.nickName}</span>
                                                            {item.leaguer || item.isLeaguer ?
																<img height={20}
																	 src={'/src/assets/images/黄钻.svg'}/> : null}
														</p>
                                                        {item.signature ? <p class="font">{item.signature}</p> : null}
														<p class="font">{this.props.title === '话题人气榜'?'阅读量':'累计活跃'}：<span>
                                                            {(() => {
                                                               if (this.props.title === '你可能喜欢') {
                                                                    return item.monthRevenue
                                                                } /*
                                                                if (this.props.title === '人气榜') {
                                                                    return item.monthAmount
                                                                }*/
                                                                if (this.props.title === '贡献榜') {
                                                                    return item.monthRewardAmount
                                                                }
                                                                if (this.props.title === '话题人气榜') {
                                                                    return item.viewNums+'次'
                                                                }
                                                                /*if (this.props.title === '新人榜' || this.props.title === '认识新会员') {
                                                                    return item.monthCount
                                                                }*/
                                                                return item.monthAmount
                                                            })()}
															</span></p>
                                                    </div>
                                                </Link>
											</div>
									</div>
								))}</div>}
          </div>
		);
	};
}
