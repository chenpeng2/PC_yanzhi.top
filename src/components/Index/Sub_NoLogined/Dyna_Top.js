import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import moment from 'moment'
import {message,Popconfirm} from 'antd'
import {needLogin} from '../../../actions/index'
import AllRead from '../../Common/AllRead'
import {connect} from 'react-redux'
const base64 = require('base-64')
const utf8 = require('utf8')
import {Link} from 'react-router'
import TanKuang from '../../Common/TanKuang'
 class Dyna_Top extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.numberId = AllRead.getCookie('NUMBERID') ? /*base64.decode(JSON.parse(*/AllRead.getCookie('NUMBERID')/*))*/ : undefined
				this.state={
					isLike:false,
          message:{},
          sign:''
				}
  };
	componentWillMount() {
    this.setState({isLike:this.props.datas.isLike||this.props.datas.like});
    if(this.props.datas.userId==decodeURI(AllRead.getCookie('NUMBERID'))){
      this.setState({isLike:true})
    }else{

    }
	}
  componentWillReceiveProps(nextprops){
    this.setState({isLike:nextprops.datas.isLike||nextprops.datas.like});
  }
	xfetch = (url, name) => {

			let ori_data = {
					data: {
							[name]: this.props.datas.userId || '',
							numberID: this.numberId || '',
					},
					explain: {
							appToken:decodeURI(AllRead.getCookie('TOKEN')),
							// busType:"notice/v1/getNoticeList",
							// interfaceVersion:'v1',
							numberID: this.numberId || '',
					}
			}
			let jsons = JSON.stringify(ori_data)
			let bytes = utf8.encode(jsons)
			let base64_data = base64.encode(bytes)
			const personalMessage = {
					method: 'post',
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: 'data=' + base64_data,
			}
			fetch('http://192.168.1.129:92/' + url, personalMessage)
					.then(res => res.json())
					.then(json => {console.log(json)
              if(json.code=='SUCCESS'){this.setState({sign: '成功', message: {message: '关注成功'}});this.setState({isLike:!this.state.isLike})}
              else if(json.code=='PRESENCE'){this.setState({sign: '成功', message: {message: '你已关注'}});}
              else{}
					})

	}
	changeFollow = () => {
			let url, name
			if (!this.state.isLike) {
					url = 'Fan/v1/saveFans.mvc'
					name = 'likeId'
			} else {
					url = 'Fan/v1/noLike.mvc'
					name = 'recieverId'
			}
			this.xfetch(url, name)
	}
	confirm() {
		if (!this.numberId) {
				// alert('登录')
				this.props.dispatch(needLogin)
				return
		}
		this.changeFollow();

	}
	render() {
		return (
					<div class="top clearfix">
              <Link to={{pathname: '/zhuye', query: {id: this.props.datas.userId || this.props.datas.numberId}}}
                /*title="看他的主页"*/
                  target="_blank">
								<div class="float_left"><img src={this.props.datas&&this.props.datas.headPath!=undefined?this.props.datas.headPath+'!GDSIZE':'/src/assets/images/filterBg.png'}/></div>
              </Link>
              {this.state.isLike||this.props.hidden?''
                    :
                    <div className="float_right" onClick={this.confirm.bind(this)}>
  											<i className={this.state.isLike?'icon-guanzhued':"icon-guanzhu"}
  												 style={{marginRight: '2px'}}/>
  											{this.state.isLike? <span >已关注</span> : <span>关注</span>}
  									</div>
							}
							<div class="detail" >
                      <p class="font_bold">
                        <Link to={{pathname: '/zhuye', query: {id: this.props.datas.userId || this.props.datas.numberId}}}
                        /*title="看他的主页"*/
                          target="_blank">
                        <span>{this.props.datas.nickName}</span>
                            {this.props.datas.dynamicSkill?<i><b/>才艺</i>:null}
                        </Link>
                        {this.props.datas.leaguer || this.props.datas.isLeaguer ?
    <img style={{height:'20px',verticalAlign:'text-top',position:'relative',top:'1px'}}
    src={'/src/assets/images/黄钻.svg'}/> : ''}
                  </p>
									<p class="color">
                     {this.props.datas.createTime<Date.parse(new Date(moment(new Date().getTime()).format('YYYY-MM-DD'+' '+'00:00:00')))
                     ?
                     (
                       Date.parse(new Date(moment(new Date().getTime()-24*60*60*1000).format('YYYY-MM-DD'+' '+'00:00:00')))<this.props.datas.createTime
                       ?
                       '昨天 '+moment(this.props.datas.createTime).format('HH:mm')
                       :moment(this.props.datas.createTime).format('MM-DD-HH:mm')
                     )
                     :'今日 '+moment(this.props.datas.createTime).format('HH:mm')
                    }
                  </p>
							</div>
              <TanKuang flags={this.state.sign} message={this.state.message}
                        cancel={this.cancel}/>
					</div>
		);
	};
}
function mapStateToProps(state) {
    return {}
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Dyna_Top = connect(mapStateToProps, mapDispatchToProps)(Dyna_Top)
 export default Dyna_Top
