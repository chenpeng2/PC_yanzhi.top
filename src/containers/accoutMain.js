/**
 * Created by Administrator on 2017/7/12.
 */
import React from 'react';
import Navmarket from '../components/withdrawAndtransfer/Navmarket';
import Topper from './topper';
import Footer from './footer';
export default class AccoutMain extends React.Component {
    constructor(){
        super();
        this.state={

        };
    }
    componentWillMount(){
        document.title = "钻石市场/提现转账";
    }
   render(){
       return(
           <div>
               <Topper/>
               <Navmarket type={this.props.params.type}></Navmarket>
               <Footer/>
           </div>
       )
   }
}
