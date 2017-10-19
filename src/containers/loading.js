/**
 * Created by Administrator on 2017-7-17-0017.
 */
import React from 'react'

const Loading = () => (
    <div style={{textAlign: 'center', fontSize: '12px', marginTop: '20px', background: '#fff'}} className="loading">
        <span className="icon-jiazai" style={{
            animation: 'loop linear 2s infinite',
            verticalAlign: 'middle',
            fontSize: '25px',
            width: '34px',
            lineHeight: '34px',
            display: 'inline-block',
            color: '#333'
        }}
        > </span>{'正在加载中，请稍后...'}
        {/*e96b*/
            /*src="/src/assets/images/jiazai.svg"
              alt="加载中"*/}
    </div>
)

export default Loading