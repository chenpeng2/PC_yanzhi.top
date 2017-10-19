import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper';
import Footer from './footer'
import IndexLogined from '../components/Index/Sub_Logined/IndexLogined'
import IndexNoLogined from '../components/Index/Sub_NoLogined/IndexNoLogined'
import AllRead from '../components/Common/AllRead.js'
export default class Index extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					logined:false
				}
  };
	componentWillMount(){
			document.title="首页"
			if(AllRead.getCookie('NICKNAME')){
				this.setState({logined:true})
			}
	};
	onrefresh(){
		location.reload()
	}
	render() {
		console.log(this.state.logined)
		const IndexContent= this.state.logined
		?<IndexLogined props={this.props} />
		:<IndexNoLogined/>
		return (
			<div class="wrapper clearfix">
					<Topper shouye='active' refresh={this.onrefresh.bind(this)}/>
					{IndexContent}
					<Footer/>
			</div>
		);
	};
}
