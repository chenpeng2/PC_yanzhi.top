import React from 'react'
import {Button, Icon, Modal, Pagination, Select, Upload} from 'antd'

const Option = Select.Option

/*个人主页 内相册*/
class ZhuYe_Xiangce extends React.Component {
    Search = () => {
        console.log(this.state.year, this.state.month)
        this.props.find(this.state.year, this.state.month)
    }
    nodeList = () => {
        let node = [], keys = Object.keys(this.props.data4.photoList)

        for (let key2 in this.props.data4.photoList) {
            // console.log(key2)
            // console.log(keys, key2)
            node.push(
                <div key={key2}>
                    <p className="title_x">{`${key2}`}</p>
                    <ul>
                        {this.props.self && !this.state.changeDate && keys[0] === key2 ?
                            <li onClick={this.Show}>
                                <span className="up"><img src="/src/assets/images/upload_img.png"/>上传照片</span>
                            </li> : null}
                        {this.props.data4.photoList[key2].map((item, index) =>
                            <li key={index}>
                                {/*<span>{`${new Date(item.createTime)}`}</span>*/}{/* href={item.url}*/}

                                <a className="left"
                                   onClick={() => this.props.show(item.url + '!gaoyanzhiDB', item.id)}
                                   target={'_blank'} title={'查看大图'}>
                                    <img src={item.url + '!gaoyanzhiDB'}/>
                                </a>
                            </li>)}
                    </ul>
                </div>)

        }
        // console.log(node)
        return node
    }
    Show = () => {
        this.setState({visible: true})

    }
    Cancel = () => {
        this.setState({visible: false})
    }
    Clear = () => {
        this.setState({fileList: []}, this.Cancel)
    }
    beforeUpload = (file) => {
        /*const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('不大于 2MB!')
        }
        return isLt2M*/
    }
    /* handleChange = (info, fileList) => {
         // console.log(info.file.response ? info.file.response[0].url : info)
         // console.log(info, 'change')
         this.setState({fileList})
         if (info.file.status === 'done') {
             info.file.response ? this.setState({headPath: info.file.response[0].url}) : null
             // Get this url from response in real world.
             this.getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}))
         }
     }*/
    handleChange = ({fileList}) => {
        if (fileList.length > 9) {
            return
        }
        this.setState({fileList})
    }
    /*getBase64 = (img, callback) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }*/
    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        })
    }
    Upload = () => {

        let {fileList, role} = this.state, urls, albumId = this.props.data4.albumId
        fileList.map((item, index) => {
            urls = (index > 0 ? urls + '&' : '') + item.response[0].url
        })
        urls ? this.props.upPic(urls, role, albumId) : null
        console.log(fileList, role, urls, albumId)
    }

    constructor(props) {
        super(props)
        this.arr1 = []
        this.year = (new Date()).getFullYear()
        this.month = (new Date()).getMonth() + 1
        this.arr2 = []
        this.state = {
            year: this.year,
            month: this.month,
            changeDate: false,
            total: 9,
            now: 0,
            fileList: [],
        }
        for (let i = 1900; i <= this.year; i++) {
            this.arr1.push(i)
        }
        for (let i = 1; i <= 12; i++) {
            this.arr2.push(i)
        }
    }

    componentWillReceiveProps(nextProps) {
        // if (!nextProps.location.state.changeDate) {
        // this.setState({changeDate: nextProps.location.state.changeDate})
        // console.log(nextProps)
        // }
        nextProps.clean ? this.Clear() : null
    }

    render() {
        const {previewVisible, previewImage, fileList} = this.state
        const uploadButton = (
            <div>
                <Icon type="plus"/>
            </div>
        )
        const props = this.props, state = this.state
        let date = state.changeDate
            ? {date: state.year + (state.month < 10 ? '0' + state.month : state.month + '')}
            : undefined
        // console.log(props, state)
        return (
            <div className="xiangce">
                <div className="content">
                    <div className="title">查找照片：
                        <Select value={`${state.year}`} size={'large'}
                                style={{width: 95}} onSelect={(value) => {
                            this.setState({year: value, changeDate: true})
                            console.log(value)
                        }}>
                            {this.arr1.map((item, i) => <Option key={i} value={'' + item}>{item}</Option>)}
                        </Select>
                        <Select value={`${state.month}`} size={'large'}
                                style={{width: 95}} onSelect={(value) => {
                            this.setState({month: value, changeDate: true})
                            console.log(value)
                        }}>
                            {this.arr2.map((item, i) => <Option key={i} value={'' + item}>{item}</Option>)}
                        </Select>
                        <a onClick={() => this.setState({
                            year: state.year,
                            month: state.month,
                            changeDate: true
                        }, this.Search)}>查找</a></div>
                    {/*{`${{...props.data4}}`}*/}
                    {props.data4 && props.data4.photoList
                        ? this.nodeList()
                        : (this.props.self && !this.state.changeDate
                            ?
                            <div>
                                <p className="title_x">{`${this.year + '年' + this.month + '月'}`}</p>
                                <ul>
                                    <li onClick={this.Show}>
                                        <span className="up">
                                            <img src="/src/assets/images/upload_img.png"/>上传照片</span>
                                    </li>
                                </ul>
                            </div>
                            : <div class="nodata_div"><img src="/src/assets/images/nodata/nodata.jpg"/></div>)
                    }
                </div>
                {props.data4 && ((props.self && props.data4.total > 14) || props.data4.total > 15) ?
                    <div className="pagination">
                        <Pagination total={props.data4.total || 100} pageSize={props.data4.perPage || 10}
                                    current={props.data4.pageNo || 1}
                                    onChange={(page, pageSize) => {
                                        this.setState({page, pageSize});
                                        props.changePage('相册', page, date);
                                        $("html, body").animate({
                                    					scrollTop: 0 }, {duration: 100,easing: "swing"});
                                    }}
                                    itemRender={(page, type: 'page' | 'prev' | 'next') => (
                                        <span style={{padding: '0 5px'}}>
                            {type === 'page' ? page : (type === 'prev' ? '上一页' : (type === 'next' ? '下一页' : '···'))}
						</span>)}/>
                    </div> : null}
                <Modal visible={this.state.visible} width={782} wrapClassName={'upImg'}
                       footer={[<div className={'role'} key={'role'}>
                           <div>谁可以看：</div>
                           <div>
                               <Select defaultValue="PUBLIC" style={{width: 160, border: 0}} className={'sel'}
                                       onChange={(value) => this.setState({role: value})}>
                                   <Option value="PUBLIC">公开{<span className={'info'}>{`(所有人可见)`}</span>}</Option>
                                   <Option value="REWARD">仅打赏我的用户可见</Option>
                                   <Option value="SELF">私密{<span className={'info'}>{`(仅自己可见)`}</span>}</Option>
                               </Select>
                           </div>
                       </div>, <Button key="back" size="large" onClick={this.Clear}>清空并退出</Button>,
                           <Button key="submit" type="primary" size="large"
                                   onClick={() => this.setState({role: this.state.role || 'PUBLIC'}, this.Upload)}>
                               上传
                           </Button>]}
                       onCancel={this.Cancel}
                >
                    <p>
                        本地照片<span>（共{this.state.now || fileList.length}张，还能上传{9 - fileList.length}张）</span>
                    </p>
                    <Upload
                        className="pic_up"
                        name={'images'}
                        accept={'image/*'}
                        fileList={fileList}
                        multiple={true}
                        listType="picture-card"
                        showUploadList={true}
                        withCredentials
                        action="//192.168.1.129:92/file/multiImageUpload.mvc"
                        beforeUpload={this.beforeUpload}
                        onPreview={this.handlePreview}
                        onChange={this.handleChange}
                    >
                        {fileList.length >= 9 ? null : uploadButton}
                    </Upload>
                    <Modal visible={previewVisible} footer={null} closable={false}
                           onCancel={() => this.setState({previewVisible: false})}>
                        <img alt="example" style={{width: '100%'}} src={previewImage}/>
                    </Modal>

                </Modal>
            </div>
        )
    }
}

export default ZhuYe_Xiangce
