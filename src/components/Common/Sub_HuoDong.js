import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Title  from '../Index/Sub_NoLogined/title'
import {Slider} from 'amazeui-react'
import {Link} from 'react-router'
export default class Sub_HuoDong extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {
		var huati_themes=['a4']
		// var huatidata=['./src/assets/images/huati01.png','./src/assets/images/huati01.png']
		return (
			<div class="acti">
				{/*活动*/}

						<div className="am-margin-bottom">
							<Slider theme={'a4'}>

								{this.props.datas.map(function(item, i) {
									return (
										<Slider.Item key={i}>
											<a href={item.paramter?(item.website+item.paramter):item.website} target={'_blank'} title={item.noticeTitle}>
												<img src={item.noticePath?item.noticePath+'!gdsize01':'./src/assets/images/huati01.png'}/>
											</a>
										</Slider.Item>
									);
								})}
							</Slider>
						</div>

			</div>
		);
	};
}
