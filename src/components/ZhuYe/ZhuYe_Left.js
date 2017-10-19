import React from 'react'
import {Link} from 'react-router'

const ZhuYe_Left = (props) => {
    // console.log(props)
    return props.data && props.list ?
        <div className="left_content">
            <div className="left_item1">
                <p>
                    <Link to="/zhuye/guanzhu"
                          disabled={!props.self}
                          query={{
                              a: btoa(1),
                              id: props.id
                          }}><b>{props.data.my_like_nums || 0}</b><span>关注</span></Link>
                    {/*stupid*/}
                </p>
                <p className="c">
                    <Link to="/zhuye/guanzhu"
                          disabled={!props.self}
                          query={{
                              a: window.btoa(2),
                              id: props.id
                          }}><b>{props.data.like_nums || 0}</b><span>粉丝</span></Link>
                </p>
                <p>
                    <Link to="/zhuye" query={{
                        id: props.id
                    }}><b>{props.list.total || 0}</b><span>动态</span></Link>
                </p>
            </div>
            <div className="left_item2">
                <p>
                    {props.self && props.data2.userbase && !props.data2.userbase.leaguer ?
                        <span className="b"><Link className="btn"
                                                  onClick={() => props.popApply()}>申请会员</Link></span> : ''}
                    <span
                        style={props.self ? {textAlign: 'left'} : null}>招募商：<i>{props.data2.userbase && props.data2.userbase.fromBC ? '上海贝才网络' : '暂无'}</i></span>
                </p>
                <ul>
                    <li><span>昵称</span>{props.data.nickName}{props.data.leaguer ?
                        <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</li>
                    <li>
                        <span>学校</span>{props.data.school || (props.data2.userInfo ? (props.data2.userInfo.school || '未知') : '未知')}
                    </li>
                    <li>
                        <span>职业</span>{props.data.professional || (props.data2.userInfo ? (props.data2.userInfo.professional || '未知') : '未知')}
                    </li>
                    <li><span>简介</span>{props.data.signature}</li>
                    <li><span>地区</span>{props.data.city || '未知'}</li>
                    <li>
                        <span>兴趣爱好</span>{props.data.interest || (props.data2.userInfo ? (props.data2.userInfo.interest || '未知') : '未知')}
                    </li>
                </ul>
                <p><Link to="/zhuye/ziliao"
                         query={{
                             id: props.id
                         }}>{!props.self ? '查看更多资料>>' : '编辑个人资料>>'}</Link></p>
            </div>
            <div className="left_item3">
                <p>相册
                    <Link to="/zhuye/xiangce"
                          state={{refresh: true}}
                          query={{
                              id: props.id
                          }}>更多>></Link></p>
                <ul>
                    {props.data3.photoList.length > 0 ? props.data3.photoList.map((item, i) => {
                            return i > 3 ? null : <li key={i}>
                                <Link to="/zhuye/xiangce"
                                      state={{refresh: true}}
                                      query={{
                                          id: props.id
                                      }}><img
                                    src={item.url + '!gdsize100' || '/src/assets/images/xiangce.png'} alt="相册"/>
                                </Link></li>
                        }) :
                        <div class="nodata_div"><img width={'100%'} src="/src/assets/images/nodata/nodata2.jpg"/></div>}

                </ul>

            </div>
        </div>
        : null
}
export default ZhuYe_Left