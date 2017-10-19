/**
 * Created by Administrator on 2017-7-11-0011.
 */
import React from 'react'
if ('scrollRestoration' in history) {
    // Back off, browser, I got this...
    history.scrollRestoration = 'manual'
}
const Footer = () => (
    <div id="footer">
        <div>
          <p><a href="http://yanzhi.top/staticpage/aboutUsPC.html">关于高颜值</a> | <a target="_blank" href="http://yanzhi.top/staticpage/userAgreementPC.html">用户注册协议</a></p>
          <p><a style={{margin: 0}} href="/">yanzhi.top</a>保留所有权利. ©2017 沪公网备沪ICP备 14004559号-4</p>
        </div>
    </div>
);

export default Footer
