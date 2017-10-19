/**
 * Created by Administrator on 2017-7-17-0017.
 */
import React from 'react'
import {Link} from 'react-router'

/*class TouPiao extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {data: null}
    }

    render() {*/
const TouPiao = (props) => {
    // console.log('票选')
    return (
        <div className="toupiao">
            <p>{props.title}</p>
            <ul>
                {props.bills.length > 0 ? props.bills.map((item, i) => (
                    <li key={i}>
                        <Link to={`/piaoxuan/toupiao`}
                              state={{voted: !item.vote}}
                              query={{id: item.otherUserId}}
                        >
                            <p style={{
                                backgroundImage: `url(${item.headUrls}!MIN100)`
                            }}
                            >{props.title === '选男神' ? '男神' : '女神'}</p>
                            {/*Chrome 滚动卡顿*/}
                            {/*这个是Chromium的resize算法的问题，不是高清图片的问题，
                            只有在大图片有了CSS属性width和height值并且小于原图的大小需要浏览器resize缩放时Chromium才会慢，
                            因为Chromium的resize缩放用了最清晰的lanczos4算法，这个算法是最慢最慢的缩放算法（我不知到Chromium为什么要用这个算法）。
                            这个是Chromium的问题不是Webkit的问题。----百度之*/}
                            {/*<img src={item.headUrls}  alt={this.props.title === '选男神' ? '男神' : '女神'}/>*/}
                            {/*object-fit: cover; object-position: center; img图片 不变形/裁剪 缩放，IE不支持*/}
                            <span>{item.nickName}{item.leaguer ?
                                <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</span>
                            <b><i style={!item.vote ? {background: '#ccc'} : {}}>{!item.vote ? '已' : ''}投票</i></b>
                        </Link>
                    </li>
                )) : <div class="nodata_div"><img src="/src/assets/images/nodata/nodata.jpg"/></div>}
            </ul>
        </div>
    )
    // }
}

export default TouPiao
