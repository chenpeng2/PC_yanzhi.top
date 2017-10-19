import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper'
import Footer from './footer'
import TouPiao from '../components/PiaoXuan/TouPiao'
// import Bill_board from '../components/Common/Bill_board'
// import '../assets/css/piaoxuan.css'
import Sub_BillBoard from '../components/Common/Sub_BillBoard'
import AllRead from '../components/Common/AllRead'
import Board_PiaoXuan from '../components/Common/Board_PiaoXuan'
import Sub_HuoDong from '../components/Common/Sub_HuoDong'

const base64 = require('base-64')
const utf8 = require('utf8')

export default class PiaoXuan extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {data: null, notice: {}}
    };

    componentWillMount() {
        // www.yanzhi.top
        // 192.168.1.129:92
        // vote/v2/getFirstVerifyUser.do
        this.numberId = AllRead.getCookie('NUMBERID') ? /*base64.decode(JSON.parse(*/AllRead.getCookie('NUMBERID')/*))*/ : undefined
        this.numberId ?
            this.xfetch({numberID: this.numberId}, 'vote/v2/getFirstVerifyUser.do', 'data')
            : fetch('http://192.168.1.129:92/vote/v2/getVoteUserLIstById.do', {method: 'POST'})
                .then(res => res.json())
                .then(json => this.setState({data: json}))
        this.xfetch({noticeType: 'NOMAL'}, 'notice/v1/getNoticeList', 'notice')
        this.getNewRanking()
        this.getVoteRanking()
    }

    xfetch(data, url, count) {
        let ori_data = {
            data: data,
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
            .then(json => this.setState({[count]: json})/*, this.more()*/)
    }

    getNewRanking() {
        let personalMessage = AllRead.getRanking(base64, utf8, 1)

        fetch('http://192.168.1.129:92/ranking/v1/getNewRanking.do', personalMessage)
            .then(response => response.json()).then(json => {
            this.setState({getNewRanking_data: AllRead.sliceArr(json.data.list, 10)[0]})
        })
    }

    getVoteRanking() {
        let personalMessage = AllRead.getRanking(base64, utf8)
        // console.log(personalMessage)
        fetch('http://192.168.1.129:92/vote/v2/getCountVoteList.do', personalMessage)
            .then(response => response.json()).then(json => {
            this.setState({getVoteRanking_data: AllRead.sliceArr(json.data.voteList || [], 10)[0]})
        })
    }

    componentDidMount() {
        document.title = '票选'
    };

    // onSelect(index, direction) {
    //     // console.log('激活的幻灯片编号：', index, '，滚动方向：', direction)
    // }

    render() {
        // let data = ['/src/assets/images/huodong.png', '/src/assets/images/huodong2.png', '/src/assets/images/huodong3.png'],
        //     bills = [1, 2, 3, 4, 5, 6, 7, 8]
        // console.log(this.state)
        return (
            <div class="wrapper clearfix">
                <Topper piaoxuan='active'/>
                <div className="page_huati clearfix">
                    <div className="lef_content">
                        <Sub_HuoDong datas={this.state.notice.data ? this.state.notice.data.noticeList : []}/>
                        {this.state.data ? <TouPiao title="选女神" bills={this.state.data.data.girlList}/> : ''}
                        {this.state.data ? <TouPiao title="选男神" bills={this.state.data.data.boyList}/> : ''}
                    </div>
                    <div className="right_content">
                        <Board_PiaoXuan title="票选榜" datas={this.state.getVoteRanking_data || []}/>
                        <Sub_BillBoard title="认识新会员" datas={this.state.getNewRanking_data || []}/>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    };
}
