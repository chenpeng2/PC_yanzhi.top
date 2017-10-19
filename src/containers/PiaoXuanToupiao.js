import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
// import {Pagination} from 'antd'
import Topper from './topper'
import Footer from './footer'
// import ReMenDetailMFirst from '../components/ReMen/ReMen_Detail_M_first'
import Nevleft from '../components/vote/include/nevleft'
import AllRead from '../components/Common/AllRead'
import PinLun from '../components/Common/Pin_Lun'
import {connect} from 'react-redux'
import {needLogin} from '../actions/index'
import TanKuang from '../components/Common/TanKuang'

const base64 = require('base-64')
const utf8 = require('utf8')
// import ReMenDetailMSecond from '../components/ReMen/ReMen_Detail_M_second'
/*票选2,3*/
class PiaoXuan_Toupiao extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        // console.log(props)
        this.state = {
            vote: null,
            flags: false,
            key: 0,
            data: {},
            hot: 'hot',
            message: {}
        }
    };

    componentWillMount() {
        // console.log('touch')
        document.title = '投票'
        this.id = this.props.location.query.id
        this.numberId = AllRead.getCookie('NUMBERID')
        this.xfetch('sort', this.state.hot, 'vote/v2/selsetVoteInfo.do', 'data')
    };

    change() {
        console.log(this.numberId)
        if (!this.numberId) {
            // alert('登录')
            this.props.dispatch(needLogin)
            return
        }
        // this.setState({vote: !this.state.vote}, () => {
        //vote/v2/voteOtherUser.do
        this.xfetch('isPass', this.state.flags, 'vote/v2/voteOtherUser.do', 'data2')
        this.componentWillMount()
        // })

    }

    /*choose = () => {
        // console.log('choose')
        this.xfetch('sort', this.state.hot, 'vote/v2/selsetVoteInfo.do', 'data3')
    }*/

    xfetch(name, data, url, count) {
        let ori_data = {
            data: {
                otherUserId: this.id || undefined,
                [name]: data || undefined,
                numberID: this.numberId || undefined,
            },
            explain: this.numberId ? {
                appToken: AllRead.getCookie('TOKEN'),
                // busType:"notice/v1/getNoticeList",
                // interfaceVersion:'v1',
                numberID: this.numberId || undefined,
            } : undefined
        }
        let jsons = JSON.stringify(ori_data)
        // console.log(jsons)
        let bytes = utf8.encode(jsons)
        let base64_data = base64.encode(bytes)
        const personalMessage = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + base64_data,
        }
        // console.log(personalMessage)
        fetch('http://192.168.1.129:92/' + url, personalMessage)
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.code === 'SUCCESS') {
                    this.setState({
                        [count]: count === 'data' ? json : json.data,
                        vote: !this.state.vote
                    })
                    if (name === 'isPass') {
                        this.setState({
                            sign: '成功',
                            message: {message: '投票成功'}
                        })
                    }
                } else {
                    this.setState({sign: '失败', message: {message: '投票失败'}})

                }
            }).catch(e => {
            console.log(e.message)
        })
        //www.yanzhi.top
        //192.168.1.129:92
    }

    /*huati_content(key, event) {
        if (key == 're') {
            this.setState({checkType: ''})
        } else {
            this.setState({checkType: true})
        }
    }*/
    cancel = () => {
        this.setState({sign: undefined})
    }

    slider(state) {

        state === 'prev' ? this.state.key > 0 ? this.setState({key: this.state.key - 1}) : this.setState({key: 3}) : ''
        state === 'next' ? this.state.key < 3 ? this.setState({key: this.state.key + 1}) : this.setState({key: 0}) : ''

        // console.log(state, this.state.key)
    }

    render() {
        // this.state.data2 ? console.log(this.state.data2.errorMessage) : null
        // console.log(this.state.dynamicId)
        let data3 = this.state.data,
            total = data3.data ? data3.data.passNumber + data3.data.noPassNumber : 0
        let scale = data3.data ? (data3.data.passNumber / total) * 100 + '%' : null
            ,
            scale2 = data3.data ? (data3.data.noPassNumber / total) * 100 + '%' : null
        // console.log(scale, scale2, total, data3, this.state)
        let show = <div className="show">
            <p>当前投票结果</p>
            <div className="jieguo">
                <div className="weizhi" style={{left: scale}}>
                    <span>TA在这</span>
                    <img src="/src/assets/images/weizhi.png"/>
                </div>
                <div style={{overflow: 'hidden', borderRadius: '5px'}}>
                    <div className="jindu" style={{width: scale}}/>
                </div>
                <div className="tip">
                    <span className="tg" style={{width: scale}}>通过</span>
                    <span className="btg" style={{width: scale2}}>不通过</span>
                </div>
            </div>
        </div>
        let vote = <div className="vote">
            <p>你支持TA成为会员吗？请投票：</p>
            <div className="xuanze">
                <a className={'zhichi' + (this.state.flags === 'yes' ? ' active' : '')}
                   onClick={() => this.setState({flags: 'yes'})}>
                    支持
                </a>
                <a className={'bu' + (this.state.flags === 'no' ? ' active' : '')}
                   onClick={() => this.setState({flags: 'no'})}>
                    不支持
                </a>
            </div>
            <a className="done"
               onClick={this.change.bind(this)}
               disabled={!this.state.flags}
               style={this.state.flags ? null : {background: '#ccc'}}>投票</a>
        </div>
        let data_img = [], data_msg = ['正面特写', '半身特写', '全身特写', '视频'], data_i = {}
        if (data3.code === 'SUCCESS') {
            // console.log(data, data.data)
            data_i = data3.data
            data_img = [data_i.faceDatum.path, data_i.halfDatum.path, data_i.fullDatum.path, data_i.videoDatum.videoThumb]
        }
        // console.log(this.state.data, data3, data_i)
        return (
            <div class="wrapper clearfix">
                <Topper piaoxuan='active'/>
                <div className="xiangqing">
                    {data3.data ? <Nevleft type="vote" data={{...data_i, ...{userId: this.id}}}/> : null}
                    <div className="vote_view">
                        <a className="icon-zuoce" onClick={this.slider.bind(this, 'prev')}/>
                        {this.state.key === 3 ?
                            <video controls={true} height='619' src={data_i.videoDatum.path}/> :
                            <div>
                                <a onClick={() => {
                                    window.open(data_img[this.state.key], '_blank')
                                }}
                                   style={{backgroundImage: `url(${data_img[this.state.key]})`}}
                                   title="点击查看原图"/>
                            </div>}
                        <a className="icon-youce" onClick={this.slider.bind(this, 'next')}/>
                    </div>
                    <ul>
                        {data_img.map((item, i) =>
                            <li key={i} className={i === this.state.key ? 'active' : null}
                                onClick={() => this.setState({key: i})}>
                                <div style={{backgroundImage: `url(${item}!gaoyanzhiDB)`}}/>
                                {i === 3 ?
                                    <img src="/src/assets/images/playred.svg" className="pl_btn"/>
                                    : ''}
                            </li>)}
                    </ul>
                </div>
                <div className="flag">
                    <img src="/src/assets/images/三角.svg"/>
                    <div style={{fontSize: '18px', color: '#333'}}>{data_msg[this.state.key]}</div>
                </div>
                {(data3 && data3.data && (data3.data.voteId || !data3.data.states)) ? show : vote}
                <div className={'remen_detail'} style={{width: 800, margin: '0 auto', backgroundColor: '#fff'}}>
                    {data3.data ? <PinLun
                        width_text="610" width_line="710" dynamicId={data3.data.dynamicId}/> : null}</div>
                <TanKuang flags={this.state.sign} message={this.state.message}
                          cancel={this.cancel}/>
                <Footer/>
            </div>
        )
    };
}

function mapStateToProps(state) {
    return {}
}

//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

//连接组件
PiaoXuan_Toupiao = connect(mapStateToProps, mapDispatchToProps)(PiaoXuan_Toupiao)
export default PiaoXuan_Toupiao
