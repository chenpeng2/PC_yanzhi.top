import React from 'react'
import {Pagination} from 'antd'
import {Link} from 'react-router'

const Follow = (props) => {
    // console.log(props)

    function confirm(item, e) {
        // console.log(e)
        // message.success('确认')
        change(item)
    }

    function cancel(e) {
        // console.log(e)
        // message.error('取消')
    }

    class a {

    }

    function change(item) {
        let id = item.numberId || item.NUMBERID
        item.isLike || props.title === '关注'
            ? props.click(id, 'remove')
            : props.click(id, 'add')
    }

    function fenYe(value, title) {
        props.fen(value, title);
    }

    // console.log(props.data)
    return (
        <div className="follow">
            <p className="title">共{props.title === '关注' ? '关注' : '有粉丝'}<b>{props.total}</b>人</p>
            <div className="content">
                {props.data.map((item, index) => (
                    <div key={index}>
                        <div className="float_left">
                            <Link to={'/zhuye'} query={{id: item.numberId || item.NUMBERID}} target={'_blank'}>
                                <img
                                    src={(item.headPath || item.HEADPATH) ? (item.headPath || item.HEADPATH) + '!GDSIZE' : '/src/assets/images/filterBg.png'}/></Link>
                        </div>
                        <div className="middle">
                            <p><span className={'nickname'}>{item.nickName || item.NICKNAME}</span>
                                {item.isLeaguer || item.ISLEAGUER ?
                                    <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</p>
                            <p className="font">{item.signature || item.SIGNATURE || 'TA没有留下简介'}</p>
                            <p className="font">粉丝：<span>{item.likeHeTotal || item.LIKEHETOTAL}</span></p>
                        </div>
                        {/*<Popconfirm title={item.isLike || props.title === '关注' ? '确认取消关注？' : '确认添加关注？'}*/}
                        {/*onConfirm={(e) => confirm(item, e)} onCancel={cancel} okText="确认" cancelText="取消">*/}
                        <div className="float_right" onClick={() => confirm(item)}>
                            <i className={item.isLike || props.title === '关注' ? 'icon-guanzhued' : 'icon-guanzhu'}
                               style={{marginRight: '2px'}}/>
                            {item.isLike || props.title === '关注' ? <span>已关注</span> : <span>关注</span>}
                        </div>
                        {/*</Popconfirm>*/}
                    </div>
                ))}
            </div>
            {props.total > 18 ? <div className="pagination">
                <Pagination total={props.total} defaultPageSize={18}
                            onChange={(value) => {
                                fenYe(value - 1, props.title)
                                $('html').scrollTop(0)
                                // console.log(value, props.title, 'follow')
                            }}
                            current={props.pageNo}
                            itemRender={(page, type: 'page' | 'prev' | 'next') => (
                                <span style={{padding: '0 3px'}}>
                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
						</span>)}/>
            </div> : null}
        </div>
    )
}
export default Follow
