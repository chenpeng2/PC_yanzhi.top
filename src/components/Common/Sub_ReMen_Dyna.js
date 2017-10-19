import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Title  from '../Index/Sub_NoLogined/title'
import Dyna_Top from '../Index/Sub_NoLogined/Dyna_Top'
import Dyna_Bottom from '../Index/Sub_NoLogined/Dyna_Bottom'
import { Menu, Dropdown, Icon,Modal,Checkbox, Row, Col,message} from 'antd'
const confirm = Modal.confirm;
import {Link} from 'react-router'
var base64 =require('base-64')
var utf8 = require('utf8');
import AllRead from './AllRead.js'
import {getCookie,needLogin} from '../../actions/index.js'
import {connect} from 'react-redux'
  class Sub_ReMen_Dyna extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					images_view_src:'',
					images_view:[],
					images_src_index:0,
					pinlun_show:-1,
					jubao_arr:[],
					visible:false,
					jubao_index:'',
					logined:'',
          jubao_text:'',
          lastImgView:-1
				}
  };

componentWillMount(){

	this.setState({logined:AllRead.getCookie('NICKNAME')});
	// var NICKNAME=AllRead.getCookie('NICKNAME');
	var NUMBERID=AllRead.getCookie('NUMBERID');
	// var HEADPATH=AllRead.getCookie('HEADPATH');
	if(NUMBERID){
		this.setState({numberId:decodeURI(NUMBERID)});
	}
}
 showModal(idx){
   let jubao_text="举报"+this.props.datas[idx].nickName+"的动态";
 	this.setState({
 		visible: true,
		jubao_index:idx,
    jubao_text:jubao_text
 	});
  }
 hideModal(){
  this.setState({
 	 visible: false
  });
  //初始化举报的选项
  //  去掉所有的checkbox选中状态
 $('.jubao .ant-row .ant-col-8').find('input[type="checkbox"]').each(function(){this.checked=false});
 $('.jubao .ant-row .ant-col-8').find('.ant-checkbox-checked').each(function(){$(this).removeClass('ant-checkbox-checked')});
 }
 showConfirm(indexs,_this) {
   confirm({
     title: '确认屏蔽?',
     content: '屏蔽用户后，动态列表不显示Ta的所有动态！',
     onOk() {
      _this.pingBi(indexs,1)
     },
     onCancel() {
      //  console.log('取消');
     },
   });
}

pingBi(indexs,type){
  //  在这写举报的接口
  var jubao_arr=this.state.jubao_arr
  var dynas=this.props.datas[indexs]
  console.log(this.props.datas)
  var data={shieldType:1,isShield:type,userId:dynas.userId};
     var ori_data={
       data:data,
       explain: {
               appToken:decodeURI(AllRead.getCookie('TOKEN')),
               // busType:"notice1/getNoticeList",
               // interfaceVersion:'v1',
               numberID: this.state.numberId || undefined,
           }

     }
     console.log(data)
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
  fetch("http://192.168.1.129:92/shield/v1/shield.do", personalMessage)
 .then(response => response.json()).then(json => {console.log(json)

 });

}
sendJubao(){
  //  在这写举报的接口
  if(this.state.jubao_arr.length==0){
    message.error('至少举报一项',1);
    return
  }
  var jubao_arr=this.state.jubao_arr
  var dynas=this.props.datas[this.state.jubao_index]
  var data={accusationType:0,accusationReason:jubao_arr[0],typeId:dynas.dynamicId};
     var ori_data={
       data:data,
       explain: {
               appToken:decodeURI(AllRead.getCookie('TOKEN')),
               // busType:"notice1/getNoticeList",
               // interfaceVersion:'v1',
               numberID: this.state.numberId || undefined,
           }

     }
     console.log(data)
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
  fetch("http://192.168.1.129:92/accusation/v1/accusation.do", personalMessage)
 .then(response => response.json()).then(json => {console.log(json)
   if(json.code=='SUCCESS'){this.jubaoSuccess()}
   else if(json.code=='FAILURE'){this.jubaoFail()}
   else{}
 });
  this.hideModal();
}
 handleMenuClick(indexs,e){
	 if(!this.state.logined){
		 this.props.dispatch(needLogin)
	 }
 	 else if(e.key=='item_0'){
 		 this.showModal(indexs)
 	 }
   else if(e.key=='item_1'){this.showConfirm(indexs,this);}
   else{}
 }
 jubaoSuccess(){
    message.success('举报成功', 2);
 }
 jubaoFail(){
    message.success('已举报', 2);
 }

arr_reduce(arr1,arr2){
	for (var i = arr1.length - 1; i >= 0; i--) {
	    var a = arr1[i];
	    for (var j = arr2.length - 1; j >= 0; j--) {
	        var b = arr2[j];
	        if (a == b) {
	            arr1.splice(i, 1);
	            break;
	        }
	    }
	}
// console.log(arr1);  // ["125","130","130","130","130"]
return arr1
}
onChange(checkedValues) {
		this.setState({jubao_arr:this.arr_reduce(checkedValues,this.state.jubao_arr)})
    console.log(this.state.jubao_arr)
 }
	show_pics_view(index,count,images,event){
		// 可以打印出单个很所有的img
		console.log(index,count,images);
    if(this.state.lastImgView>=0){
      $('.my_images'+this.state.lastImgView).show();
  		$('.data_pics'+this.state.lastImgView).hide();
    }
		// console.log(index,count,images)
        // if (e && e.preventDefault) {
            event.preventDefault()
            //IE中阻止函数器默认动作的方式
        // }
        // else {
        //     window.event.returnValue = false
        //     return false
        // }
		$('.my_images'+count).hide();
		$('.data_pics'+count).show();
		// 把传过来的images显示在images_view
		this.setState({images_view : images,images_view_src:images[index]});
    console.log(count)
		this.setState({images_src_index:index,lastImgView:count})
	}
	change_pic_view(index,images,event){
        event.preventDefault()
		this.setState({images_view_src : images[index]});
		this.setState({images_src_index:index})
	}
	hidden_pics_view(count,event){
        event.preventDefault()
		$('.data_pics'+count).hide();
		$('.my_images'+count).show();
	}

	prev_pic(images,event){
        event.preventDefault()
		var index=this.state.images_src_index-1;
		if(index<0){
			index=images.length-1
		}
		this.setState({images_view_src : images[index]});
		this.setState({images_src_index:index});
	}
	next_pic(images,event){
        event.preventDefault()
		var index=this.state.images_src_index+1
		if(index>images.length-1){
			index=0
		}
		this.setState({images_view_src : images[index]});
		this.setState({images_src_index:index})
	}
	render() {
		var imagedata = ['http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png',
		'http://cppics.b0.upaiyun.com/yanzhi_02/activity_default.png'];


    const {checkLogin} = this.props;
		return (
			<div class="remen_dyna">
					{this.props.logined||this.props.hidden?'':<Title icon="icon-remen_dyna" title="热门动态" hiddle={this.props.hiddenMore}/>}
					{/*热门动态*/}
						<div class="dynas">
                  {this.props.datas.length==0&&this.props.end?<div  className={this.props.nomargin?'nomargin nodata_div':'nodata_div'}><img class="smallPic"  src="/src/assets/images/nodata/nodata.jpg"/></div>:''}
									{this.props.datas.length==0&&!this.props.end?<div class="nodata_div" ><img class="nodata" style={{backgroundColor:'#fff'}} src="/src/assets/images/nodata/load.gif"/></div>
									:<div>
													{this.props.datas.map((item,indexs)=>(
													<div key={indexs}  class="clearfix">
															{this.props.logined&&indexs==3&&this.props.interesting
															?
															''
															:
															<div  class='float_left dynas_pre'>
																	<div class="txt">
																						<Dyna_Top hidden={this.props.hidden} datas={item}/>
																						{/*实在不行考虑pathname:'/remen/detail/参数'*/}
                                            <Link to={{pathname: '/remen/detail', query: {id: item.dynamicId,userId:item.userId}}}
                                                  target={window.location.href.indexOf('remen/dyna')>0?"_blank":"_self"}>
    																						<div>
                                                  {item.content&&item.content.indexOf("#")>-1?
                                                    <div class="text">
                                                        {/* <span style={{color:'#ff7b98'}}></span> */}
                                                        {item.content}
                                                    </div>
                                                    :
                                                    <div class="text">
                                                        {item.content?item.content:''}
                                                    </div>
                                                  }
    																						</div>

    																						<div className={'clearfix my_pics'+' my_images'+indexs} >
    																							{!item.imageUrls?''
    																							:item.type&&item.type==1
    																							?<div>
    																									<div class="collect_video">
    																										<Link to={'/videoMain/'+item.dynamicId} target="_blank">
    																											<img class="videoThumb" src={item.videoThumb?(item.videoThumb.indexOf('http')!==-1?item.videoThumb:'http://img.multshows.com'+item.videoThumb)+'!GDSIZE100':null}/>
    																											<img class="player" src='/src/assets/images/playred.svg'/>
    																										</Link>
    																									</div>
    																							</div>
    																							:item.imageUrls.split('&').map((item_c,index)=>(
    																								<div key={index} class="float_left my_pic_pre"  onClick={this.show_pics_view.bind(this,index,indexs,item.imageUrls.split('&'))}>
    																									<img src={item_c+'!gdsize100'}/>
    																								</div>
    																							))
    																							}
    																						</div>
    																						{item.imageUrls&&item.type==0
    																						?
    																						<div className={"data_pics"+' data_pics'+indexs}>
    																										<div  className={item.imageUrls.split('&').length==1?"view_box no_next":"view_box"}>
    																											<div class="left" onClick={this.prev_pic.bind(this,item.imageUrls.split('&'))}></div>
    																											<div class="right" onClick={this.next_pic.bind(this,item.imageUrls.split('&'))}></div>
    																											{this.state.images_view_src?<img src={this.state.images_view_src} onClick={this.hidden_pics_view.bind(this,indexs)}/>:<img style={{width:'30px',position:'absolute',top:'50%',left:'50%'}} onClick={this.hidden_pics_view.bind(this,indexs)} src="/src/assets/images/jiazai.svg"/>}
    																										</div>
    																										<div class="stage_box">
    																											<ul>
    																													{item.imageUrls.split('&').map((item_c,index)=>(
    																														<li key={index} className={item_c==this.state.images_view_src?'current':''} onClick={this.change_pic_view.bind(this,index,item.imageUrls.split('&'))}>
    																															<a href="javascript:void(0)"><img src={item_c+'!gdsize100'} /></a>
    																														</li>
    																													))}
    																											</ul>
    																										</div>
    																						</div>
    																						:
    																						''
    																						}
    																						<div class="operate float_right">
    																								{this.props.hidden?null:<Dropdown overlay={
    																									<Menu onClick={this.handleMenuClick.bind(this,indexs)}>
    																										<Menu.Item>
    																											<a rel="noopener noreferrer" href="javascript:void(0)">举报</a>
    																										</Menu.Item>
    																										<Menu.Item>
    																											<a  rel="noopener noreferrer" href="javascript:void(0)">屏蔽用户</a>
    																										</Menu.Item>
    																									</Menu>
    																								}>
    																										<i class="icon-gengduo" style={{padding:'10px',cursor:'pointer'}} ></i>
    																								</Dropdown>}
    																								<i class="icon-looked" style={{fontSize:'18px'}}></i>
    																								<span>{item.viewNums}</span>

    																						</div>
                                              </Link>
																	</div>
                                <Dyna_Bottom   index={indexs} datas={item} canclebottom={this.props.canclebottom}/>

															</div>
															}
													</div>
												))}
									</div>
									}
									<Modal class="jubao"
										title={this.state.jubao_text}
										visible={this.state.visible}
										onOk={this.sendJubao.bind(this)}
										onCancel={this.hideModal.bind(this)}
										okText="确认"
										cancelText="取消"
									>
									<Checkbox.Group onChange={this.onChange.bind(this)}>
											<Row>
												<Col span={8}><Checkbox value="0">垃圾营销</Checkbox></Col>
												<Col span={8}><Checkbox value="1">不实信息</Checkbox></Col>
												<Col span={8}><Checkbox value="2">淫秽色情</Checkbox></Col>
												<Col span={8}><Checkbox value="3">有害信息</Checkbox></Col>
												<Col span={8}><Checkbox value="4">违法信息</Checkbox></Col>
												<Col span={8}><Checkbox value="5">人身攻击我</Checkbox></Col>
												<Col span={8}><Checkbox value="6">侵权信息</Checkbox></Col>
											</Row>
									</Checkbox.Group>
									</Modal>
						</div>
			</div>
		);
	};
}
function mapStateToProps(state) {
    return { }
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Sub_ReMen_Dyna = connect(mapStateToProps, mapDispatchToProps)(Sub_ReMen_Dyna)
 export default Sub_ReMen_Dyna
