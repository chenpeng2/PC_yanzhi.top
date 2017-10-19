import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin'
import { Select,Upload, Icon, Modal,message,notification} from 'antd';
const Option = Select.Option;
import AllRead from '../../Common/AllRead'
var base64 =require('base-64')
var utf8 = require('utf8');
import TanKuang from '../../Common/TanKuang'
export default class Uploader extends React.Component {
	constructor(props, context) {
        super(props, context);
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
      showPicFabu:false,
      fabu_content:'',
      imageUrls:'',
      seeAuthority:0,
      type:0,
      videoThumb:'',
      dynamicSkill:false,
      showVidFabu:false,
			classPic:'',
			classVid:'',
			visible_Vid: false,
			visible_Pic:false,
			fileListLength:0,
			message:{},
			sign:''
    };
  handleCancel = () => this.setState({ previewVisible: false })

 handlePreview = (file) => {
   this.setState({
     previewImage: file.url || file.thumbUrl,
     previewVisible: true,
   });
 }
 handleRemove = (file) => {
	 this.state.fileList.forEach((value, index, array)=>{
		 value==file?this.changeImgs(value,index):''
	 })
 }
 changeImgs(value,index){
	 let imageUrls=this.state.imageUrls;
	 let deleteUrl=value.response[0].url;
	 let newImageUrls;
	 if(index==0){
		 newImageUrls=imageUrls.replace('deleteUrl','')
	 }else{
		 newImageUrls=imageUrls.replace('&'+deleteUrl,'')
	 }
	  this.setState({imageUrls:newImageUrls})
 }
  componentDidMount(){
		if(location.hash){
			this.textArea.value=location.hash;
		}
  }
  handleDynaType(value) {
    if(value=='公开(所有人可见)'){
      this.setState({seeAuthority:0})
    }else if(value=='仅打赏我的用户可见'){
      this.setState({seeAuthority:4})
    }else{
      this.setState({seeAuthority:2})
    }
  }
  clearFabu(){
    this.setState({
      fabu_content:'',
      imageUrls:'',
      seeAuthority:0,
      type:0,
      videoThumb:'',
      dynamicSkill:false,
    })
  }
  // beforeUpload = (file) => {
  //     const isImg = file.type.indexOf('image/') !== -1
  //     if (!isImg) {
  //         message.error('上传图片文件!')
  //     }
  //     const isLt2M = file.size / 1024 / 1024 < 2
  //     if (!isLt2M) {
  //         message.error('不大于 2MB!')
  //     }
  //     return isImg && isLt2M
  // }
	handlePic(info){
		this.setState({fileList:info.fileList});
		//将需要发布图片用&拼接
		let newSrc=info.file.response[0].url;
		let addNewSrc=this.state.imageUrls.length==0?this.state.imageUrls+newSrc:this.state.imageUrls+"&"+newSrc;
		this.setState({imageUrls:addNewSrc})
	}
	handleVid(info){
		let fileList=info.fileList;
		fileList = fileList.map((file) => {
			if (file.response) {
				// Component will show file.url as link
				file.thumbUrl = file.response[0].videoImageUrl;
			}
			return file;
		});
		this.setState({fileList:fileList})
		//将需要发布视频用&拼接
			let newSrc=info.file.response[0].videoUrl;
			let videoUrl=info.file.response[0].videoImageUrl;
			this.setState({imageUrls:newSrc,videoThumb:videoUrl})

	}
  handleChange = (info) => {
      //fileList就是发布动态需要传过去的图片链接
      if (info.file.status === 'done') {
          info.file.response&&info.file.response[0].state ? this.handlePic(info)
					:
					this.setState({sign: '失败', message: {message: '发布动态失败'}});
      }
  }
  handleChange2 = (info) => {
		this.setState({fileListLength:info.fileList.length})
    if (info.file.status === 'done') {
        info.file.response&&info.file.response[0].state ? this.handleVid(info)
				:
				this.setState({sign: '失败', message: {message: '发布动态失败'}});
    }
  }
	showModal_Vid = () => {
	    this.setState({
	      visible_Vid: true,
	    });
	  }
	  handleOk_Vid = (e) => {
	    this.setState({
	      visible_Vid: false,
	    });
			// 去掉所有的数据
			this.noshowVidFabu()
	  }
	  handleCancel_Vid = (e) => {
	    this.setState({
	      visible_Vid: false,
	    });
	  }
		showModal_Pic = () => {
		    this.setState({
		      visible_Pic: true,
		    });
		  }
		  handleOk_Pic = (e) => {
		    this.setState({
		      visible_Pic: false,
		    });
				// 去掉所有的图片数据
				this.noshowPicFabu()
		  }
		  handleCancel_Pic = (e) => {
		    this.setState({
		      visible_Pic: false,
		    });
		  }
  showPicFabu(){
		// this.noshowVidFabu();
		// 判断是否是需要放弃视频上传
		if(this.state.showVidFabu){
			this.showModal_Vid();
		}else{
			this.setState({showPicFabu:true,type:0})
		}

  }
  showVidFabu(){
		// this.noshowPicFabu();
		// 判断是否是需要放弃视频上传
		if(this.state.showPicFabu){
			this.showModal_Pic();
			// this.setState({showPicFabu:false,showVidFabu:true,type:1})
		}else{
			this.setState({showVidFabu:true,type:1})
		}

  }
  showFabu(){
    let type=this.state.type;
    if(type==0){
      this.fabu_post()
    }else{
      this.fabu_post()
    }
  }
  noshowPicFabu(){
    //关闭弹窗去掉选中的要发布的所有图片
    this.setState({showPicFabu:false,imageUrls:'',fileList:[]})
  }
  noshowVidFabu(){
    //关闭弹窗去掉选中的要发布的所有视频
    this.setState({showVidFabu:false,imageUrls:'',fileList:[],fileListLength:0})
  }
  textChange(event) {
			 this.setState({fabu_content:event.target.value})
	 }
	 changeColor(){
		 $('.upload_area').addClass('upload_area_hover');
		 setTimeout(()=>{$('.upload_area').removeClass('upload_area_hover');},100)
	 }
	 fabu_next(data){
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
     const personalMessage = {
           method: "post",
           headers: {
               'Content-Type': 'application/x-www-form-urlencoded'
           },
           body:"data="+base64_data,
     };
     fetch("http://192.168.1.129:92/beauty/v2/createDynamic.do", personalMessage)
     .then(response => response.json()).then(json => {
       if(json.code=='SUCCESS'){
       // 初始化发布前状态
       this.clearFabu();
			 this.textArea.value='';
       window.location.href='/zhuye'
		 }else{
			 this.setState({sign: '失败', message: {message: '动态内容太长，发布失败'}});
		 }
     })
	 }
  fabu_post(){

		let type=this.state.type;
		let fabu_content=this.state.fabu_content;
		let morenPic=type==0&&!fabu_content?'分享图片':'';
		let morenVid=type==1&&!fabu_content?'分享视频':'';
		//处理话题
		// let topics=fabu_content.split('#').slice(1,fabu_content.split('#').length-1);
		let topics=[];
			function topicSun(){
				var box = fabu_content;
				for (var i = -1, arr = []; (i = box.indexOf("#", i + 1)) > -1;  arr.push(i));
				if(arr.length%2==0){
				}else{
					arr.pop();
				}
				for(var i=0; i<arr.length;i++){
					if(i%2==0){
						let topic=fabu_content.substring(arr[i],arr[i+1]+1);
						topics.push(topic)
					}else{

					}
				}
				return topics
			}

    var data={
      content:this.state.fabu_content||morenPic||morenVid,
      imageUrls:this.state.imageUrls,
      seeAuthority:this.state.seeAuthority,
      address:'',
      type:this.state.type,
      videoThumb:this.state.videoThumb,
      dynamicSkill:this.state.dynamicSkill,
      topic:topicSun()
    };
		fabu_content||data.imageUrls?this.fabu_next(data):this.changeColor()
  }
	cancel = () => {
			this.setState({sign: undefined})
	}
	render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
        <div>
            <Icon type="plus"/>
        </div>
    )
		const uploadButton2 = (
        <div class="video_upload">
            <Icon type="plus"/>
        </div>
    )
    const headPath = this.state.imageUrl
		return (
			<div class="clearfix fabu">
				<Modal
					maskClosable={false}
					width={250}
					style={{ top: 120 }}
					wrapClassName={'update'}
          title="是否放弃上传视频吗？"
          visible={this.state.visible_Vid}
          onOk={this.handleOk_Vid}
          onCancel={this.handleCancel_Vid}
        >
          <p></p>
        </Modal>
				<Modal
					maskClosable={false}
					width={250}
					style={{ top: 120 }}
					wrapClassName={'update'}
          title="是否放弃上传图片吗？"
          visible={this.state.visible_Pic}
          onOk={this.handleOk_Pic}
          onCancel={this.handleCancel_Pic}
        >
          <p></p>
        </Modal>
        <div class="title"><i class="icon-fabu"></i><span>发布动态</span></div>
				<textarea class="upload_area" onChange={this.textChange.bind(this)} placeholder="" ref={textArea=>this.textArea=textArea}></textarea>
				<div class="clearfix upload_types">
					<div class="float_left posZIndex" onClick={this.showPicFabu.bind(this)}><i class="icon-morentu"></i>图片</div>
          <div class="float_left">|</div>
					<div class="float_left posZIndex" onClick={this.showVidFabu.bind(this)}><i class="icon-video"></i>视频</div>
					<div class="float_right show_type"><a className={(this.state.fabu_content||this.state.imageUrls)?'fabu_post':'fabu_post nofabu_post'} href="javascript:;" title="发布我的动态" onClick={this.showFabu.bind(this)}>发布动态</a></div>
          <div class="float_right" style={{marginRight:'-20px'}}>
            <div class="float_left show_type">谁可以看：</div>
            <div class="float_left" style={{position:'relative',top:'-4px'}}>
              <Select defaultValue="公开(所有人可见)" style={{ width: 160 }} onChange={this.handleDynaType.bind(this)}>
                <Option value="公开(所有人可见)">公开(所有人可见)</Option>
                <Option value="仅我打赏的用户可见">仅打赏我的用户可见</Option>
                <Option value="秘密(仅自己可见)" >秘密(仅自己可见)</Option>
              </Select>
            </div>
          </div>
        </div>
        {this.state.showVidFabu?
          <div class="form_pics form_vid">
            <i class="arrow-up"></i>
            <em class="arrow-up arrW"></em>
            <i class="icon-close" onClick={this.noshowVidFabu.bind(this)}></i>
                  <div>
                    <p>本地上传</p>
                    <div className="clearfix">
                      <Upload
                          className="avatar-uploader"
                          name={'videos'}
                          accept={'video/*'}
                        	showUploadList={false}
                          withCredentials={true}
                          action="http://192.168.1.129:92/file/multiVideoUpload.mvc"
                          onChange={this.handleChange2}
                      >
                        {this.state.fileListLength >= 1 ? <div class="video_default"><img src={this.state.videoThumb} ref="upload_default" onError={()=>{
													var img=this.refs.upload_default;
													img.src="/src/assets/images/video_default.svg";
													img.onerror=false;
												}}/> </div>: uploadButton2}
                            </Upload>
                          </div>
                  </div>
          </div>
        :''
        }
        {this.state.showPicFabu?
          <div  className={this.state.classPic?'form_opacity form_pics':'form_pics'}>
            <i class="arrow-up"></i>
            <em class="arrow-up arrW"></em>
            <i class="icon-close" onClick={this.noshowPicFabu.bind(this)}></i>
                  <div>
                    <p>本地上传</p>
                    {fileList.length>0?<p>共{fileList.length}张，还能上传{9-fileList.length}张</p>:''}
                    <div className="clearfix">
                      <Upload
                          className="avatar-uploader"
                          name={'images'}
                          accept={'image/*'}
                          listType="picture-card"
                          withCredentials={true}
                          action="http://192.168.1.129:92/file/multiImageUpload.mvc"
                          onPreview={this.handlePreview}
													onRemove={this.handleRemove}
                          onChange={this.handleChange}
													multiple={true}
                      >
                          {fileList.length >= 9 ? null : uploadButton}

                            </Upload>
                            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                     <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                   </Modal>
                          </div>
                  </div>
          </div>
        :
        ""
        }
				{/* {this.state.showPicFabu?<div class="mask maskW" onClick={()=>this.setState({classPic:'yes'})}></div>:''}
        {this.state.showVidFabu?<div class="mask maskW" onClick={()=>this.setState({classVid:'yes'})}></div>:''} */}
				<TanKuang flags={this.state.sign} message={this.state.message}
									cancel={this.cancel}/>
			</div>
		);
	};
}
