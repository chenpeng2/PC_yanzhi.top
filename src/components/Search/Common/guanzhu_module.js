import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {message,Popconfirm} from 'antd'
import {needLogin} from '../../../actions/index'
import AllRead from '../../Common/AllRead'
const base64 = require('base-64')
const utf8 = require('utf8')
import {connect} from 'react-redux'
import TanKuang from '../../Common/TanKuang'
class GuanZhu_Module extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        this.numberId = AllRead.getCookie('NUMBERID') ? /*base64.decode(JSON.parse(*/AllRead.getCookie('NUMBERID')/*))*/ : undefined
        this.state={
          isLike:'',
					message:{},
					sign:''
        }
  };
	componentWillMount(){
    this.setState({isLike:this.props.datas&&this.props.datas.isLike})
	};
  xfetch = (url, name) => {
      if (!this.numberId) {
          // alert('登录')
          this.props.dispatch(needLogin)
          return
      }
      let ori_data = {
          data: {
              [name]: this.props.datas.numberId || undefined,
              numberID: this.numberId || undefined,
          },
          explain: {
              appToken:decodeURI(AllRead.getCookie('TOKEN')),
              // busType:"notice/v1/getNoticeList",
              // interfaceVersion:'v1',
              numberID: this.numberId || undefined,
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
          .then(json => {
						if(name=='likeId'){
							if(json.code=='SUCCESS'){
								this.setState({sign: '成功', message: {message: '关注成功'},isLike:true});
							}else{
								this.setState({sign: '失败', message: {message: '关注失败'}});
							}
						}else{
							if(json.code=='SUCCESS'){
								this.setState({sign: '成功', message: {message: '取消关注成功'},isLike:false});
							}else{
								this.setState({sign: '失败', message: {message: '取消关注失败'}});
							}
						}
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
	cancel = () => {
			this.setState({sign: undefined})
	}
	render() {
		return (
            <div className="float_right" onClick={this.changeFollow.bind(this)}>
                <i className={this.state.isLike?'icon-guanzhued':"icon-guanzhu"}
                   style={{marginRight: '2px'}}/>
                {this.state.isLike? <span >已关注</span> : <span>关注</span>}
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
GuanZhu_Module = connect(mapStateToProps, mapDispatchToProps)(GuanZhu_Module)
 export default GuanZhu_Module
