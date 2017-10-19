/**
 * Created by user on 2017/9/25.
 */
/**
 * Created by Administrator on 2017/7/19.
 */
import React from 'react';
import { Modal } from 'antd';
export default class  CollectionResult extends React.Component{
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
                <p style={{textAlign:"center"}}><img src={this.props.reponpse?"/src/assets/images/success.svg":"/src/assets/images/failed.svg"} alt="" width="60"/></p>
                <p style={{textAlign:"center"}}>{this.props.reponpse?"已收藏":"取消收藏"}</p>
            </Modal>
        )
    }
}/**
 * Created by user on 2017/9/26.
 */
