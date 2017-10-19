import {Icon, Modal} from 'antd'
import * as React from 'react'

class TanKuang extends React.Component {
    state = {visible: false, message: {}}
    showModal = () => {
        this.setState({
            visible: true,
        }, () => {
            this.timer = setTimeout(() => this.handleCancel(), 1000)
            // console.log(this.timer, 'show')
        })

    }

    componentWillReceiveProps(nextProps) {
        clearTimeout(this.timer)
        this.setState({message: nextProps.message, cancel: nextProps.cancel, flags: nextProps.flags})
        nextProps.flags ? this.showModal() : this.handleCancel(nextProps)
    }

    handleCancel = () => {
        // console.log(e)
        // console.log(this.timer, 'cancel')
        clearTimeout(this.timer)
        this.setState({
            visible: false,
        }, () => {
            this.state.cancel ? this.state.cancel() : null
        })

    }

    render() {
        // console.log(this.timer,'render')
        // console.log(this.state.message)
        return (
            <Modal
                width={155}
                style={{borderRadius: 'none', textAlign: 'center', color: '#333', top: 400}}
                onCancel={this.handleCancel}
                className={'su'}
                visible={this.state.visible}
                closable={false}
                footer={null}
            >
                {this.props.flags === '失败' ?
                    <Icon type="minus-circle" style={{fontSize: 40, color: 'rgb(153,153,153)'}}/>
                    : <Icon type="check-circle" style={{fontSize: 40, color: 'rgb(255,122,153)'}}/>}
                <p style={{padding: '10px 0'}}>{`${this.state.flags === '成功' ? this.state.message.message : this.state.message.message }`}</p>
            </Modal>
        )
    }
}

export default TanKuang
