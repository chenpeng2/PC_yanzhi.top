import {Tabs} from 'antd'
import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Follow from './Follow'
import AllRead from '../Common/AllRead'
import TanKuang from '../Common/TanKuang'

const TabPane = Tabs.TabPane

const base64 = require('base-64')
const utf8 = require('utf8')
/*个人主页 内关注粉丝展示*/
export default class ZhuYe_Guanzhu extends React.Component {
    changeFollow = (id, add) => {
        let url, name, count = 'message'
        // console.log(id, add)
        if (add === 'add') {
            url = 'Fan/v1/saveFans.mvc'
            name = 'likeId'
        } else {
            url = 'Fan/v1/noLike.mvc'
            name = 'recieverId'
        }
        this.xfetch(url, count, name, id)
    }
    fen = (value, title) => {
        // console.log(value, title)
        if (title === '关注') {
            let myLike_list = AllRead.sliceArr(this.state.myLike, 18)[value]
            this.setState({myLike_list, pagemy: value + 1},()=>{$("html, body").animate({
        					scrollTop: 0 }, {duration: 100,easing: "swing"})})
        } else {
            let likeMy_list = AllRead.sliceArr(this.state.likeMy, 18)[value]
            this.setState({likeMy_list, pagelike: value + 1},()=>{$("html, body").animate({
        					scrollTop: 0 }, {duration: 100,easing: "swing"})})
        }
    }

    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {Tabkey: window.atob(props.location.query.a) || '1', myLike: [], likeMy: []}

    };

    componentWillMount() {
        this.xfetch('Fan/v3/likeMy.mvc', 'likeMy')
        this.xfetch('Fan/v3/findLike.mvc', 'myLike')

    }

    xfetch(url, count, name, id) {
        this.numberId = /*base64.decode(JSON.parse(*/AllRead.getCookie('NUMBERID')
        /*))*/
        let ori_data = {
            data: {
                [name]: id || undefined,
                numberID: this.numberId || undefined,
            },
            explain: {
                appToken: AllRead.getCookie('TOKEN'),
                // busType:"notice/v1/getNoticeList",
                // interfaceVersion:'v1',
                numberID: this.numberId || undefined,
            }
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
                if (json.message === '添加喜欢成功') {
                    this.setState({message: json, sign: '成功'}, () => {
                    })
                } else if (json.message === '不能删除自己') {
                    this.setState({message: json, sign: '失败'}, () => {
                    })
                }
                count !== 'message'
                    ? this.setState({[count]: json.data[count]}, () => {
                        this.fen(0, '关注')
                        this.fen(0, '粉丝')
                    })
                    : this.setState({[count]: json}, () => {
                        this.props.update()
                        this.componentWillMount()
                    })
            }).catch(e => {
            this.setState({message: e.message, sign: '失败'})
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({Tabkey: window.atob(nextProps.location.query.a) || '1'})
    }

    render() {

        // console.log(this.state)
        // console.log(this.props.location.query)
        let list_mylike = this.state.myLike_list, list_likemy = this.state.likeMy_list
        return (
            <div className="dongtai">
                <Tabs activeKey={this.state.Tabkey} onTabClick={(key) => this.setState({Tabkey: key})}>
                    <TabPane tab="关注" key="1">
                        <Follow data={list_mylike || []} total={this.state.myLike.length} fen={this.fen}
                                title='关注' pageNo={this.state.pagemy}
                                click={this.changeFollow}/>
                    </TabPane>
                    <TabPane tab="粉丝" key="2">
                        <Follow data={list_likemy || []} total={this.state.likeMy.length} fen={this.fen}
                                title='粉丝' pageNo={this.state.pagelike}
                                click={this.changeFollow}/>
                    </TabPane>
                </Tabs>
                <TanKuang flags={this.state.sign} message={this.state.message || {}}
                          cancel={() => this.setState({sign: undefined})}/>
            </div>
        )
    }
}
