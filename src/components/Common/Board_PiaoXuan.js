import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'

export default class Board_PiaoXuan extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
    };

    render() {
        // console.log(this.props.datas)
        return (
            <div class="bills">
                {/*票选榜单*/}
                {this.props.datas === ''
                    ? ''
                    : <div>
                        <div class="title">{this.props.title}</div>
                        {this.props.datas.map((item, index) => (
                            <div key={index}
                                 className={(index !== 0) ? (index !== 1) ? 'bills_pre' : 'second bills_pre' : 'first bills_pre'}>
                                <i>{index + 1}</i>
                                <div class="detail">
                                    <Link to="/zhuye" query={{id: item.getVoteUserId}} target="_blank">
                                        <div class="float_left">
                                            <img width={40}
                                                 src={!item.headPath && !item.headUrls
                                                     ? '/src/assets/images/filterBg.png'
                                                     : (item.headPath || item.headUrls) + '!GDSIZE'}/>
                                        </div>
                                        <div className={'vote_bill'}>
                                            <p title={item.nickName}><span >{item.nickName}</span>{item.leaguer || item.isLeaguer ?
                                                <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</p>
                                            <p className={'right'}>
                                                {(item.voteCount >= 100000 ? parseInt(item.voteCount / 1000) + 'K+' : item.voteCount ) || '0'}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}</div>}
            </div>
        )
    };
}
