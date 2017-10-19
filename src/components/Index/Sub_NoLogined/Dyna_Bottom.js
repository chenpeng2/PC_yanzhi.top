import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import {Link} from 'react-router'
import {getCookie,needLogin} from '../../../actions/index.js'
import AllRead from '../../Common/AllRead.js'
import {connect} from 'react-redux'
var base64 =require('base-64')
var utf8 = require('utf8');
import TanKuang from '../../Common/TanKuang'
import PilLun2 from '../../Common/Pin_Lun2'
 class Dyna_Bottom extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
				this.state={
					liwu_num:-1,
					liwu_maskShow:false,
					addlove:this.props.datas.praise,
					addsocang:this.props.datas.isCollect||this.props.datas.collect,
          addloveNum:this.props.datas.praiseNums,
          liwus:[],
          addliwus:this.props.datas.productCount,
          liwuPlayNum:-1,
          message:{},
					sign:'',
          dynamicId:'',
          cunpinglun_redux:0,
          pinlun_start:true
				}
  };
	componentWillMount (){
    this.setState({cunpinglun_redux:this.props.pinglun_redux})
	}
  sendLiwu(){
    var data={};
       var ori_data={
         data:data,
         explain: {
                 appToken:decodeURI(AllRead.getCookie('TOKEN')),
                 // busType:"notice1/getNoticeList",
                 // interfaceVersion:'v1',
                 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
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
    fetch("http://192.168.1.129:92/product/v1/getDiamond.action", personalMessage)
   .then(response => response.json()).then(json => {
      this.setState({liwus:json.data});
      localStorage.setItem('liwus',json.data)
   });

  }
	liwu_check(index,event){
		this.setState({liwu_num:index})
	}
	show_liwu(e){
    if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
    }else{
      this.sendLiwu();
      if(this.props.index==0){
				$('.liwu'+this.props.index)[0].style.top=40+'px'
			}else{
				$('.liwu'+this.props.index)[0].style.bottom=20+'px'
			}
			$('.liwu'+this.props.index).show();
			this.setState({liwu_maskShow:true})
    }
	}
	hide_liwu_buy(){
		$('.liwu').hide();this.setState({liwu_maskShow:false})
	}
	zan(){
      var data={zanId:this.props.datas.dynamicId};
  	     var ori_data={
  	       data:data,
  	       explain: {
  	               appToken:decodeURI(AllRead.getCookie('TOKEN')),
  	               // busType:"notice1/getNoticeList",
  	               // interfaceVersion:'v1',
  	               numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
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
  	  fetch("http://192.168.1.129:92/Zan/v1/saveZan.mvc", personalMessage)
  	 .then(response => response.json()).then(json => {
        if(json.code=='SUCCESS'){
          this.setState({addlove:true});
          this.setState({addloveNum:this.state.addloveNum+1});
          this.setState({sign: '成功', message: {message: '点赞成功'}});
          // message.success('点赞成功', 1);
        }else{
          this.setState({sign: '失败', message: {message: '点赞失败'}});
        }
  	 });
	}
  canclezan(){
      var data={delete:this.props.datas.dynamicId};
  	     var ori_data={
  	       data:data,
  	       explain: {
  	               appToken:decodeURI(AllRead.getCookie('TOKEN')),
  	               // busType:"notice1/getNoticeList",
  	               // interfaceVersion:'v1',
  	               numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
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
  	  fetch("http://192.168.1.129:92/Zan/v1/delDetails.mvc", personalMessage)
  	 .then(response => response.json()).then(json => {
       if(json.code=='SUCCESS'){
         this.setState({addlove:false});
         this.setState({addloveNum:this.state.addloveNum-1});
         this.setState({sign: '成功', message: {message: '取消点赞成功'}});
        //  message.success('取消点赞', 1);
      }else{
        this.setState({sign: '失败', message: {message: '取消点赞失败'}});
      }
  	 });
  }
	addLove(){
    if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
   }else{
     if(!this.state.addlove){
       this.zan()
     }else{
       this.canclezan()
     }
   }
	}
  cancleAddSoCang(){
    var data={typeId:this.props.datas.dynamicId,collectType:'Dynamic'};
       var ori_data={
         data:data,
         explain: {
                 appToken:decodeURI(AllRead.getCookie('TOKEN')),
                 // busType:"notice1/getNoticeList",
                 // interfaceVersion:'v1',
                 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
             }

       }
       console.log(ori_data)
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
    fetch("http://192.168.1.129:92/collect//v1/cancelCollect.mvc", personalMessage)
   .then(response => response.json()).then(json => {console.log(json)
     if(json.code=="C1000"){
       this.setState({sign: '成功', message: {message: '取消收藏成功'}});
        //  message.success('取消收藏成功', 1);
         this.setState({addsocang:!this.state.addsocang})
     }else{
       this.setState({sign: '失败', message: {message: '取消收藏失败'}});
     }

   });
  }
  AddSoCang(){
    var data={typeId:this.props.datas.dynamicId,collectType:'Dynamic'};
       var ori_data={
         data:data,
         explain: {
                 appToken:decodeURI(AllRead.getCookie('TOKEN')),
                 // busType:"notice1/getNoticeList",
                 // interfaceVersion:'v1',
                 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
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
    fetch("http://192.168.1.129:92/collect//v1/addCollect.mvc", personalMessage)
   .then(response => response.json()).then(json => {
     if(json.message='成功'){
       this.setState({sign: '成功', message: {message: '收藏成功'}});
       //  message.success('收藏成功', 1);
        this.setState({addsocang:!this.state.addsocang})
     }else{
        this.setState({sign: '失败', message: {message: '收藏失败'}});
     }
   });
  }
	addsocang(){
    if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
   }else{
     if(this.state.addsocang){
       //取消收藏
       this.cancleAddSoCang();
     }else{
       this.AddSoCang()
     }
   }
	}
  pinglun(){
    if(!AllRead.getCookie('NICKNAME')){
     this.props.dispatch(needLogin)
   }else{
    //  点击出现评论区
    let indexof=window.location.href.indexOf('remen/detail');
    if(indexof>-1){
      this.setState({
        pinlun_start:true
      })
    }else{
      this.setState({
        pinlun_start:!this.state.pinlun_start
      })
    }
   }
  }
  sendProduct(item,e){
    let num=this.state.liwu_num;
    let productType;
    switch(num)
    {
    case 0:
      productType='flower'
      break;
    case 1:
      productType='beer'
      break;
    case 2:
      productType='love'
    break;
    case 3:
      productType='mike'
      break;
    case 4:
      productType='lips'
    break;
    case 5:
      productType='ship'
      break;
    case 6:
      productType='car'
    break;
    default:
      productType='earth'
    }
    var data={receiveUserId:item.userId,productType:productType,count:1,dynamicId:item.dynamicId,diamondCount:(this.state.liwus)[productType]};
       var ori_data={
         data:data,
         explain: {
                 appToken:decodeURI(AllRead.getCookie('TOKEN')),
                 // busType:"notice1/getNoticeList",
                 // interfaceVersion:'v1',
                 numberID: decodeURI(AllRead.getCookie('NUMBERID')) || '',
             }

       }
       console.log(ori_data)
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
    fetch("http://192.168.1.129:92/product/v1/sendProduct.action", personalMessage)
   .then(response => response.json()).then(json => {
     if(json.code=="SUCCESS"){
      //  message.success('赠送成功', 1);
       this.hide_liwu_buy();
       this.setState({addliwus:this.state.addliwus+1});
       this.liwyPlay()
     }else if(json.data.code=="A1003"){
       this.setState({sign: '失败', message: {message: '钻石数不够，请充值！'}});
    }else if(json.data.code=="P1002"){
      this.setState({sign: '失败', message: {message: '不能给自己赠送礼物！'}});
    }else{
      this.setState({sign: '失败', message: {message: '赠送失败'}});
    }
   });
  }
  liwyPlay(){
    this.setState({liwuPlayNum:this.state.liwu_num})
    setTimeout(()=>this.setState({liwuPlayNum:-1})
    ,3000)
  }
  cancel = () => {
      this.setState({sign: undefined})
  }
  componentDidMount(){
      this.setState({dynamicId:this.props.datas.dynamicId});
  };

	render() {
		var liwu_img=['/src/assets/images/liwu/hua.png','/src/assets/images/liwu/beer.png','/src/assets/images/liwu/love.png'
	,'/src/assets/images/liwu/sing.png','/src/assets/images/liwu/mouth.png','/src/assets/images/liwu/beach.png',
'/src/assets/images/liwu/car.png','/src/assets/images/liwu/earth.png']
		return (
			<div style={{position:'relative'}}>
				<div class="bottom clearfix">
					<div class="float_left"  onClick={this.addsocang.bind(this)}><i className={this.state.addsocang?"icon-socang_hover":"icon-socang"} ></i><span className={this.state.addsocang?"socang_hover":""} style={{fontSize:'13px'}}>{this.state.addsocang?'已收藏':'收藏'}</span></div>
					{/*<div class="float_left" onClick={()=>this.props.show_pinlun()}><i class="icon-pinlun"></i><span>{this.props.datas.commentCount}</span></div>*/}
          <div class="float_left" onClick={this.pinglun.bind(this)}><i class="icon-pinlun"></i><span>{this.props.datas.commentCount+this.props.pinglun_redux-this.state.cunpinglun_redux}</span></div>
					<div className={"float_left"}  onClick={this.show_liwu.bind(this)}>
						<i class="icon-liwu"></i><span>{this.state.addliwus}</span>
					</div>
					<div class="float_left expecial" onClick={this.addLove.bind(this)}><i className={this.state.addlove?"icon-xihuan_hover":"icon-xihuan"}></i><span>{/*this.props.datas.praiseNums+  初始化时定义了相等为啥还要加这个*/}{this.state.addloveNum}</span></div>
				</div>
        {/* {this.props.canclebottom?
        ""
        :
        <div className="remen_detail" style={{clear:"both",width:"792px",marginTop:'0px',overflow:"hidden"}}>
          <PinLun width_text="605" width_line="700" dynamicId={this.state.dynamicId} backColo='yes'/>
      </div>
        } */}
				<div className={"liwu liwu"+this.props.index}>
					<div class="clearfix" style={{margin:'8px 0px 0px 10px'}}>
						{this.state.liwus.length!=0?liwu_img.map((item,index)=>(
							<div onClick={this.liwu_check.bind(this,index)} className={this.state.liwu_num==index?'current liwu_pre':'liwu_pre'} key={index} >
								<img src={item}/>
								<div class="cont">
									<span>
                    {index==0?this.state.liwus.flower:''}
                    {index==1?this.state.liwus.beer:''}
                    {index==2?this.state.liwus.love:''}
                    {index==3?this.state.liwus.mike:''}
                    {index==4?this.state.liwus.lips:''}
                    {index==5?this.state.liwus.ship:''}
                    {index==6?this.state.liwus.car:''}
                    {index==7?this.state.liwus.earth:''}
                  </span>
                  <img  src="/src/assets/images/liwu/diomand.svg"/>
								</div>
							</div>
						))
            :''
            }
					</div>
					<div class="purchase clearfix">
						<div class="float_left"><Link to={'/acoutMain/recharge'} target="_blank"><span>充值></span></Link><p>余额：{this.state.liwus&&this.state.liwus.accountList?this.state.liwus.accountList.Outcome:''}<img src="/src/assets/images/liwu/diomand.svg"/></p></div>
						<button class="float_right" onClick={this.sendProduct.bind(this,this.props.datas)}>赠送</button>
					</div>
				</div>
				<div className={this.state.liwu_maskShow?"mask":''} onClick={this.hide_liwu_buy.bind(this)}></div>
        <div class="liwuPlay">
          {this.state.liwuPlayNum<0?<img class="liwu_playpic" style={{width:'0px'}} src={'/src/assets/images/liwu_playpic/0.gif'}/>:<img class="liwu_playpic" src={'/src/assets/images/liwu_playpic/'+this.state.liwuPlayNum+'.gif'}/>}
        </div>
        <TanKuang flags={this.state.sign} message={this.state.message}
                  cancel={this.cancel}/>
                {this.props.datas.commentCount>0&&!this.state.pinlun_start
                ? <PilLun2 width_text="620" width_line="710"  dynamicId={this.props.datas.dynamicId}/>
                :''}

			</div>
		);
	};
}
function mapStateToProps(state) {
    return {
      pinglun_redux:state.counter.pinglun||0,
    }
}
//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch){
    return{
        dispatch
    }
}
//连接组件
Dyna_Bottom = connect(mapStateToProps, mapDispatchToProps)(Dyna_Bottom)
 export default Dyna_Bottom
