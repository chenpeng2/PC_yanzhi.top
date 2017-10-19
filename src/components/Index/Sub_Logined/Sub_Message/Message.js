import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
export default class Message extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  };
	render() {

		return (
			<div style={{height:'900px'}}>
					正在开发中...
			</div>
		);
	};
}
