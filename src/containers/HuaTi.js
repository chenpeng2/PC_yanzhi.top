import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper';
import Footer from './footer'
import IndexLogined from '../components/HuaTi/Sub_Logined/IndexLogined'
import IndexNoLogined from '../components/HuaTi/Sub_NoLogined/IndexNoLogined'
import AllRead from '../components/Common/AllRead.js'
export default class HuaTi extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
					logined:false
				}
  };
	componentWillMount(){
    document.title="话题"
		if(AllRead.getCookie('NICKNAME')){
			this.setState({logined:true})
		}
	};
	render() {
    const IndexContent= this.state.logined
		?<IndexLogined/>
		:<IndexNoLogined/>
		return (
			<div class="wrapper clearfix">
					<Topper huati='active'/>
          {IndexContent}
          <Footer/>
			</div>
		);
	};
}
