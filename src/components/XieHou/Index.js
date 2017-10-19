import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Affix, BackTop} from 'antd'
import Sub_BillBoard from '../Common/Sub_BillBoard'
import Sub_HuoDong from '../Common/Sub_HuoDong'
import json from './city_data'

export default class Index extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	componentDidMount(){

	};
	render() {
		console.log(json)
		var huatidata=['./src/assets/images/huati01.png','./src/assets/images/huati01.png']
		var huati_themes=['a4']
		return (
			<div>
			<div class="page_huati clearfix">

					<div class="lef_content">
						<div class="lunbo">
							 <Sub_HuoDong/>
						</div>
						<div class="search_person">
							<p>搜索你喜欢的TA</p>
							<div>
								<div class="male">
									<input type="radio" name="sex" id="male"/>
									<label for="male">男生</label>
								</div>
								<div class="female">
									<input type="radio" name="sex" id="female"/>
									<label for="male">女生</label>
								</div>
							</div>
						</div>
						</div>
						<div class="right_content">
							<Affix offsetTop={20} onChange={affixed => console.log(affixed)}>
								<Sub_BillBoard title="你可能喜欢"/>
							</Affix>
						</div>
						<div class="go_back">
							<BackTop>
								<i class="icon-go_back"></i><span>回顶部</span>
							</BackTop>
						</div>
			</div>
			</div>
		);
	};
}
