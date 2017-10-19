/**
 * Created by Administrator on 2017/7/14.
 */
import React from  'react';
import AllRead from '../../../../components/Common/AllRead.js';
import moment from 'moment'
import { Table } from 'antd';
let base64 =require('base-64');
let utf8 = require('utf8');
const columns = [{
    title: '日期',
    dataIndex:'createTime',
    key:"0"
}, {
    title: '类型',
    dataIndex:'buinessName',
    key:"1"
}, {
    title: '收入',
    dataIndex:"shouru",
    key:"2",
},{
    title:"支出",
    dataIndex:'zhichu',
    key:"3",
},{
    title:'可用金额',
    dataIndex: 'afterBalance',
    key:"4"
}
];
export default class Fundflow  extends React.Component{
    constructor(){
        super();
        this.state={
            data: [],
            pagination: {},
            loading: false,
            numberID:"",
        }
    };
    handleTableChange = (pagination, filters, sorter) => {
        this.props.changewithDrawType(false);
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        });
        this.fetch({
            results: pagination.pageSize,
            pageNo: pagination.current,
            sortField: sorter.field,
            sortOrder: sorter.order,
            ...filters,
        });
    };
    guid=()=> {//随机一个唯一的ID
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    fetch = (params = {}) => {
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                ...params,
                perPage:10,
            },
            explain:{
                numberID:this.state.numberID,
                appToken:token
            }
        };
        let jsons=JSON.stringify(data_code);
        let bytes = utf8.encode(jsons);
        let base64_data=base64.encode(bytes);
        const sendMessage={
            method: "post",
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body:"data="+base64_data
        };
        this.setState({ loading: true });
        fetch('http://192.168.1.129:92/account/accountChangeList.do',sendMessage).then(response => response.json()).then(json => {
            if(json.code==="SUCCESS"){
                const pagination = { ...this.state.pagination };
                pagination.total = json.data.total;
                let data=json.data.list;
                for(let node of data){
                  node.key=this.guid();
                    node.createTime=moment(node.createTime).format('YYYY'+'年'+'MM'+'月'+'DD'+'日'+' HH:mm');
                    if(!node.add){
                        node["zhichu"]='￥'+node.operateAmount;
                        node["shouru"]="---";
                    }else{
                        node["zhichu"]="---";
                        node["shouru"]='￥'+node.operateAmount;
                    }
                };
                this.setState({
                    loading: false,
                    data: data,
                    pagination,
                });
            }
        }).catch(this.setState({ loading: false }));
    };
    componentDidMount() {
        this.fetch();
    };
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        this.setState({numberID:NUMBERID});
    };
    render(){
        return(
            <div>
                <Table
                       columns={columns}
                       // rowKey={record => record.registered}//表格行 key 的取值，可以是字符串或一个函数
                       dataSource={this.props.withDrawType?this.props.datalist:this.state.data}
                       pagination={(this.props.pagination.total||this.state.pagination.total)>10?(this.props.withDrawType? this.props.pagination:this.state.pagination):false}
                       loading={this.props.withDrawType?this.props.loadingstatu:this.state.loading}
                       onChange={this.handleTableChange}
                />
                <div style={{display:this.state.data.length<1?"":"none",width:"100%",height:"200px"}}>
                    <img src='/src/assets/images/nodata/nodata.jpg' alt="" width="100%" height="100%"/>
                </div>
            </div>
        )
    }
}

