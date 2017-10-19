import Dongtai from '../Common/Sub_ReMen_Dyna'
import Loading from '../../containers/loading'
import {Pagination, Tabs} from 'antd'
import * as React from 'react'

const TabPane = Tabs.TabPane
/*个人主页 内动态才艺展示*/
const ZhuYe_Dongtai = (props) => {
    // console.log(props.list, props.data5)
    return props.list && props.data5 ? (

        <div className="dongtai">
            {/*<p><span className="active">动态</span><span>才艺</span></p>*/}
            <Tabs defaultActiveKey='1'>
                <TabPane tab="动态" key="1">
                    <Dongtai hidden="hidden" datas={props.list.list} end={true}/>
                    {props.list.list ? null : <Loading/>}
                    {props.list.total > 10 ? <div className="pagination">
                        <Pagination
                            total={props.list.total}
                            size={'large'}
                            current={props.list.pageNo || 1}
                            onChange={(page) => {
                                props.changePage('动态', page);

                            }}
                            itemRender={(page, type: 'page' | 'prev' | 'next') => (
                                <span style={{padding: '0 3px'}}>
                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : null))}
						</span>)}/>
                    </div> : null}
                </TabPane>
                <TabPane tab="才艺" key="2">
                    <Dongtai hidden="hidden" datas={props.data5.list} end={true}/>
                    {props.data5.list ? null : <Loading/>}
                    {props.data5.total > 10 ? <div className="pagination">
                        <Pagination
                            total={props.data5.total}
                            size={'large'}
                            current={props.data5.pageNo || 1}
                            onChange={(page) => {
                                props.changePage('才艺', page);
                                $("html, body").animate({
                            					scrollTop: 0 }, {duration: 100,easing: "swing"});
                            }}
                            itemRender={(page, type: 'page' | 'prev' | 'next') => (
                                <span style={{padding: '0 3px'}}>
                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : null))}
						</span>)}/>
                    </div> : null}
                </TabPane>
            </Tabs>
        </div>
    ) : null
}

export default ZhuYe_Dongtai
