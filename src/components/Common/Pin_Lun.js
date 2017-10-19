import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import ReMenDetailMFirst from '../ReMen/ReMen_Detail_M_first'
import {Pagination} from 'antd'
import { Link } from 'react-router'
import AllRead from './AllRead.js'
import {needLogin,pinglun_redux} from '../../actions/index.js'
import {connect} from 'react-redux'
var base64 =require('base-64')
var utf8 = require('utf8');
import moment from 'moment'
import TanKuang from '../Common/TanKuang'
  class PinLun extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					checkType:'',
					pinlun_count:[],
					headPath:'',
					getNewPinglun:[],
					fabu_content:'',
					pinglun_fetch:false,
          totalNum:'',
          newEnd:false,
          pageNo_re:1,
					perPage_re:10,
          pageNo_new:1,
					perPage_new:10,
          postBg:'',
          postBg2:'',
          postNum:'',
          message:{},
					sign:''
				}
  };
	huati_content(key,event){
		if(key=="re"){
			this.setState({checkType:'',newEnd:false});
      this.getDetails(this.props.dynamicId,this.state.pageNo_re)
      //获取最热

		}else{
			this.setState({checkType:true,pinglun_fetch:false});
      this.getNewDetails(this.state.pageNo_new);
		}
	}
	textChange(event) {
			 this.setState({fabu_content:event.target.value,postBg:event.target.value})
	 }
   textChange2(num,value) {
 			this.setState({fabu_content:value});
      this.changeBgTwo(num,value)
 	 }
   changeBgTwo(num,value){
     this.setState({postBg2:value,postNum:num})
   }
   fabu_next(data,typeNum,nickName){
     var ori_data={
       data:data,
       explain: {
               appToken:decodeURI(AllRead.getCookie('TOKEN')),
               // busType:"notice1/getNoticeList",
               // interfaceVersion:'v1',
               numberID: decodeURI(AllRead.getCookie('NUMBERID'))||'',
           }
     }

     var jsons=JSON.stringify(ori_data)
      var bytes = utf8.encode(jsons);
      var base64_data=base64.encode(bytes);
     let time=moment(new Date().getTime()).format('YYYY'+'-'+'MM'+'-'+'DD'+' HH:mm');
     let fabu_conts={
       parentNickName:nickName,
       childrenList:[],
       commentCount:0,
       zanCount:0,
       nickName:decodeURI(AllRead.getCookie('NICKNAME')),
       content:this.state.fabu_content,
       headPath:decodeURI(AllRead.getCookie('HEADPATH')),
       createTime:time
     }
     const personalMessage = {
            method: "post",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body:"data="+base64_data,
     };
     fetch("http://192.168.1.129:92/beauty/v1/comment.do", personalMessage)
     .then(response => response.json()).then(json => {
      if(json.code=='SUCCESS'){
        this.setState({pinglun_fetch:true,newEnd:true})
        if(this.state.checkType){
            this.getNewPinglun(this.state.pageNo_new);
        }else{
          if(data.parentId==0){
            this.setState({totalNum:this.state.totalNum+1});
            //上面动态也要加
          }
          else{
            // if(typeNum==3){
            //
            // }else{
            //
            // }
          }
          this.getDetails(this.props.dynamicId,this.state.pageNo_re)
        }
        // 评论完清除文本
        this.props.dispatch(pinglun_redux);
        this.setState({fabu_content:''},()=>this.textArea.value='');

        $('.show_second_level  input').val('');
        $('.hide_pinlun_pre .second_level input').val('');
      }else if(json.code=='FAILURE'){
        //请求失败
        this.setState({sign: '失败', message: {message: '评论内容太长，评论失败'}});
      }
     });
   }
	fabu_post(parentId,typeNum,nickName){
		if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
	 }else{
		 var data={twitterId:this.props.dynamicId,parentId:parentId,content:this.state.fabu_content};
       this.state.fabu_content?this.fabu_next(data,typeNum,nickName):''
	 }
	}
	nologinGetNewPinglun(page){
		var data={twitterId:this.props.dynamicId,pageNo:page,perPage:10};
	     var ori_data={
	       data:data
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
	  fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 	this.setState({getNewPinglun:json.data.commentONeList,totalNum:json.data.total,newEnd:true})
	 });
	}
	getNewPinglun(page){
		var data={twitterId:this.props.dynamicId,pageNo:page,perPage:10};
	     var ori_data={
	       data:data,
	       explain: {
	               appToken:decodeURI(AllRead.getCookie('TOKEN')),
	               // busType:"notice1/getNoticeList",
	               // interfaceVersion:'v1',
	               numberID: decodeURI(AllRead.getCookie('NUMBERID'))||'',
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
	  fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
	 .then(response => response.json()).then(json => {
		 	this.setState({getNewPinglun:json.data.commentONeList,totalNum:json.data.total,newEnd:true})
	 });
	}
  noLogindynamicDetail(dynamicId,page){
    var data={twitterId:dynamicId,type:'hot',pageNo:page,perPage:10};
       var ori_data={
         data:data
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
    fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
   .then(response => response.json()).then(json => {
      this.setState({pinlun_count:json.data.commentONeList,totalNum:json.data.total,pinglun_fetch:true})
   });
  }
  dynamicDetail(dynamicId,page){
    var data={twitterId:dynamicId,type:'hot',pageNo:page,perPage:10};
       var ori_data={
         data:data,
         explain: {
                 appToken:decodeURI(AllRead.getCookie('TOKEN')),
                 // busType:"notice1/getNoticeList",
                 // interfaceVersion:'v1',
                 numberID: decodeURI(AllRead.getCookie('NUMBERID'))||'',
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
    fetch("http://192.168.1.129:92/beauty/v2/twitterDetail.do", personalMessage)
    .then(response => response.json()).then(json => {console.log(json)
     this.setState({pinlun_count:json.data.commentONeList,totalNum:json.data.total,pinglun_fetch:true})
   });
  }
  getDetails(data,page){
    if(AllRead.getCookie('NUMBERID')){
      this.dynamicDetail(data,page)
    }
    else{
      this.noLogindynamicDetail(data,page)
    }
  }
  getNewDetails(page){
    if(AllRead.getCookie('NUMBERID')){
      this.getNewPinglun(page)
    }
    else{
      this.nologinGetNewPinglun(page)
    }
  }
	componentWillMount(){

		var headpath=decodeURI(AllRead.getCookie('HEADPATH'));
		this.setState({headPath:headpath});
    // this.getDetails(this.props.dynamicId,1)
	}
	componentWillReceiveProps(nextprops){
        this.setState({checkType:nextprops.checkType});
        this.getDetails(nextprops.dynamicId,1)
	}
  PagenationSearch_re(page){
		this.getDetails(this.props.dynamicId,page);
		this.setState({pageNo_re:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
	}
  PagenationSearch_new(page){
    this.getNewDetails(page);
    this.setState({pageNo_new:page},()=>{$("html, body").animate({
					scrollTop: 0 }, {duration: 100,easing: "swing"})});
  };
  cancel = () => {
      this.setState({sign: undefined})
  }
	render() {
		return (
			<div class="pinlun">
				{/*这是单独的评论页*/}
					<h1 class="tit"><span>{this.state.newEnd||this.state.pinglun_fetch?(this.state.totalNum>0?this.state.totalNum:0):''}条</span><span>评论</span></h1>
					<div class="checkType clearfix">
						<div className={this.state.checkType?'':'current'} onClick={this.huati_content.bind(this,'re')}>最热</div>
						<div style={{padding:'0px 15px'}}>|</div>
						<div className={!this.state.checkType?'':'current'} onClick={this.huati_content.bind(this,'new')}>最新</div>
					</div>
					{this.state.checkType
					?
					<div class="contents">
						<div class="detail_post clearfix">
							<div class="avatar"><img src={this.state.headPath!='undefined'?this.state.headPath+'!GDSIZE':'/src/assets/images/filterBg.png'}/></div>
							<div class="textarea" style={{width:this.props.width_text+'px'}}>
							<textarea  style={{width:'100%',height:'100%',padding:'5px'}} onChange={this.textChange.bind(this)} placeholder="写下你的评论吧..." ref={textArea=>this.textArea=textArea}>

</textarea>
							</div>
							<div className={this.state.postBg?'bt_post':'bt_post nofabu_post'} onClick={this.fabu_post.bind(this,0,1,'')}>
								<a href="javascript:void(0)" >发布评论</a>
							</div>
							<div class="detail_line" style={{width:this.props.width_line+'px'}}></div>
						</div>
						{this.state.getNewPinglun.length==0&&!this.state.newEnd?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
						:
						''
						}
            {this.state.getNewPinglun.length!=0
              ?
              this.state.getNewPinglun.map((item,index)=>(
  							<div key={index} class="pinlun_count"><ReMenDetailMFirst  postNum={this.state.postNum} postBg2={this.state.postBg2}  textChange2={this.textChange2.bind(this)} fabu_content={this.fabu_post.bind(this,item.commentId,2,item.nickName)} fabu_content2={this.fabu_post.bind(this)} datas={item} width_line={this.props.width_line} /></div>
  						))
              :''
            }
            {this.state.totalNum>this.state.perPage_new
            ?
  					<div class="pagination remen_detail_pagination">
              <Pagination total={this.state.totalNum} defaultPageSize={this.state.perPage_new}
                current={this.state.pageNo_new}
                onChange={(page) => this.PagenationSearch_new(page)}
  																			itemRender={(page, type: ['page','prev','next']) => (
  																					<span style={{padding:'0 3px'}}>
  																							{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
  																							</span>)}/>
  					</div>
            :''}
						{this.state.getNewPinglun.length==0&&this.state.newEnd?<div class="nodata_div"><img  src="/src/assets/images/nodata/nodata.jpg"/></div>
						:''
						}
					</div>
					:
					<div class="contents">
						<div class="detail_post clearfix">
							<div class="avatar"><img src={this.state.headPath!='undefined'?this.state.headPath+'!GDSIZE':'/src/assets/images/filterBg.png'}/></div>
							<div class="textarea" style={{width:this.props.width_text+'px'}}>
									<textarea  style={{width:'100%',height:'100%',padding:'5px'}} onChange={this.textChange.bind(this)} placeholder="写下你的评论吧..." ref={textArea=>this.textArea=textArea}>

</textarea>
							</div>
							<div  className={this.state.postBg?'bt_post':'bt_post nofabu_post'} onClick={this.fabu_post.bind(this,0,1,'')}>
								<a href="javascript:void(0)">发布评论</a>
							</div>
							<div class="detail_line" style={{width:this.props.width_line+'px'}}></div>
						</div>
						{this.state.pinlun_count.length==0&&!this.state.pinglun_fetch?<div class="nodata_div"><img class="nodata" src="/src/assets/images/nodata/load.gif"/></div>
						:
						''
						}
            {this.state.pinlun_count.length!=0
              ?
              this.state.pinlun_count.map((item,index)=>(
  							<div key={index} class="pinlun_count"><ReMenDetailMFirst postNum={this.state.postNum}  postBg2={this.state.postBg2} textChange2={this.textChange2.bind(this)}  fabu_content={this.fabu_post.bind(this,item.commentId,2,item.nickName)} fabu_content2={this.fabu_post.bind(this)} datas={item} width_line={this.props.width_line} /></div>
  						))
              :''
            }
            {this.state.totalNum>this.state.perPage_new
            ?
  					<div class="pagination remen_detail_pagination">
              <Pagination total={this.state.totalNum} defaultPageSize={this.state.perPage_re}
                current={this.state.pageNo_re}
                onChange={(page) => this.PagenationSearch_re(page)}
  																			itemRender={(page, type: ['page','prev','next']) => (
  																					<span style={{padding:'0 3px'}}>
  																							{type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
  																							</span>)}/>
  					</div>
            :''}
						{this.state.pinlun_count.length==0&&this.state.pinglun_fetch?<div class="nodata_div"><img  src="/src/assets/images/nodata/nodata.jpg"/></div>
						:''
						}
					</div>
					}
          <TanKuang flags={this.state.sign} message={this.state.message}
                    cancel={this.cancel}/>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return {}
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
PinLun = connect(mapStateToProps, mapDispatchToProps)(PinLun)
 export default PinLun
