import React from 'react'
import {browserHistory, Link} from 'react-router'
import {Input, Select, Upload} from 'antd'

import cities from '../../assets/js/cities'
import * as PureRenderMixin from 'react-addons-pure-render-mixin'
import AllRead from '../Common/AllRead'
import {setCookie} from '../../actions/index.js'
import TanKuang from '../Common/TanKuang'
import {connect} from 'react-redux'
// import message from 'antd/es/message/index'

const Option = Select.Option
const {TextArea} = Input

const base64 = require('base-64')
const utf8 = require('utf8')

/*个人主页 内个人资料*/
class ZhuYe_Ziliao extends React.Component {
    onSubmit = () => {
        let data = {}, state = this.state
        this.setState({imageUrl: ''})
        this.numberId = AllRead.getCookie('NUMBERID')
        /*for(let i=0;i<arr.length;i++){
            data[]
        }*/
        this.arr3.map((item) => {
            data[item] = state[item]
        })
        // console.log(JSON.stringify(data), data,)
        let ori_data = {
            data: Object.assign(data, {
                numberID: this.numberId,
                phone: this.props.data2.userbase ? this.props.data2.userbase.userMobile : undefined
            }),
            explain: {
                appToken: AllRead.getCookie('TOKEN'),
                // busType:"notice/v1/getNoticeList",
                // interfaceVersion:'v1',
                numberID: this.numberId || undefined,
            }
        }
        let jsons = JSON.stringify(ori_data)
        // console.log(ori_data, jsons)
        let bytes = utf8.encode(jsons)
        let base64_data = base64.encode(bytes)
        const personalMessage = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + base64_data,
        }
        // console.log(jsons, bytes, base64_data, personalMessage)
        fetch('http://192.168.1.129:92/user/v1/userInformation.do', personalMessage)
            .then(res => res.json())
            .then(json => {
                this.setState({message: json}, () => {
                    if (json.code === 'true') {
                        this.setState({flags: '成功'}, () => {
                            this.props.dispatch(setCookie('HEADPATH', encodeURI(this.state.headPath), 2))
                            this.props.dispatch(setCookie('NICKNAME', encodeURI(this.state.nickName), 2))
                            browserHistory.push({
                                pathname: '/zhuye/ziliao',
                                query: {edit: false, id: this.props.location.query.id}
                            })
                            this.props.update()
                        })

                        // location.reload()
                    } else {
                        this.setState({flags: '失败'})
                    }
                })
            }).catch(e => {
            console.log(e.message)
            this.setState({flags: '失败'})
        })
    }
    cancel = () => {
        this.setState({flags: undefined})
        // console.log(e)
        // message.error('取消')

    }
    setData = (props) => {
        this.datas = props.data2 || {}
        this.data1 = this.datas.userbase || {}
        this.data2 = this.datas.userInfo || {}
        this.data3 = this.datas.topicList || []
        // console.log(this.data1, props.data)
        let data = props.data || {}
        let arr2 = [
            <img width="80" src={this.data1.headPath || data.headPath || '/src/assets/images/filterBg.png'}/>,
            `${this.data1.nickName || data.nickName}`,
            `${this.data2.school || '未知'}`,
            `${this.data2.professional || '未知'}`,
            `${this.data1.signature || data.signature || 'TA没有留下简介'}`,
            `${this.data2.city || data.city ?
                (this.data2.province || '') + ' ' + (this.data2.city || data.city) + ' ' + (this.data2.area || '' )
                : '未知'}`,
            `${this.data2.interest || '未知'}`,
            `${this.data3.length >= 1 ? this.data3.map(item => item) : '暂无'}`,
            `${this.data1.sex || data.sex || '未知'}`,
            `${this.data1.birthday || '未知'}`,
            `${this.data1.age || '未知'}`,
            `${this.xingzuo[this.data2.constellation] || '未知'}`,
            `${this.data2.height ? this.data2.height + 'cm' : '未知'}`,
            `${this.data2.weight ? this.data2.weight + 'kg' : '未知'}`,
            `${this.data2.bust ? this.data2.bust + '、' + this.data2.waistline + '、' + this.data2.hipline : '未知'}`,
            `${this.quanxian[this.data2.jurisdiction] || '未设置'}`]
        this.setState({
            arr2,
            headPath: this.data1.headPath || data.headPath,
            nickName: this.data1.nickName || data.nickName,
            school: this.data2.school,
            professional: this.data2.professional,
            signature: this.data1.signature || data.signature,
            province: this.data2.province,
            city: this.data2.city || data.city,
            interest: this.data2.interest,
            sex: this.data1.sex || data.sex || '未知',
            birthday: this.data1.birthday || '未知',
            age: this.data1.age || '未知',
            constellation: this.data2.constellation,
            height: this.data2.height,
            weight: this.data2.weight,
            bust: this.data2.bust,
            waistline: this.data2.waistline,
            hipline: this.data2.hipline,
            jurisdiction: this.data2.jurisdiction || 'All'
        })
        cities.map((item, i) => {
            item.province === this.data2.province ? this.setState({key: i}) : null
        })
    }
    /*beforeUpload = (file) => {
        const isImg = file.type.indexOf('image/') !== -1
        if (!isImg) {
            message.error('上传图片文件!')
        }
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('不大于 2MB!')
        }
        return isImg && isLt2M
    }*/
    getBase64 = (img, callback) => {
        const reader = new FileReader()
        reader.addEventListener('load', () => callback(reader.result))
        reader.readAsDataURL(img)
    }
    handleChange = (info) => {
        // console.log(info.file.response ? info.file.response[0].url : info)
        // console.log(info, 'change')
        if (info.file.status === 'done') {
            info.file.response ? this.setState({headPath: info.file.response[0].url}) : null
            // Get this url from response in real world.
            this.getBase64(info.file.originFileObj, imageUrl => this.setState({imageUrl}))
        }
    }

    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        // console.log(props)
        // this.setData(props)
        this.arr = ['头像', '昵称', '学校', '职业', '简介', '地区', '兴趣爱好', '最近话题', '性别', '生日', '年龄', '星座', '身高', '体重', '三围', '谁可以看']
        this.arr3 = ['headPath', 'nickName', 'school', 'professional', 'signature', 'province', 'city', 'interest', 'constellation', 'height', 'weight', 'bust', 'waistline', 'hipline', 'jurisdiction', 'birthday', 'age', 'sex']
        this.quanxian = {All: '所有人', OneUser: '仅会员', Private: '私密'}
        this.xingzuo = {
            ARIES: '白羊座',
            TAURINE: '金牛座',
            GEMINI: '双子座',
            CANCER: '巨蟹座',
            LEO: '狮子座',
            VIRGO: '处女座',
            LIBRA: '天秤座',
            SCORPIO: '天蝎座',
            SAGITTARIUS: '射手座',
            CAPRICORN: '摩羯座',
            AQUARIUS: '水瓶座',
            PISCES: '双鱼座'
        }
        this.state = {arr2: [], message: {}}
        this.countArr = []
        for (let i = 1; i <= 100; i++) {
            this.countArr.unshift(i)
        }
    }

    componentWillMount() {
        this.setData(this.props)
        this.AUTHENSTATUS = AllRead.getCookie('AUTHENSTATUS')
    }

    componentWillReceiveProps(nextProps) {
        // console.log(nextProps)
        this.setData(nextProps)

    }

    /*componentDidMount() {
        window.onbeforeunload = this.props.location.query.edit ? () => {
            //这里内容不会显示在提示框，为了增加语义化。
            return '您编辑的信息将会丢失'
        } : null
    }

    componentWillUnmount() {
        window.onbeforeunload = null
    }*/

    render() {
        console.log(this.state.headPath, 'render')
        /*const uploadButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        )*/
        // let fileList = []
        // let arr2 = this.state.arr2
        const headPath = this.state.imageUrl || this.state.headPath
        let list = (index) => {
            switch (index) {
                case 0:
                    return <div>
                        <Upload
                            className="avatar-uploader"
                            name={'images'}
                            accept={'image/*'}
                            showUploadList={false}
                            withCredentials={true}
                            action="//192.168.1.129:92/file/multiImageUpload.mvc"
                            onChange={this.handleChange}
                        >
                            {
                                <span style={{position: 'relative', border: '1px dashed #ccc'}}>
                                    <img src={headPath || '/src/assets/images/editpic.png'}
                                         width={80} className="avatar"/>
                                    <img style={{
                                        background: '#ccc',
                                        height: 'auto',
                                        position: 'absolute',
                                        bottom: 1,
                                        right: 1,
                                    }}
                                         src={'/src/assets/images/edit.png'}
                                         className="edit"/>
                                </span>
                            }
                        </Upload>{/*<Icon type="plus" className="avatar-uploader-trigger"/>*/}
                    </div>
                case 1:
                    return <Input size="large" onChange={(value) => {
                        if (value.target.value === '') {
                            return null
                        } else {
                            this.setState({nickName: value.target.value})
                        }
                    }}
                                  defaultValue={this.state.nickName}
                                  style={{width: 200}}
                                  placeholder="请输入昵称,不能为空"/>
                case 2:
                    return <Input size="large" onChange={(value) => this.setState({school: value.target.value})}
                                  style={{width: 200}}
                                  defaultValue={this.state.school} placeholder="请输入学校名称"/>
                case 3:
                    return <Input size="large" onChange={(value) => this.setState({professional: value.target.value})}
                                  style={{width: 200}}
                                  defaultValue={this.state.professional} placeholder="请输入职业"/>
                case 4:
                    return <div>
                        <TextArea onChange={(value) => {
                            value.target.value.length > 128
                                ?
                                (() => {
                                    value.target.value = this.state.signature
                                    this.Span.innerHTML = '简介长度不可超过128'
                                })()

                                : this.setState({signature: value.target.value}, this.Span.innerHTML = '')
                        }}
                                  style={{width: 200}}
                                  defaultValue={this.state.signature === 'TA没有留下简介' ? null : this.state.signature}
                                  placeholder='请输入简介'
                            // ref={textA => this.textA = textA}
                                  autosize={{minRows: 3}}/>
                        <span style={{color: '#ff7b98', float: 'none'}} ref={span => this.Span = span}/>
                    </div>
                case 5:
                    return <div className="shuru">
                        <Select value={this.state.province || '地区'}
                                size="large"
                                style={{width: 92}} className={'sele'}
                                onSelect={(value) => this.setState({
                                    key: value,
                                    province: cities[value].province,
                                    city: cities[value].city[0]
                                })}>
                            {cities.map((item, i) =>
                                <Option key={i} value={'' + i}>{item.province}</Option>)}
                        </Select>
                        <Select onChange={(value) => this.setState({city: value})}
                                value={this.state.city || '城市'}
                                size="large"
                                style={{width: 92, marginLeft: 15}} className={'sele'}>
                            {cities[this.state.key || 0].city.map((item, i) =>
                                <Option key={i} value={'' + item}>{item}</Option>)}
                        </Select>
                    </div>
                case 6:
                    return <div>
                        <TextArea onChange={(value) => {
                            value.target.value.length > 128
                                ? (() => {
                                    value.target.value = this.state.interest
                                    this.Span2.innerHTML = '兴趣爱好长度不可超过128'
                                })()
                                : this.setState({interest: value.target.value}, this.Span2.innerHTML = '')
                        }}
                                  style={{width: 200}}
                                  size="large"
                                  defaultValue={this.state.interest}
                                  placeholder="介绍你的兴趣爱好"
                                  autosize={{minRows: 3}}/>
                        <span style={{color: '#ff7b98', float: 'none'}} ref={span => this.Span2 = span}/>
                    </div>
                case 8:
                    return this.AUTHENSTATUS === 'true' ? null :
                        <Select defaultValue={this.state.sex || '选择性别'}
                                style={{width: 92}}
                                size="large"
                                onSelect={(value) => {
                                    this.setState({sex: value})
                                }}>
                            <Option value={'女'}>女</Option>
                            <Option value={'男'}>男</Option>
                        </Select>
                case 9:
                    return this.AUTHENSTATUS === 'true' ? null :
                        <Input style={{width: 200}}
                               value={this.state.birthday === '未知' ? null : this.state.birthday}
                               onChange={(value) => {
                                   !isNaN(value.target.value) ?
                                       this.setState({birthday: value.target.value})
                                       : null
                               }}
                               placeholder="输入你的生日,如19990101" size="large"/>
                case 10:
                    return this.AUTHENSTATUS === 'true' ? null :
                        <Input style={{width: 200}}
                               value={this.state.age === '未知' ? null : this.state.age}
                               onChange={(value) => {
                                   !isNaN(value.target.value) ?
                                       this.setState({age: value.target.value})
                                       : null
                               }}
                               placeholder="输入你的年龄，根据生日计算" size="large"/>
                case 11:
                    return <Select onChange={(value) => this.setState({constellation: value})}
                                   size="large"
                                   defaultValue={this.state.constellation ? this.xingzuo[this.state.constellation] : '星座'}
                                   style={{width: 92}}
                                   onSelect={(value) => {
                                       this.setState({xz: value})
                                   }}>
                        {Object.keys(this.xingzuo).map((item, i) => <Option key={i}
                                                                            value={item}>{this.xingzuo[item]}</Option>)}

                    </Select>
                case 12:
                    return <span className="shuru"><Input
                        onChange={(value) => {
                            !isNaN(value.target.value) ?
                                this.setState({height: value.target.value})
                                : null
                        }}
                        value={this.state.height ? `${this.state.height}` : null} size="large"
                        placeholder="请输入身高"/>cm</span>
                case 13:
                    return <span className="shuru"><Input
                        onChange={(value) => {
                            !isNaN(value.target.value) ?
                                this.setState({weight: value.target.value})
                                : null
                        }}
                        value={this.state.weight ? `${this.state.weight}` : null} size="large"
                        placeholder="请输入体重"/>kg</span>
                case 14:
                    return <div><Select onChange={(value) => this.setState({bust: value})}
                                        defaultValue={`${this.state.bust || `胸围`}`}
                                        size="large"
                                        style={{width: 65}}>
                        {this.countArr.map((item, i) => <Option key={i} value={item + ''}>{item}</Option>)}
                    </Select><Select onChange={(value) => this.setState({waistline: value})}
                                     size="large"
                                     defaultValue={`${this.state.waistline || '腰围'}`}
                                     style={{width: 65}}>
                        {this.countArr.map((item, i) => <Option key={i} value={item + ''}>{item}</Option>)}
                    </Select><Select onChange={(value) => this.setState({hipline: value})}
                                     size="large"
                                     defaultValue={`${this.state.hipline || '臀围'}`}
                                     style={{width: 65}}>
                        {this.countArr.map((item, i) => <Option key={i} value={item + ''}>{item}</Option>)}
                    </Select></div>
                case 15:
                    return <Select onChange={(value) => this.setState({jurisdiction: value})}
                                   size="large"
                                   defaultValue={this.state.jurisdiction ? this.quanxian[this.state.jurisdiction] : '公开'}
                                   style={{width: 92}}>
                        {Object.keys(this.quanxian).map((item, i) => <Option key={i}
                                                                             value={item}>{this.quanxian[item]}</Option>)}
                    </Select>
                default:
                    return false
            }
        }
        return this.datas && this.state.nickName ? (
            <div className="content ziliao">
                <p className="title">个人资料 {this.props.self ?
                    this.props.location.query.edit === 'true' ?
                        <Link className="btn" onClick={this.onSubmit}>保存</Link> :
                        <Link to="/zhuye/ziliao"
                              query={{edit: true, id: this.props.location.query.id}}
                              onClick={() => this.setState({imageUrl: ''})}>编辑</Link> : ''}</p>
                <div>
                    <ul>
                        {this.arr.map((item, index) =>
                            (!this.props.self && index === this.arr.length - 1) ? null : <li key={index}>
                                <span className="left">{item}</span>
                                <span className="right">
                                {this.props.self && this.props.location.query.edit === 'true' && list(index) ?
                                    list(index) :
                                    this.state.arr2[index]
                                }
                            </span>

                            </li>)}
                        {this.props.self || !this.datas.voteStates ? '' :
                            <li><span className="left"><Link
                                style={{color: '#ff7b98', fontSize: '14px', marginRight: '-50px'}}
                                to="/piaoxuan/toupiao"
                                query={{id: this.props.location.query.id}}
                                state={{voted: null}}>TA的票选>></Link></span>
                            </li>}
                    </ul>
                </div>
                <TanKuang flags={this.state.flags} message={this.state.message}
                          cancel={this.cancel}/>

            </div>
        ) : null
    }
}

function mapStateToProps(state) {
    return {}
}

//映射Redux actions到组件的属性
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

//连接组件
ZhuYe_Ziliao = connect(mapStateToProps, mapDispatchToProps)(ZhuYe_Ziliao)
export default ZhuYe_Ziliao