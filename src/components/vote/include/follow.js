/**
 * Created by user on 2017/9/25.
 */
/**
 * Created by Administrator on 2017/7/19.
 */
import React from 'react';
import { Modal } from 'antd';
    export default class  FollowResult extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
    };
    setTime=()=>{
        this.props.resultFunction(false);
        if(this.props.reponpse){
            // window.location.reload();
        }
    };
    componentDidMount(){
        setTimeout(this.setTime,2000);
    };
    handleCancel = () => {
        this.props.resultFunction(false);
    };
    render(){
        return(
            <Modal
                title=""
                visible={this.props.result}
                key={this.state.newKey}
                onCancel={this.handleCancel}
                footer={null}
                width={155}
                closable={false}
                style={{top:300}}
            >
                <p style={{textAlign:"center"}}><img src={this.props.reponpse=="添加喜欢成功"?"/src/assets/images/success.svg":"/src/assets/images/failed.svg"} alt="" width="60"/></p>
                <p style={{textAlign:"center"}}>{this.props.reponpse=="添加喜欢成功"?"已关注":"已取消关注"}</p>
            </Modal>
        )
    }
}