import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper';
import Footer from './footer'
import IndexLogined from '../components/ReMen/Sub_Logined/IndexLogined'
import IndexNoLogined from '../components/ReMen/Sub_NoLogined/IndexNoLogined'
import AllRead from '../components/Common/AllRead.js'
export default class ReMenDyna extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.state={
            logined:false
        }
    };
    componentWillMount(){
        document.title="热门动态"
        if(AllRead.getCookie('NICKNAME')){
  				this.setState({logined:true})
  			}
    };
    render() {
        const IndexContent= this.state.logined
            ?<IndexLogined current='2'/>
            :<IndexNoLogined current='2'/>
        return (
            <div class="wrapper clearfix">
                <Topper remen='active'/>
                {IndexContent}
                <Footer/>
            </div>
        );
    };
}
