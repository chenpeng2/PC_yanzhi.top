import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper'
import Footer from './footer'
import Search_Index from '../components/Search/index'
export default class HuaTiDetail extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	componentWillMount(){
    document.title="搜索页"
	};
	render() {
		return (
			<div class="wrapper clearfix">
          <Topper shouye="active"/>
          <Search_Index searchData={this.props.location.state} />
          <Footer/>
			</div>
		);
	};
}
