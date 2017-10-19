import React from 'react';
import fetch from 'whatwg-fetch'
import Index from '../containers/Index';
import ReMen from '../containers/ReMen';
import XieHou from '../containers/XieHou';//邂逅
import PiaoXuan from '../containers/PiaoXuan';//投票
import HUaTi from '../containers/HUaTi';
import ReMenDetail from '../containers/ReMenDetail';
import HUaTiDetail from '../containers/HUaTiDetail';
import NotFound from '../containers/NotFound'; //400

import ZhuYe from '../containers/ZhuYe' //个人主页
import ZhuYe_Ziliao from '../components/ZhuYe/ZhuYe_Ziliao' //个人主页-资料
import ZhuYe_Dongtai from '../components/ZhuYe/ZhuYe_Dongtai' //个人主页-动态
import ZhuYe_Guanzhu from '../components/ZhuYe/ZhuYe_Guanzhu' //个人主页-关注
import ZhuYe_Xiangce from '../components/ZhuYe/ZhuYe_Xiangce' //个人主页-相册
import InternalError from '../containers/Internal_Error' //500
import PiaoXuanToupiao from '../containers/PiaoXuanToupiao' //投票-详情
import ReMenShipin from '../containers/ReMenShipin'//热门视频
import RemenDyna from '../containers/RemenDyna'
import AccoutMain from  '../containers/accoutMain';//钻石市场账户
import VideoMain from '../containers/videoMain';//视频详情
import Search from '../containers/search'
import {Router, Route, hashHistory, Redirect, browserHistory, IndexRoute} from 'react-router'
import 'antd/dist/antd.css';


export default class Root extends React.Component {
	render() {
		return (
				<Router history={browserHistory}>
					<Route path="/index/:typea(/:typeb)" component={Index}></Route>
					<Route path="/acoutMain/:type" component={AccoutMain}></Route>
					<Route path="/videoMain/:userid" component={VideoMain}></Route>
						<Route path="/remen" component={ReMen}></Route>
						<Route path="/remen/detail" component={ReMenDetail}></Route>
						<Route path="/remen/shipin" component={ReMenShipin}/>
						<Route path="/remen/dyna" component={RemenDyna}/>
						<Route path="/xiehou" component={XieHou}></Route>
						<Route path="/piaoxuan" component={PiaoXuan}></Route>
						<Route path="/piaoxuan/toupiao" component={PiaoXuanToupiao}/>
						<Route path="/huati" component={HUaTi}></Route>
						<Route path="/huati/detail" component={HUaTiDetail}></Route>
						<Route path="/zhuye" component={ZhuYe}>
							<IndexRoute component={ZhuYe_Dongtai}/>
							<Route path="ziliao" component={ZhuYe_Ziliao}/>
							<Route path="guanzhu" component={ZhuYe_Guanzhu}/>
							<Route path="xiangce" component={ZhuYe_Xiangce}/>
						</Route>
						<Route path="/search" component={Search}></Route>
						<Route path='/404' component={NotFound} />
						<Route path='/500' component={InternalError}/>
						<Redirect from='/' to='/index/index'/>
						<Redirect from='/index' to='/index/index'/>
						<Redirect from='*' to='/404'/>
				</Router>
		);
	};
}
