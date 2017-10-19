import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link,browserHistory} from 'react-router';
import { Modal,Button,Tabs } from 'antd';
const TabPane = Tabs.TabPane;
import Login from '../components/Index/Sub_NoLogined/login'
import Register from '../components/Index/Sub_NoLogined/register'
import ResetMima from '../components/Index/Sub_NoLogined/Reset_mima'
import {connect} from 'react-redux'
import {setCookie,getCookie,deleteCookie,changeTextAction,searchTopic,needLogin,applyMember,buttonClickAction} from '../actions/index.js'
import AllRead from '../components/Common/AllRead.js'
 class Topper extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					logined:'',
					modal1Visible: false,
					modalLogin:false,
					modalRegister:false,
					resetLogin:false,
          headPath:'',
          nickName:'',
          popApply:false
				}
  };
	componentWillMount(){
    setInterval(this.checkCookie(),1000);
    var NICKNAME=AllRead.getCookie('NICKNAME');
    var NUMBERID=AllRead.getCookie('NUMBERID');
    var HEADPATH=AllRead.getCookie('HEADPATH');
    if(NICKNAME){
      this.setState({headPath:decodeURI(HEADPATH),nickName:decodeURI(NICKNAME)});
    }
		// console.log(AllRead.getCookie('login_datas'));
	};
  checkCookie(){
    this.setState({logined:AllRead.getCookie('NICKNAME')});
  }
  componentDidMount(){

  }
	setModalVisible(modal1Visible) {
    this.setState({ modal1Visible });
  }
	setModalLogin(modalLogin) {
    this.setState({ modalLogin },()=>{
      // 检测是否有保存的账户名
      var userName=localStorage.getItem('userN');
        $('#userName').val(userName)
    });

  }
  setPopApply(popApply){
    this.setState({ popApply});
  }
	setModalRegister(modalRegister) {
    this.setState({ modalRegister });
  }
	setResetLogin(resetLogin){
		this.setState({ resetLogin });
	}
	callback(key) { console.log(key);}
	forgetPass(){
			this.clearAllGo()
			this.setState({ resetLogin:true });
	}
  clearAllGo(){
    this.setState({ modalLogin:false});
    this.setState({ modalRegister:false});
    this.setState({ resetLogin:false });
  }
	goRegister(){
		this.clearAllGo()
    this.setState({modalRegister:true})
	}
	goLogin(){
		this.clearAllGo()
		this.setState({ modalLogin:true});
	}
  disappear(dis_type,bool,event){
    if(dis_type=='login'){
      this.setState({ modalLogin:bool });
      this.setState({ logined:true });
      var NICKNAME=AllRead.getCookie('NICKNAME');
      var HEADPATH=AllRead.getCookie('HEADPATH');
      this.setState({
        headPath:decodeURI(HEADPATH),
        nickName:decodeURI(NICKNAME)
      });
    }
    else if(dis_type=='reset'){
      this.setState({ resetLogin:bool });
    }
    else{
      this.setState({ modalRegister:bool });
    }
    location.reload()
  }
  searchId(e){
    if(e.keyCode==13){
      var input=this.refs.searchId
      browserHistory.push({pathname:'/search',query:{type:'all'},state:{search:input.value}});
      this.props.dispatch(searchTopic);
      location.reload()
    }
  }
  searchIdClick(){
    var input=this.refs.searchId
    browserHistory.push({pathname:'/search',query:{type:'all'},state:{search:input.value}})
    this.props.dispatch(searchTopic);
    location.reload()
  }
  needLogin(){
    //写弹出窗口
    this.setState({ modalLogin:true });
    this.props.dispatch(changeTextAction)
  }
  popApply(){
    //写弹出窗口
    this.setPopApply(true);
    this.props.dispatch(buttonClickAction)
  }
  quit(){
  	let numberId=AllRead.getCookie('NUMBERID'),
	  userId='',str=location.href,self=false;
  	if(/(zhuye)/gi.test(str)){
  		userId=str.substr(str.indexOf('id=')+3)
		self=numberId===userId
	}
    this.props.dispatch(deleteCookie());
    const toIndex=/(acoutMain|zhuye$)/gi.test(str)||self;
    if(toIndex){
        window.location.href='/';
    }else{
        location.reload()
    }
  }
  componentWillReceiveProps(nextprops){
    if(nextprops.popState=='need'){this.needLogin()}
    if(nextprops.popApply=='need'){this.popApply()}
  }
  goRecharge(){
  if(this.state.logined){
    window.open('/acoutMain/recharge','_blank')
  }else{
     this.props.dispatch(needLogin)
  }
}
goWithdraw(){
  if(this.state.logined){
    window.open('/acoutMain/withdraw','_blank')
  }else{
    this.props.dispatch(needLogin)
  }
}
onrefresh(){
  this.props.refresh()
}
	render() {
		const show_login=this.state.logined
		?
		<div class="float_left">
      <Link class="person" to={{pathname: '/zhuye', query: {id: decodeURI(AllRead.getCookie('NUMBERID'))}}}
        /*title="看他的主页"*/
          target="_blank">
			<span class="geren_bg"><img src={this.state.headPath&&this.state.headPath!='undefined'?this.state.headPath+'!MIN100':'/src/assets/images/filterBg.png'}/></span><span class="name">{this.state.nickName}</span>
    </Link>
    </div>
		:
		<div class="float_left" style={{lineHeight:'50px'}}>
			<button type="button" class="login" onClick={() => this.setModalLogin(true)}>登录</button>
			<button type="button" class="register" onClick={() => this.setModalRegister(true)}>注册</button>
		</div>
		return (
			<div>
        <div class="topper">
            {this.state.logined
            ?<div class="float_right reset" >
                <img style={{marginTop:'7px'}} src='/src/assets/images/quict/reset.png'/>
                <div class="quict" onClick={this.quit.bind(this)}>
                  <img src='/src/assets/images/quict/quict.png'/>
                  退出
                </div>
              </div>
            :''}
            {this.state.logined
            ?<div class="float_right v_line" style={{padding:'0 20px'}}>|</div>
            :''}
						<div class="float_right">招募</div>
						<div class="float_right v_line" style={{padding:'0 20px'}}>|</div>
						<div class="float_right">客服</div>
						<div class="float_right v_line" style={{padding:'0 20px'}}>|</div>
						<div class="float_right">FAQ</div>
				</div>
				<div class="header">
						<div class="content clearfix">
								<div class="logo float_left"><img style={{cursor:'pointer'}} onClick={()=>location.href='/'} src="/src/assets/images/logo.png"/></div>
								<div class="float_left download" onClick={() => this.setModalVisible(true)}><i class="icon-xiazai"></i>下载APP</div>
								<div class="float_left title_left">
										<ul>
											<li className={this.props.shouye?'active':''}><Link to={'/index'} onClick={this.props.shouye?this.onrefresh.bind(this):null}>首页</Link></li>
											<li className={this.props.remen?'active':''}><Link to={'/remen'} >热门</Link></li>
											<li className={this.props.xiehou?'active':''}><Link to={'/xiehou'} >邂逅</Link></li>
											<li className={this.props.piaoxuan?'active':''}><Link to={'/piaoxuan'} >票选</Link></li>
											<li className={this.props.huati?'active':''}><Link to={'/huati'} >话题</Link></li>
										</ul>
								</div>
								<div class="float_left searcher">
										<input type="text" placeholder="搜索用户名/ID/话题" value={undefined} ref='searchId'  onKeyDown={this.searchId.bind(this)}/>
										<i class="icon-sousuo" style={{verticalAlign:'middle',fontSize:'20px'}} onClick={this.searchIdClick.bind(this)}></i>
								</div>
								<div class="float_right login">
									{show_login}
										<div class="float_right">
                      <span onClick={this.goRecharge.bind(this)} style={{color:'#F39700',cursor:'pointer'}}>充值</span>
											<span class="v_line" style={{position:'relative',top:'-2px'}}>|</span>
											<span onClick={this.goWithdraw.bind(this)} style={{color:'rgb(148,148,148)',cursor:'pointer'}}>提现</span>
										</div>
								</div>
						</div>
				</div>
			 <Modal
				 style={{ top: '200px' }}
				 visible={this.state.modal1Visible}
				 onOk={() => this.setModalVisible(false)}
				 onCancel={() => this.setModalVisible(false)}
				 footer={null}
			 >
				 <p class="top">扫一扫，加入高颜值玩转颜值圈</p>
				 <div class="container clearfix">
				 			<img class="float_left" src="/src/assets/images/scan.png"/>
							<div class="float_right">
									<div>
										<p class="icon"><i class="icon-ios"></i></p>
										<p class="text">iOS客户端下载</p>
									</div>
									<div style={{marginTop:'42px'}}>
										<p class="icon"><i class="icon-android"></i></p>
										<p class="text">安卓客户端下载</p>
									</div>
							</div>
				 </div>
			 </Modal>
       <Modal
        style={{ top: '200px' }}
        visible={this.state.popApply}
        onOk={() => this.setPopApply(false)}
        onCancel={() => this.setPopApply(false)}
        footer={null}
      >
        <p class="top">请登录手机端申请会员</p>
        <div class="container clearfix">
             <img class="float_left" src="/src/assets/images/scan.png"/>
             <div class="float_right">
                 <div>
                   <p class="icon"><i class="icon-ios"></i></p>
                   <p class="text">iOS客户端下载</p>
                 </div>
                 <div style={{marginTop:'42px'}}>
                   <p class="icon"><i class="icon-android"></i></p>
                   <p class="text">安卓客户端下载</p>
                 </div>
             </div>
        </div>
      </Modal>
			 <Modal
				 style={{ top: '200px' }}
				 visible={this.state.modalLogin}
				 onOk={() => this.setModalLogin(false)}
				 onCancel={() => this.setModalLogin(false)}
				 footer={null}
         wrapClassName={'login'}
         width={'380'}
			 >
				 <div class="top login">
					 <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)}  animated={false}>
					 <TabPane tab="登录" key="1"> <Login disapper={this.disappear.bind(this,'login',false)} forgetPass={this.forgetPass.bind(this)}/></TabPane>
					 <TabPane tab="注册" key="2"><Register disapper={this.disappear.bind(this,'register',false)}/></TabPane>
					 </Tabs>
				 </div>
			 </Modal>
			 <Modal
				 style={{ top: '200px' }}
				 visible={this.state.modalRegister}
				 onOk={() => this.setModalRegister(false)}
				 onCancel={() => this.setModalRegister(false)}
				 footer={null}
         wrapClassName={'register'}
         width={'380'}
			 >
				 <div class="top login">
					 <Tabs defaultActiveKey="2" onChange={this.callback.bind(this)}  animated={false}>
					 <TabPane tab="登录" key="1"> <Login disapper={this.disappear.bind(this,'login',false)} forgetPass={this.forgetPass.bind(this)}/></TabPane>
					 <TabPane tab="注册" key="2"><Register disapper={this.disappear.bind(this,'register',false)}/></TabPane>
					 </Tabs>
				 </div>
			 </Modal>
			 <Modal
				style={{ top: '200px' }}
				visible={this.state.resetLogin}
				onOk={() => this.setResetLogin(false)}
				onCancel={() => this.setResetLogin(false)}
				footer={null}
        wrapClassName={'resetLogin'}
        width={'380'}
			>
			<p class="reset_top">重置密码</p>
			<ResetMima goRegister={this.goRegister.bind(this)} goLogin={this.goLogin.bind(this)} disapper={this.disappear.bind(this,'reset',false)}/>
			</Modal>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return {
      popState:state.counter.popState,
      popApply:state.counter.popApply
    }
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Topper = connect(mapStateToProps, mapDispatchToProps)(Topper)
 export default Topper
