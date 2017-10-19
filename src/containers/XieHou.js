import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper'
import Footer from './footer'

import Sub_HuoDong from '../components/Common/Sub_HuoDong'
import {Pagination, Select} from 'antd'
import AllRead from '../components/Common/AllRead'
import {Link} from 'react-router'

import cities from '../assets/js/cities'
import Sub_BillBoard from '../components/Common/Sub_BillBoard'

const base64 = require('base-64')
const utf8 = require('utf8')

const Option = Select.Option

export default class XieHou extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {
            'checked1': true,
            'checked2': false,
            'focus': false,
            'checkAge': null,
            'checkSex': 0,
            'checkLeaguer': '1',
            'key': '0',
            'data': {},
            'data2': {},
            /*'index': 1,*/
            'list': true,
            'age': ['18以下', '18-20', '21-23', '24-26', '26以上'],
            'notice': {},
            'pageNo': 1,
            'pageNum': 1
        }
    };

    // componentWillMount() {
    //
    // }

    componentWillMount() {
        document.title = '邂逅'
        this.xfetch({noticeType: 'NOMAL'}, 'notice/v1/getNoticeList', 'notice')
        this.xfetch({number: 10}, 'v1/getOutsideUserFourInfo.do', 'data2')
        // this.xfetch(undefined, 'v1/getOutsideUserFourInfo.do', 'data')
        this.handle()
        this.numberId = AllRead.getCookie('NUMBERID')
    };

    xfetch(data, url, count) {
        let ori_data = {
            data: data,
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
        // console.log(personalMessage, jsons)
        fetch('http://192.168.1.129:92/' + url, personalMessage)
            .then(res => res.json())
            .then(json => this.setState({
                [count]: json.data,
                pageNo: json.data.pageNo,
                total: json.data.total,
                perPage: json.data.perPage
            }/*, console.log(json.data, json.data.pageNo, 'fetch')*/)/*, this.more()*/).catch(e => console.log(e.message))
    }

    handle = () => {
        // console.log(this.state)

        this.setState({list: true, pageNum: 1})
        let data = {
            sex: this.state.checkSex || undefined,
            age: this.state.checkAge || undefined,
            province: this.state.province || undefined,
            city: this.state.city !== '全国' ? this.state.city : undefined,
            leaguer: this.state.checkLeaguer || undefined,
            numberID: this.numberId || undefined
        }
        // console.log(this.state,data)
        this.xfetch(data, 'v1/getPcRadarUserInfo.do', 'data')
        //条件筛选
    }
    handleSel = (value) => {
        // console.log(value)
        this.setState({checkAge: value})
    }
    changeLeaguer = () => {

        let c1 = this.state.checked1, c2 = this.state.checked2

        c2 === c1
            ? this.setState({checkLeaguer: '2'})
            : (c2 > c1
                ? this.setState({checkLeaguer: '0'})
                : this.setState({checkLeaguer: '1'})
            )
    }
    handleSea = (e) => {
        // console.log(e.target.value)
        let data = {}
        this.setState({value: this.refs.sea.value, pageNo: e === 'page' ? this.state.pageNo : 1}, () => {
            if (this.refs.sea.value) {
                data = {
                    serachWord: this.refs.sea.value || undefined,
                    pageNo: this.state.pageNo || undefined,
                    perPage: 12,
                    numberID: this.numberId || undefined
                }
                // console.log(data, 'handle')
                this.xfetch(data, 'v1/getPcSerachUserInfo.do', 'data')
            } else {
                this.setState({pageNum: 1}, () => this.xfetch({}, 'v1/getPcRadarUserInfo.do', 'data'))
            }
        })

        // console.log(data)
        // this.xfetch(data, 'v1/getPcSerachUserInfo.do')
        // v1/getPcSerachUserInfo.do //关键字搜索
    }
    changeP = (key) => {
        // console.log(key, cities[key].province)
        if (key === '全国') {
            this.setState({province: undefined, city: undefined, key: null})
            return
        }
        this.setState({key, province: cities[key].province, city: cities[key].city[0]})
    }
    changeC = (key) => {
        // console.log(key)
        this.setState({city: key})
    }

    /*more = () => {
        let arr = AllRead.sliceArr(this.state.data.radarUserInfo || [], this.state.index * 10)
        console.log(arr, 'more')
        this.state.data.radarUserInfo
            ? (arr.length > 1
            ? this.setState({index: this.state.index + 1, list: true})
            : this.setState({list: false}))
            : null
    }*/

    render() {
        let /*bills = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ,*/
            list_data = this.state.total ?
                this.state.data.radarUserInfo :
                AllRead.sliceArr(this.state.data.radarUserInfo || [], 12)[this.state.pageNum - 1 || 0]
        // console.log(this.state.pageNo, 'render')
        /* || [], 12)[(this.state.page - 1) || 0]*/
        /*,dataSelect = [
         {value: 'one', label: 'One'},
         {value: 'two', label: 'Two'},
         {value: 'three', label: 'Three'}
         ];*/
        // console.log(this.state, list_data, this.state.data.radarUserInfo)
        // console.log(this.state.notice.noticeList)
        return (
            <div className="wrapper clearfix">
                <Topper xiehou='active'/>
                <div className="page_huati clearfix">
                    <div className="lef_content ">
                        <Sub_HuoDong datas={this.state.notice.noticeList || []}/>
                        <div className="tiaojian">
                            <p>找寻你喜欢的TA</p>
                            <div className="filter">
                                <label htmlFor="male">
                                    <b className={'male' + (this.state.checkSex !== 2 ? ' notchecked' : '')}>
                                        <input id="male"
                                               name="sex"
                                               style={{opacity: 0, float: 'left', margin: '-3px'}}
                                               onClick={() => this.setState({checkSex: 2})}
                                               type="radio"/></b>男生</label>
                                <label htmlFor="female">
                                    <b className={'female' + ((this.state.checkSex === 1 || this.state.checkSex === 0) ? '' : ' notchecked')}>
                                        <input defaultChecked={true}
                                               id="female"
                                               name="sex"
                                               style={{opacity: 0, float: 'left', margin: '-3px'}}
                                               onClick={() => this.setState({checkSex: 1})}
                                               type="radio"/></b> 女生</label>
                                <span>年龄：</span>
                                <Select defaultValue="2" size={'large'}
                                        onSelect={this.handleSel}
                                        style={{width: 95}}>

                                    {this.state.age.map((item, i) =>
                                        <Option key={i} value={`${i}`}>{item}</Option>)}
                                </Select>
                                <span>地区：</span>
                                <Select defaultValue="选择地区" size={'large'}
                                        onSelect={this.changeP}
                                        style={{width: 110}}>
                                    <Option key={-1} value={'全国'}>{'全国'}</Option>
                                    {cities.map((item, i) =>
                                        <Option key={i} value={'' + i}>{item.province}</Option>)}
                                </Select>
                                <Select defaultValue="选择城市" size={'large'}
                                        onSelect={this.changeC}
                                        value={this.state.city || '选择城市'}
                                        style={{width: 110, margin: '0 25px 0 10px'}}>
                                    {!this.state.province ? <Option key={-1} value={'全国'}>{'全国'}</Option>
                                        : cities[this.state.key].city.map((item, i) =>
                                            <Option key={i} value={'' + item}>{item}</Option>)}
                                </Select>
                                <div className="huiyuan">
                                    <span
                                        onClick={() => this.setState({checked1: !this.state.checked1}, this.changeLeaguer)}
                                        className={`shi ${this.state.checked1 ? 'checked' : ''}`}>会员</span>
                                    <span
                                        onClick={() => this.setState({checked2: !this.state.checked2}, this.changeLeaguer)}
                                        className={`fei ${this.state.checked2 ? 'checked' : '' }`}>非会员</span>
                                </div>
                                <button className="btn"
                                        onClick={() => this.setState({
                                            checkAge: this.state.checkAge || 2,
                                            checkSex: this.state.checkSex || 1
                                        }, this.handle)}>
                                    查找
                                </button>
                            </div>
                            <div className={'searcher' + (this.state.focus ? ' searcher2' : '')}
                                 onFocus={() => {
                                     this.setState({focus: true})
                                 }}
                                 onBlur={() => this.setState({focus: false})}
                                 onKeyUp={(e) => {
                                     e.keyCode === 13 ? this.handleSea() : null
                                 }}
                            >
                                <input className='input2'
                                       type="text" ref="sea" placeholder=' 搜索 昵称/用户名/ID'/>
                                {/*<span style={{display: !this.state.focus ? 'inline-block' : 'none'}}
                                ><i className="icon-sousuo"/>搜索 昵称/用户名/ID</span>*/}

                            </div>
                        </div>
                        <div className="jieguo">
                            <p>查找结果</p>
                            {/*this.state.data.length ? this.state.data*//*: <Loading/>*/}
                            {list_data ? <div> {list_data.map((item, i) => (
                                    <div key={i} className="jieguo_item">
                                        <Link to={{pathname: '/zhuye', query: {id: item.userId || item.numberId}}}
                                            /*title="看他的主页"*/
                                              target="_blank">
                                            <img
                                                ref={img => this.img = img}
                                                onError={() => {
                                                    this.img.src = '/src/assets/images/filterBg.png'
                                                    // console.log(this.img, 'onError')
                                                }}
                                                src={(item.headUrls || item.headPath) ? (item.headUrls || item.headPath) + `!gaoyanzhiDB` : '/src/assets/images/filterBg.png'}
                                                alt="结果"/>
                                            {/*<div className="jieguo_mask">看{item.sex === '女' ? '她' : '他'}的主页</div>*/}
                                            <p><span>{item.nickName}</span>{item.leaguer || item.isLeaguer ?
                                                <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</p>
                                        </Link>
                                    </div>
                                ))}
                                    <div className="clearfix"/>
                                    <div className="pagination">
                                        <Pagination
                                            total={this.state.data.total || this.state.data.radarUserInfo.length}
                                            pageSize={12}
                                            size={'large'}
                                            current={this.state.pageNo || this.state.pageNum || 1}
                                            onChange={(page, pageSize) => {
                                                // console.log(page, pageSize, this.state.pageNo, this.state.pageNum, 'change')
                                                this.state.total
                                                    ? this.setState({
                                                        pageNo: page,
                                                        pageSize: pageSize
                                                    }, this.handleSea('page'))
                                                    : this.setState({pageNum: page})
                                                // this.handleSea()
                                                $('html, body').animate({
                                                    scrollTop: 0
                                                }, {duration: 100, easing: 'swing'})
                                            }}
                                            itemRender={(page, type: 'page' | 'prev' | 'next') => (
                                                <span style={{padding: '0 3px'}}>
                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : null))}
						</span>)}/>
                                    </div>
                                </div> : /*<div style={{textAlign: 'center', width: 796, font: '18px/24px ""'}}>*/
                                <div className="nodata"><img src="/src/assets/images/nodata/nodata.jpg"/></div>
                                /*</div>*/}

                            {/*{this.state.list ? <div className="jieguo_more" onClick={this.more}>加载更多</div> : null}*/}
                        </div>
                    </div>
                    <div className="right_content">
                        <Sub_BillBoard title="你可能喜欢"
                                       datas={this.state.data2.radarUserInfo || []}/>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    };
}
