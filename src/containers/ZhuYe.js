import React from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin'
import Topper from './topper'
import Footer from './footer'

import ZhuYe_Left from '../components/ZhuYe/ZhuYe_Left'

import AllRead from '../components/Common/AllRead'
import {Button, Modal} from 'antd'
import {connect} from 'react-redux'
import {applyMember, needLogin} from '../actions/index'
import {browserHistory, Link} from 'react-router'
import TanKuang from '../components/Common/TanKuang'

const base64 = require('base-64')
const utf8 = require('utf8')

class ZhuYe extends React.Component {
    constructor(props, context) {
        super(props, context)
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this)
        this.state = {message: {}}
    };

    update = () => {
        this.componentWillMount()
    }

    componentWillReceiveProps(nextProps) {
        nextProps.location.state && nextProps.location.state.refresh
            ? this.xfetch('userId', this.otherId, 'photo/v1/getPhotoPage.mvc', (data) => {
                this.setState({data4: data})
            }, {perPage: this.self ? 14 : 15})
            : null

    }

    componentWillMount() {
        document.title = '个人主页'
        this.numberId = AllRead.getCookie('NUMBERID')
        let id = this.props.location.query.id || this.numberId || undefined
        if (!id) {
            browserHistory.push('/')
        }
        this.otherId = id
        this.self = id === this.numberId
        let data = {
            Id: id || undefined
        }
        let resolve3 = () => {
            data_a && data_b && data_c ? this.setState({
                data: data_a,
                list: data_b,
                data2: data_c,
                data3: data_d,
                data4: data_e,
                data5: data_f
            }) : null

        }
        let url1, url2, url3, url4, url5, url6, data_a, data_b, data_c, data_d, data_e, data_f, resolve = (data) => {
            data_a = data
            resolve3()
        }, resolve2 = (data) => {
            data_b = data
            resolve3()
        }, resolve4 = (data) => {
            data_c = data
            resolve3()
        }, resolve5 = (data) => {
            data_d = data
            resolve3()
        }, resolve6 = (data) => {
            data_e = data
            resolve3()
        }, resolve7 = (data) => {
            data_f = data
            resolve3()
        }
        url1 = this.numberId ? 'beauty/v2/getTaBasicInfo.do' : 'beauty/v2/getTaBasicInfoNoLogin.do'
        this.xfetch('taId', data.Id, url1, resolve)
        // console.log('did')
        url2 = 'beauty/v2/getTaOtherDynamic'
        this.xfetch('userId', data.Id, url2, resolve2)
        url3 = this.self ? 'user/v1/getMeUserInfo.do' : 'user/v1/otheruser.do'
        this.xfetch('userId', data.Id, url3, resolve4)
        url4 = 'photo/v1/getPhotoList.mvc'
        this.xfetch('userId', data.Id, url4, resolve5)
        url5 = 'photo/v1/getPhotoPage.mvc'
        this.xfetch('userId', data.Id, url5, resolve6, {perPage: this.self ? 14 : 15})
        url6 = 'beauty/v2/getDynamicSkill.do'
        this.xfetch('userId', data.Id, url6, resolve7)
    };

    xfetch(name, data, url, resolve, add) {
        let ori_data = {
            data: Object.assign({
                [name]: data || undefined
            }, add),
            explain: this.numberId ? {
                appToken: AllRead.getCookie('TOKEN'),
                numberID: this.numberId || undefined,
            } : undefined
        }
        let jsons = JSON.stringify(ori_data)
        // console.log(jsons)
        let bytes = utf8.encode(jsons)
        let base64_data = base64.encode(bytes)
        const personalMessage = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + base64_data,
        }
        // console.log(jsons, personalMessage)
        if (!data) {
            return
        }
        // console.log(ori_data, jsons)
        fetch('http://192.168.1.129:92/' + url, personalMessage)
            .then(res => res.json())
            .then((json) => {
                // console.log(resolve)
                resolve(json.data || json)

            }).catch(error => {

            }
        )
    }

    find = (year, month) => {
        let data = {date: year + (month < 10 ? '0' + month : month + ''), pageNo: 1, perPage: 18}
        // console.log(data)
        this.xfetch('userId', this.otherId, 'photo/v1/getPhotoPage.mvc', (data) => {
            this.setState({data4: data})
            /*console.log(data)*/
        }, data)
    }

    confirm = (url, name) => {
        if (!this.numberId) {
            // alert('登录')
            this.props.dispatch(needLogin)
            return
        }
        // message.success('确认')

        let ori_data = {
            data: {
                [name]: this.otherId || undefined,
                numberID: this.numberId || undefined,
            },
            explain: {
                appToken: AllRead.getCookie('TOKEN'),
                numberID: this.numberId || undefined,
            }
        }
        let jsons = JSON.stringify(ori_data)
        // console.log(jsons)
        let bytes = utf8.encode(jsons)
        let base64_data = base64.encode(bytes)
        const personalMessage = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'data=' + base64_data,
        }
        fetch('http://192.168.1.129:92/' + url, personalMessage)
            .then(res => res.json())
            .then(json => {
                if (json.message !== '删除成功') {
                    this.setState({message: json, flags: '成功'}, () => {
                        // console.log(this.state.flags)
                    })
                }
                this.update()
            }).catch(e => {
            this.setState({message: e.message, flags: '失败'})
        })

    }
    cancel = () => {
        this.setState({flags: undefined})
        // console.log(e)
        // message.error('取消')

    }
    handleCancel = () => this.setState({previewVisible: false})
    handleShow = (img, id) => {
        // this.previewImage = img
        this.setState({previewImage: img, id}, () => this.setState({previewVisible: true}))
    }
    changeFollow = () => {
        let url, name
        if (this.state.data && !this.state.data.isLike) {
            url = 'Fan/v1/saveFans.mvc'
            name = 'likeId'
        } else {
            url = 'Fan/v1/noLike.mvc'
            name = 'recieverId'
        }
        this.confirm(url, name)
    }
    popApply = () => {
        this.props.dispatch(applyMember)
    }
    changePage = (title, pageNo, date) => {
        let url2, url6, list, data5
        console.log(title, pageNo)
        this.setState({pageNo})
        if (title === '动态') {

            url2 = 'beauty/v2/getTaOtherDynamic'
            this.xfetch('userId', this.otherId, url2,
                (json) => {
                    list = json
                    this.setState({list})
                }
                , {pageNo})

        }
        else if (title === '才艺') {
            url6 = 'beauty/v2/getDynamicSkill.do'
            this.xfetch('userId', this.otherId, url6,
                (json) => {
                    data5 = json
                    this.setState({data5})
                }, {pageNo})
        } else if (title === '相册') {
            this.xfetch('userId', this.otherId, 'photo/v1/getPhotoPage.mvc', (data) => {
                /*console.log(data)*/
                this.setState({data4: data})
            }, {pageNo, ...date, ...{perPage: this.self && !date ? 14 : 15}})
        }
    }
    upPic = (urls, role, albumId) => {
        this.xfetch('urls', urls, 'photo/v1/uploadPhoto.mvc', (json) => {
            json.code === 'SUCCESS' ? this.setState({clean: true, message: {message: '上传成功'}, flags: '成功'}, () => {
                console.log(this.state)
                this.xfetch('userId', this.otherId, 'photo/v1/getPhotoPage.mvc', (data) => {
                    this.setState({data4: data})
                }, {perPage: this.self ? 14 : 15})
            }) : null
        }, {role, albumId})
    }
    dePic = (photoId) => {
        this.xfetch('photoId', photoId, 'photo/v1/deletePhoto.mvc', (json) => {
            json.code === 'SUCCESS' ? this.setState({clean: true, message: {message: '删除成功'}, flags: '成功'}, () => {
                console.log(this.state)
                this.handleCancel()
                this.xfetch('userId', this.otherId, 'photo/v1/getPhotoPage.mvc', (data) => {
                    this.setState({data4: data})
                }, {perPage: this.self ? 14 : 15, pageNo: this.state.pageNo})
            }) : null
        })
    }

    render() {
        console.log(this.state)
        let childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, {
            self: this.self,
            data: this.state.data,
            list: this.state.list,
            data2: this.state.data2,
            data3: this.state.data3,
            data4: this.state.data4,
            data5: this.state.data5,
            update: this.update,
            find: this.find,
            changePage: this.changePage,
            show: this.handleShow,
            upPic: this.upPic,
            clean: this.state.clean
        }))
        // console.log(this.state)
        return this.state.data ? (
            <div class="wrapper clearfix">
                <Topper shouye='active'/>
                <div className="containers clearfix">
                    <div className="w1050">
                        <div className="toubu clearfix"
                             style={this.state.data.type === 0 && this.state.data.backgroudPath
                                 ? {backgroundImage: `url(${this.state.data.backgroudPath})`}
                                 : {}}
                        >
                            <div className="tou">
                                <img
                                    onClick={() => this.handleShow(this.state.data.headPath || '/src/assets/images/filterBg.png')}
                                    src={this.state.data.headPath
                                        ? this.state.data.headPath + '!gdsize100'
                                        : '/src/assets/images/filterBg.png'}
                                    alt="头像"/>
                                <div>
                                    <p className="nicheng">
                                        <span>{this.state.data.nickName}</span>
                                        {this.state.data2 && this.state.data2.userbase.leaguer ?
                                            <img height={20} src={'/src/assets/images/黄钻.svg'}/> : null}</p>
                                    <p className="qianming">
                                        {this.state.data.signature === 'TA没有留下简介' && this.self ?
                                            <Link to={'/zhuye/ziliao'} query={{
                                                edit: true,
                                                id: this.numberId
                                            }}>编辑简介</Link> : <span>{this.state.data.signature}</span>}
                                        {this.self ? '' :
                                            ( this.state.data.isLike
                                                ?
                                                <a className="icon-guanzhued icon-guanzhu" onClick={this.changeFollow}>已关注</a>
                                                : <a className="icon-guanzhu" onClick={this.changeFollow}>关注</a>)
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="neirong clearfix">
                            <ZhuYe_Left  {...this.state}
                                         self={this.self}
                                         popApply={this.popApply}
                                         id={this.otherId}/>
                            <div className="middle_content">
                                {childrenWithProps}
                            </div>

                        </div>
                    </div>
                </div>
                {this.self ? '' : <TanKuang {...this.state}
                                            cancel={this.cancel}/>}
                <Modal visible={this.state.previewVisible}
                       wrapClassName={'showImg'}
                       footer={this.state.id && this.self ? <Button size={'large'}
                                                                    className={'del_b'}
                                                                    onClick={(id) => this.dePic(this.state.id)}
                                                                    type="danger"
                                                                    icon={'delete'}/> : null}
                       width={500} closable={false}
                       onCancel={this.handleCancel}>
                    <img alt="加载失败" style={{width: '100%', cursor: 'pointer'}} onClick={() => {
                        window.open(this.state.previewImage, '_blank')
                    }} src={this.state.previewImage}/>
                </Modal>
                <Footer/>
            </div>
        ) : null
    };
}

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {
        dispatch
    }
}

//连接组件
ZhuYe = connect(mapStateToProps, mapDispatchToProps)(ZhuYe)
export default ZhuYe
