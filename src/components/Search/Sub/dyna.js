import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router';
import {Pagination} from 'antd'
import ReMen_Dyna from '../../Common/Sub_ReMen_Dyna'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../Common/AllRead'
export default class Dyna extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getDynas:[],
					pageNo_get:1,
					total_get:0,
					perPage_get:10,
					totalNum:'',
					end:false
				}
  };
	componentWillMount(){
		this.getAllDatas(this.props.searchData.search,1,10,AllRead.getCookie('NUMBERID'))
	};
	getAllDatas(data,pageNo,perPage,numberId){
	 var data={context:data,type:2,pageNo:pageNo,perPage:perPage};
	 	if(numberId==''){
			var ori_data={
				data:data
			}
		}else{
			var ori_data={
				data:data,
				explain: {
								appToken:decodeURI(AllRead.getCookie('TOKEN')),
								// busType:"notice1/getNoticeList",
								// interfaceVersion:'v1',
								numberID: numberId || undefined,
						}
			}
		}
		var jsons=JSON.stringify(ori_data)
		var bytes = utf8.encode(jsons);
		var base64_data=base64.encode(bytes)
	 const personalMessage = {
					method: "post",
					headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
					},
					body:"data="+base64_data,
	 };
	 fetch("http://192.168.1.129:92/beauty/v1/getSearchAll.do", personalMessage)
	.then(response => response.json()).then(json => {
		if(json.message=='参数不能为空'){
			this.setState({allNodatas:true})
		}else{
			this.setState({getDynas:json.data.dynamicList,total_get:json.data.total,totalNum:json.data.total,end:true})
		}
	});
	}
	PagenationSearch_get(page){
		this.getAllDatas(this.props.searchData.search,page,10,AllRead.getCookie('NUMBERID'))
		this.setState({pageNo_get:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
	render() {
		return (
			<div class="search_dyna">
        <div class="dynas">
            <div class='tit'>找到相关动态共 <span>{this.state.totalNum}</span> 个</div>
            <ReMen_Dyna logined="yes" datas={this.state.getDynas} end={this.state.end}/>
        </div>
				{this.state.total_get>this.state.perPage_get
				?
				<div class="pagination pagi_video">
					<Pagination total={this.state.total_get} defaultPageSize={this.state.perPage_get}
						current={this.state.pageNo_get}
						onChange={(page) => this.PagenationSearch_get(page)}
                          itemRender={(page, type: ['page','prev','next']) => (
                              <span style={{padding:'0 3px'}}>
                                  {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
                                  </span>)}/>
</div>
				:""
				}
      </div>
		);
	};
}
