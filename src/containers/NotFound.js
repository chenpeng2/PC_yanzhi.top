import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper'
import Footer from './footer'

export default class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        document.title = '糟糕！页面丢失......'
    };

    handler() {
        location.href = '/'
    }

    render() {
        return (
            <div>
                <div className="wrapper clearfix">
                    <Topper/>
                    <div className="containers notfound" style={{textAlign: 'center', padding: '230px 0'}}>
                        <img src="/src/assets/images/404.png" alt="404"/>
                        <p>
                            <a style={{
                                width: '140px',
                                background: '#ff7b98',
                                color: '#fff',
                                font: '18px/40px "微软雅黑"',
                                borderRadius: '5px',
                                display: 'inline-block',
                                margin: '30px auto',
                                cursor: 'pointer'
                            }} onClick={this.handler}>返回首页</a>
                        </p>
                    </div>
                    <Footer/>
                </div>
            </div>
        )
    };
}
