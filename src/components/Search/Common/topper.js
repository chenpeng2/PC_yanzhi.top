import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
export default class Topper extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	componentWillMount(){

	};
	changeActiveKey(){
		this.props.changeActiveKey(this.props.titleName)
	}
	render() {
		return (
			<div class="clearfix tit">
					<div class="float_left">{this.props.title}</div>
          <div class="float_right" onClick={this.changeActiveKey.bind(this)}>更多></div>
			</div>
		);
	};
}
