import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Title  from './title'
import {Link} from 'react-router'
export default class Sub_PiaoXuan extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		console.log()
		return (
						<div class="piaoxuan">
								<Title icon="icon-toupiao" title="票选"/>
								<div class="pics">
										{this.props.datas.length==0?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
										:<div>
												{this.props.datas.boyList.length==0?''
												:<div class="sex_type">
														{this.props.datas.boyList.map((item,index)=>(
																<div key={index}>
																		{index>=5?''
																		:<div   className={(index+1)%5==0? 'class_a float_left pic_pre' : 'float_left pic_pre'}>
																			<Link to={`/piaoxuan/toupiao`}
							                              state={{voted: !item.vote}}
							                              query={{id: item.otherUserId}}
							                        >
																			<div class="avator"><img src={item.headUrls&&item.headUrls!='undefined'?item.headUrls+'!MIN100':"/src/assets/images/piao_avator.png"}/></div>
																			<p class="font_bold">{item.nickName}</p>
																			<div class="vote">投票</div>
																			</Link>
																		</div>
																		}
																</div>

														))}
												</div>
												}
												{this.props.datas.girlList.length==0?''
												:<div class="sex_type">
														{this.props.datas.girlList.map((item,index)=>(
																<div key={index}>
																		{index>=5?''
																		:<div   className={(index+1)%5==0? 'class_a float_left pic_pre' : 'float_left pic_pre'}>
																			<Link to={`/piaoxuan/toupiao`}
							                              state={{voted: !item.vote}}
							                              query={{id: item.otherUserId}}
							                        >
																			<div class="avator"><img src={item.headUrls&&item.headUrls!='undefined'?item.headUrls+'!MIN100':"/src/assets/images/piao_avator.png"}/></div>
																			<p class="font_bold">{item.nickName}</p>
																			<div class="vote">投票</div>
																			</Link>
																		</div>
																		}
																</div>

														))}
												</div>
												}
												{this.props.datas.girlList.length==0&&this.props.datas.boyList.length==0?
												<div class="nodata_div"><img style={{width:'100%'}} src="/src/assets/images/nodata/nodata.jpg"/></div>
												:""}
										</div>
										}
							</div>
						</div>
		);
	};
}
