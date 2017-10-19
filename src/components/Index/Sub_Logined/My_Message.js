import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Liwu from './Sub_Message/Liwu'
import Message from './Sub_Message/Message'
import Pinlun from './Sub_Message/Pinlun'
import Zan from './Sub_Message/Zan'
 export default class My_Message extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					message_type:'3'
				}
  };
	componentWillMount(){

	}
	componentWillReceiveProps(nextprops){console.log(nextprops.selectIndexType);this.setState({message_type:nextprops.selectIndexType})}
	render() {
		var show_type=this.state.message_type==4?<Pinlun />:(this.state.message_type==5?<Zan />:(this.state.message_type==6?<Message />:<Liwu />))
		return (
			<div  class="myindex_collection">
			{show_type}
			</div>
		);
	};
}
