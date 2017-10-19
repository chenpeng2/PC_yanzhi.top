import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Module_Text from '../../HuaTi/module_text'
import {Pagination} from 'antd'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from '../../Common/AllRead'
export default class HuaTi extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					getTopics:[],
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
	 var data={context:data,type:3,pageNo:pageNo,perPage:perPage};
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
			this.setState({getTopics:json.data.topicList,total_get:json.data.total,totalNum:json.data.topicList.length,end:true})
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
			<div class="search_huati">
					<div class="huati">
            <div class='tit'>找到相关话题共 <span>{this.state.totalNum}</span> 个</div>
            <div class="huati_container" style={{marginTop:'16px'}}>{this.state.getTopics.map((item,index)=>(
              <div key={index} className={index==this.props.datas.length-1?'last':''}><Module_Text keys={index} datas={item} indexs={index}/></div>
            ))}</div>
						{this.state.getTopics.length==0&&!this.state.end?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>:""}
						{this.state.getTopics.length==0&&this.state.end?<div class="nodata_div"><img class="smallPic" src="/src/assets/images/nodata/nodata.jpg"/></div>:""}
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
				:''
				}
			</div>
		);
	};
}
