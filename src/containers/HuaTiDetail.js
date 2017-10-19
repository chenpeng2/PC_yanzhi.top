import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper';
import Footer from './footer'
import HuaTi_Detail from '../components/HuaTi/HuaTi_Detail'
export default class HuaTiDetail extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
					logined:true
				}
  };
	componentWillMount(){
    document.title="话题"
	};
	render() {
		return (
			<div class="wrapper clearfix">
					<Topper huati='active'/>
          <HuaTi_Detail datas={this.props.location.state}/>
          <Footer/>
			</div>
		);
	};
}
