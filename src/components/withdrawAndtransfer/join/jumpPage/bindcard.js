/**
 * Created by Administrator on 2017/7/19.
 */
import React from 'react';
import AllRead from '../../../../components/Common/AllRead.js';
import { Modal,Radio,Icon,Input,Alert,Popconfirm,message } from 'antd';
const RadioGroup = Radio.Group;
let base64 =require('base-64');
let utf8 = require('utf8');
export default class Bindcard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            loading: false,
            visible: false,
            checkedvalue: 1,//卡类型
            cityList:null,
            bankList:false,//绑定过的银行
            chooseBank:0,
            checkMoney:null,//检验输入的金额
            checkMoneyValue:"",//输入金额的值
            checkPw:null,//检验输入的密码
            checkPwValue:"",//输入密码的值
            bankName:null,
            bankCard:null,
            supportBankList:[],//支持银行
            provinceValue:"北京",//省
            cityValue:"东城",//市
            bankNameValue:"",//银行名称传给后台
            bankCardValue:"",//银行卡号传给后台
            bankCode:"",//银行简码传给后台
            branchName:"",//支行名称传给后台
            realAmount:"0.00",//实际到账金额
            fee:"0.00",//手续费
            selectBank:[],//已绑定过的银行卡
            selectBankOne:[],//绑定的第一张卡
            userCardIdValue:"",//绑定银行卡ID的值
            userCardId:false,//是否绑定过银行卡
            numberID:"",
            responseMessage:"",//提现提交后的返回信息
            okrecharge:false,//提现提交后的返回状态
            bindisSuccess:false,//绑卡是否成功
            bindfail:false,//绑卡失败了的状态
            deleteCard:false,//删除已经绑定的银行卡
            withDrawType:false,//提现提示内容的类型
            pagination: {},//资金流的参数

        }
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    // handleOk = () => {
    //     this.setState({ loading: true });
    //     setTimeout(() => {
    //         this.setState({ loading: false, visible: false });
    //     }, 3000);
    // };
    handleCancel = () => {
        this.setState({
            bankCardValue:"",
            branchName:"",
            bankName:null,
            bankCard:null,
            bindfail:false,
        });
        this.setState({ visible: false });
    };
    onChangeRadio = (e) => {
        this.setState({
            checkedvalue: e.target.value,
        });
    };
    fetchfunction=(url)=>{
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
            },
            explain:{
                numberID:NUMBERID,
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
        fetch(url,sendMessage).then(response=>response.json()).then(json=>{
            if(json.code=="SUCCESS"){
                if(json.data.cardList.length>0){
                    this.setState({
                        selectBank:json.data.cardList,
                        selectBankOne:json.data.cardList.slice(0,1),
                        userCardIdValue:json.data.cardList[0].cardId,
                        userCardId:true
                    });
                }else{
                    this.setState({
                        selectBank:json.data.cardList,
                        selectBankOne:json.data.cardList.slice(0,1),
                        userCardIdValue:undefined,
                        userCardId:false
                    });
                }
            };
        });
    }
    componentWillMount(){
        const NUMBERID=decodeURI(AllRead.getCookie('NUMBERID'));
        const token=decodeURI(AllRead.getCookie('token'));
        this.setState({numberID:NUMBERID});
        const data_code={
            data:{
            },
            explain:{
                numberID:NUMBERID,
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
        //支持的银行卡列表
        fetch('http://192.168.1.129:92/v1/bankcode/bankcodeList.do',sendMessage).then(response=>response.json()).then(json=>{
            if(json.code=="SUCCESS"){
                this.setState({supportBankList:json.data.list,bankCode:json.data.list[0].bankCode,bankNameValue:json.data.list[0].bankName});
            }
        });
        //查询我绑定的银行卡
        this.fetchfunction('http://192.168.1.129:92/v1/userCard/selectBank.do');
        const arr = new  Array();
        arr[0 ]="东城,西城,崇文,宣武,朝阳,丰台,石景山,海淀,门头沟,房山,通州,顺义,昌平,大兴,平谷,怀柔,密云,延庆"
        arr[1 ]="黄浦,卢湾,徐汇,长宁,静安,普陀,闸北,虹口,杨浦,闵行,宝山,嘉定,浦东,金山,松江,青浦,南汇,奉贤,崇明"
        arr[2 ]="和平,东丽,河东,西青,河西,津南,南开,北辰,河北,武清,红挢,塘沽,汉沽,大港,宁河,静海,宝坻,蓟县"
        arr[3 ]="万州,涪陵,渝中,大渡口,江北,沙坪坝,九龙坡,南岸,北碚,万盛,双挢,渝北,巴南,黔江,长寿,綦江,潼南,铜梁,大足,荣昌,壁山,梁平,城口,丰都,垫江,武隆,忠县,开县,云阳,奉节,巫山,巫溪,石柱,秀山,酉阳,彭水,江津,合川,永川,南川"
        arr[4 ]="石家庄,邯郸,邢台,保定,张家口,承德,廊坊,唐山,秦皇岛,沧州,衡水"
        arr[5 ]="太原,大同,阳泉,长治,晋城,朔州,吕梁,忻州,晋中,临汾,运城"
        arr[6 ]="呼和浩特,包头,乌海,赤峰,呼伦贝尔盟,阿拉善盟,哲里木盟,兴安盟,乌兰察布盟,锡林郭勒盟,巴彦淖尔盟,伊克昭盟"
        arr[7 ]="沈阳,大连,鞍山,抚顺,本溪,丹东,锦州,营口,阜新,辽阳,盘锦,铁岭,朝阳,葫芦岛"
        arr[8 ]="长春,吉林,四平,辽源,通化,白山,松原,白城,延边"
        arr[9 ]="哈尔滨,齐齐哈尔,牡丹江,佳木斯,大庆,绥化,鹤岗,鸡西,黑河,双鸭山,伊春,七台河,大兴安岭"
        arr[10 ]="南京,镇江,苏州,南通,扬州,盐城,徐州,连云港,常州,无锡,宿迁,泰州,淮安"
        arr[11 ]="杭州,宁波,温州,嘉兴,湖州,绍兴,金华,衢州,舟山,台州,丽水"
        arr[12 ]="合肥,芜湖,蚌埠,马鞍山,淮北,铜陵,安庆,黄山,滁州,宿州,池州,淮南,巢湖,阜阳,六安,宣城,亳州"
        arr[13 ]="福州,厦门,莆田,三明,泉州,漳州,南平,龙岩,宁德"
        arr[14 ]="南昌市,景德镇,九江,鹰潭,萍乡,新馀,赣州,吉安,宜春,抚州,上饶"
        arr[15 ]="济南,青岛,淄博,枣庄,东营,烟台,潍坊,济宁,泰安,威海,日照,莱芜,临沂,德州,聊城,滨州,菏泽"
        arr[16 ]="郑州,开封,洛阳,平顶山,安阳,鹤壁,新乡,焦作,濮阳,许昌,漯河,三门峡,南阳,商丘,信阳,周口,驻马店,济源"
        arr[17 ]="武汉,宜昌,荆州,襄樊,黄石,荆门,黄冈,十堰,恩施,潜江,天门,仙桃,随州,咸宁,孝感,鄂州"
        arr[18 ]="长沙,常德,株洲,湘潭,衡阳,岳阳,邵阳,益阳,娄底,怀化,郴州,永州,湘西,张家界"
        arr[19 ]="广州,深圳,珠海,汕头,东莞,中山,佛山,韶关,江门,湛江,茂名,肇庆,惠州,梅州,汕尾,河源,阳江,清远,潮州,揭阳,云浮"
        arr[20 ]="南宁,柳州,桂林,梧州,北海,防城港,钦州,贵港,玉林,南宁地区,柳州地区,贺州,百色,河池"
        arr[21 ]="海口,三亚"
        arr[22 ]="成都,绵阳,德阳,自贡,攀枝花,广元,内江,乐山,南充,宜宾,广安,达川,雅安,眉山,甘孜,凉山,泸州"
        arr[23 ]="贵阳,六盘水,遵义,安顺,铜仁,黔西南,毕节,黔东南,黔南"
        arr[24 ]="昆明,大理,曲靖,玉溪,昭通,楚雄,红河,文山,思茅,西双版纳,保山,德宏,丽江,怒江,迪庆,临沧"
        arr[25 ]="拉萨,日喀则,山南,林芝,昌都,阿里,那曲"
        arr[26 ]="西安,宝鸡,咸阳,铜川,渭南,延安,榆林,汉中,安康,商洛"
        arr[27 ]="兰州,嘉峪关,金昌,白银,天水,酒泉,张掖,武威,定西,陇南,平凉,庆阳,临夏,甘南"
        arr[28 ]="银川,石嘴山,吴忠,固原"
        arr[29 ]="西宁,海东,海南,海北,黄南,玉树,果洛,海西"
        arr[30 ]="乌鲁木齐,石河子,克拉玛依,伊犁,巴音郭勒,昌吉,克孜勒苏柯尔克孜,博 尔塔拉,吐鲁番,哈密,喀什,和田,阿克苏"
        arr[31 ]="香港"
        arr[32 ]="澳门"
        arr[33 ]="台北,高雄,台中,台南,屏东,南投,云林,新竹,彰化,苗栗,嘉义,花莲,桃园,宜兰,基隆,台东,金门,马祖,澎湖";
        this.setState({cityList:arr});
    };
    componentDidMount(){
        message.config({
            top: 300,
            duration: 2,
        });
        document.onclick=()=>{
            if(this.state.bankList){
                this.setState({bankList:false,});
            }
        };
    };
    getProvince=(e)=> {
        this.setState({provinceValue: e.target.value});
        const pro = document.getElementById("province");
        const city = document.getElementById("city");
        const index = pro.selectedIndex;
        const cityArr = this.state.cityList[index].split(",");
        city.length = 0;
        for(let i=0;i<cityArr.length;i++) {
            city[i]=new Option(cityArr[i],cityArr[i]);
        }
    };
    getCity=(e)=>{
        this.setState({cityValue: e.target.value});
    };
    chooseBank=(e)=>{
        this.setState({bankNameValue: e.target.text,bankCode:e.target.value});
    };
    toggleList=(e)=>{
        e.nativeEvent.stopImmediatePropagation();
        this.setState({
            bankList:!this.state.bankList,
        });
    };
    rechargeMoeny=(e)=>{
        const reg=/^[1-9]{1}\d*(\.\d{1,2})?$|(^0\.[1-9]{1,2}$)|(^0\.\d{1}[1-9]{1}$)/, sum=reg.test(e.target.value);
        this.setState({checkMoney:sum,checkMoneyValue:e.target.value});
        if(sum){
            // this.setState({checkMoneyValue:e.target.value});
            const token=decodeURI(AllRead.getCookie('token'));
            const data_code={
                data:{
                    amount:e.target.value,
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
            fetch('http://192.168.1.129:92/v1/withdraw/getFee.do',sendMessage).then(response=>response.json()).then(json=>{
                if(json.code=="SUCCESS"){
                    this.setState({fee:json.data.fee,realAmount:json.data.realAmount})
                }
            });
        }else{
            this.setState({fee:'0.00',realAmount:'0.00'});
        }
    };
    payPwcheck=(e)=>{
        const reg=/^[a-zA-Z\d]{6,}$/,pw=reg.test(e.target.value);
        this.setState({checkPw:pw,checkPwValue:e.target.value});
        // if(pw){
        //     this.setState({checkPwValue:e.target.value})
        // }
    };
    bankName=(e)=>{
        const reg=/^[\u4e00-\u9fa5]{4,}$/,bankName=reg.test(e.target.value);
        this.setState({bankName:bankName,branchName:e.target.value})
    };
   formatBC=(e)=>{
        let self = $.trim(e.target.value);
        let temp = e.target.value.replace(/\D/g,'').replace(/(....)(?=.)/g, '$1 ');
        if(self.length > 23){
            e.target.value = self.substr(0, 23);
            return e.target.value;
        };
        if(temp != e.target.value){
            e.target.value = temp;
        }
    };
    bankCard=(e)=>{
        let bankno =e.target.value.replace(/\s/g,'');
        if (bankno == "" || bankno == null) {
            this.setState({bankCard:false,bankCardValue:bankno});
        } else {
            if (16 > bankno.length || bankno.length > 19) {
                this.setState({bankCard:false,bankCardValue:bankno});
            } else {
                const lastNum = bankno.substr(bankno.length - 1, 1);
                const first15Num = bankno.substr(0, bankno.length - 1);
                const newArr = new Array();
                for (let i = first15Num.length - 1; i > -1; i--) {
                    newArr.push(first15Num.substr(i, 1));
                }
                const arrJiShu = new Array();
                const arrJiShu2 = new Array();

                const arrOuShu = new Array();
                for (let j = 0; j < newArr.length; j++) {
                    if ((j + 1) % 2 == 1) {
                        if (parseInt(newArr[j]) * 2 < 9)
                            arrJiShu.push(parseInt(newArr[j]) * 2);
                        else
                            arrJiShu2.push(parseInt(newArr[j]) * 2);
                    } else //偶数位
                        arrOuShu.push(newArr[j]);
                }
                const jishu_child1 = new Array();
                const jishu_child2 = new Array();
                for (let h = 0; h < arrJiShu2.length; h++) {
                    jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
                    jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
                }
                let sumJiShu = 0;
                let sumOuShu = 0;
                let sumJiShuChild1 = 0;
                let sumJiShuChild2 = 0;
                let sumTotal = 0;
                for (let m = 0; m < arrJiShu.length; m++) {
                    sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
                }
                for (let n = 0; n < arrOuShu.length; n++) {
                    sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
                }
                for (let p = 0; p < jishu_child1.length; p++) {
                    sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
                    sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
                }
                //计算总和
                sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
                //计算Luhm值
                const k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
                const luhm = 10 - k;
                if (lastNum == luhm) {
                    this.setState({bankCard:true,bankCardValue:bankno});
                } else {
                    this.setState({bankCard:false,bankCardValue:bankno});
                }
            }
        }
    };
    bankRow=(e)=>{
        const newDefalt=new Array();
        newDefalt[0]=this.state.selectBank[e.target.getAttribute('data-bank')];
        this.setState({selectBankOne:newDefalt,userCardIdValue:newDefalt[0].cardId});
    };
    forGetPw=()=>{
        this.props.changetype('1');
    };
    sureAddCard=(e)=>{
        if(this.state.branchName==""){
            this.setState({bankName:false});
            return;
        } else if(this.state.bankCardValue==""){
            this.setState({bankCard:false});
            return;
        }
        if(this.state.bankName&&this.state.bankCard){
            const token=decodeURI(AllRead.getCookie('token'));
            const data_code={
                data:{
                    'bankName':this.state.bankNameValue,
                    'bankCode':this.state.bankCode,
                    'province':this.state.provinceValue,
                    'city':this.state.cityValue,
                    'branchName':this.state.branchName,
                    'accountName':this.props.nameValue,
                    'cardNo':this.state.bankCardValue,
                    'cardType':this.state.checkedvalue,
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
            fetch('http://192.168.1.129:92/v1/userCard/bind.do',sendMessage).then(response => response.json()).then(json => {
                if(json.code=="SUCCESS"){
                     this.setState({
                         visible:false,
                         bindisSuccess:true,
                         bankCardValue:"",
                         branchName:"",
                     });
                }else{
                    //绑卡失败以后处理
                    this.setState({responseMessage:json.data.message,bindfail:true});
                }
            }).then(()=>{
                if(this.state.bindisSuccess){
                    this.fetchfunction('http://192.168.1.129:92/v1/userCard/selectBank.do');
                }
            });
        }
    };
    guid=()=> {//随机一个唯一的ID
        function S4() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    fetchFundflow = (params = {}) => {
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
                    let newTime=new Date( node.createTime);
                    node.createTime=newTime.toLocaleString();
                    if(!node.add){
                        node["zhichu"]='￥'+node.operateAmount;
                        node["shouru"]="---";
                    }else{
                        node["zhichu"]="---";
                        node["shouru"]='￥'+node.operateAmount;
                    }
                };
                this.props.fetchFundflow(false,data,pagination,this.state.withDrawType);
            }
        }).catch(this.setState({ loading: false }));
    };
    buttonRechargeForm=()=>{
        let token=decodeURI(AllRead.getCookie('token'));
        if(this.state.userCardId){this.setState({okrecharge:false});}
        if(this.state.checkMoneyValue==""){
            this.setState({checkMoney:false});
            return;
        }else if(this.state.checkPwValue==""){
            this.setState({checkPw:false});
            return;
        };
        if(this.state.checkPw&&this.state.checkMoney&&this.state.userCardId){
            const data_code={
                data:{
                    'userCardId':this.state.userCardIdValue,
                    'amount':this.state.checkMoneyValue,
                    'passwd':this.state.checkPwValue,
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
            fetch('http://192.168.1.129:92/v1/withdraw/apply.do',sendMessage).then(response => response.json()).then(json => {
                  if(json.code=="FAILURE"){
                     this.setState({responseMessage:json.data.message,okrecharge:true,withDrawType:false});
                  }else{
                      this.setState({
                          okrecharge:true,
                          responseMessage:json.data.message,
                          withDrawType:true,
                          checkMoneyValue:"",
                          checkPwValue:"",
                          checkPw:null,
                          checkMoney:null,
                          realAmount:"0.00",
                          fee:"0.00",
                      });
                  }
            }).then(()=>{
               if(this.state.withDrawType){
                   const data_code={
                       data:{
                           'numberID':this.state.numberID,
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
                   //提现成功以后实时更新余额
                   fetch('http://192.168.1.129:92/account/accountBalance.do',sendMessage).then(response => response.json()).then(json => {
                       if(json.code=="SUCCESS"){
                           this.props.withDrawSuccess(json.data.balance);
                       };
                   });
                   //提现成功以后实时更新资金流数据
                   this.fetchFundflow();
               }
            });
        }else{
           if(!this.state.userCardId){
               this.setState({responseMessage:"请您先绑定银行卡",okrecharge:true});
           }
        }
    };
    confirm=()=>{
        const token=decodeURI(AllRead.getCookie('token'));
        const data_code={
            data:{
                'userCardId':this.state.userCardIdValue,
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
        fetch('http://192.168.1.129:92/v1/userCard/unBind.do',sendMessage).then(response => response.json()).then(json => {
            if(json.code=="SUCCESS"){
                this.setState({deleteCard:true});
                message.info("删除成功！");
            }else{//取消绑定银行卡失败处理

            }
        }).then(()=>{
            if(this.state.deleteCard){
                this.fetchfunction('http://192.168.1.129:92/v1/userCard/selectBank.do');
            }
        });
    };
    cancel=()=>{  //取消删除绑卡的回调

    };
    render() {
        const { visible,supportBankList,selectBank,selectBankOne } = this.state;
        const province=new Array("北京","上海","天津","重庆","河北","山西","内蒙古","辽宁","吉林","黑龙江","江苏","浙江","安徽","福建","江西","山东","河南","湖北","湖南","广东","广西","海南","四川","贵州","云南","西藏","陕西","甘肃","宁夏","青海","新疆","香港","澳门","台湾");
        const cityOne=new Array("东城","西城","崇文","宣武","朝阳","丰台","石景山","海淀","门头沟","房山","通州",'顺义','昌平','大兴','平谷','怀柔','密云',"延庆");
        const selectBankList=selectBank.length?selectBank.map((value,index)=>(
            <li onClick={this.bankRow} key={index} data-bank={index}>
                <img data-bank={index} src={"/src/assets/images/bank_logo/"+value.bankCode+".jpg"} alt=""/>
                <span data-bank={index}>{value.bankName}</span>
                <span data-bank={index}>尾号：{value.card4No}</span>
                <span data-bank={index}>{value.cardType=="1"?"储蓄":"信用"}</span>
            </li>
        )):"";
        const selectBankListOne=selectBankOne.map((value,index)=>(
            <li key={index}>
                <img src={"/src/assets/images/bank_logo/"+value.bankCode+".jpg"} alt=""/>
                <span>{value.bankName}</span>
                <span>尾号：{value.card4No}</span>
                <span>{value.cardType=="1"?"储蓄":"信用"}</span>
            </li>
        ));
        return(
            <div class="bindBank">
                <div class="aounttobk">提取高颜值账户余额到银行卡</div>
                <Alert
                    // message="Error"
                    description={this.state.responseMessage}
                    type={this.state.withDrawType?"success":"error"}
                    showIcon
                    style={{display:this.state.okrecharge?"":"none"}}
                />
                <div class="bindBank_main">
                    <div class="bindBank_group">
                        <div class="bind_left">账户余额:</div>
                        <div class="bind_right">￥{this.props.balanceMoney}</div>
                    </div>
                    <div class="bindBank_group">
                        <div class="bind_left">选择银行卡：</div>
                        <div class="bind_right" style={{display:this.state.userCardIdValue===undefined?"none":"",}}>
                            <div class="bank_list">
                                <div class="dropdown" onClick={this.toggleList}>
                                    <div class="bankMessage">
                                        <ul>
                                            {selectBankListOne}
                                        </ul>
                                    </div>
                                    <Icon type="caret-down" />
                                </div>
                                <Popconfirm title="您确定删除当前选中的银行卡吗?" onConfirm={this.confirm} onCancel={this.cancel} okText="确定" cancelText="取消">
                                    <Icon onClick={this.deleteCard} type="delete" style={{cursor:"pointer",fontSize:'20px',position:'absolute',top:"18px",right:"120px"}}/>
                                </Popconfirm>
                                <ul class="dropdown-menu" style={{display:(this.state.bankList)?"":"none"}}>
                                    {selectBankList}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="bindBank_group">
                        <div class="bind_left"></div>
                        <div class="bind_right">
                            <p class="addcard" onClick={this.showModal}>
                                添加银行卡
                            </p>
                        </div>
                    </div>
                    <div class="bindBank_group">
                        <div class="bind_left">提现金额：</div>
                        <div class="bind_right">
                            <Input placeholder="请输入提现金额" onChange={this.rechargeMoeny} value={this.state.checkMoneyValue}/>
                            <span class="error_money">{this.state.checkMoney===false?"请输入正确的金额且小数点后不超过两位":""}</span>
                        </div>
                    </div>
                    <div class="bindBank_group">
                        <div class="bind_left"></div>
                        <div class="bind_right">
                            <p class="money_p">提现费用：<span class="money">{this.state.fee}元</span>，实际到账：<span class="money">{this.state.realAmount}元</span></p>
                        </div>
                    </div>
                    <div class="bindBank_group">
                        <div class="bind_left">支付密码：</div>
                        <div class="bind_right">
                            <Input placeholder="请输入支付密码" onChange={this.payPwcheck} type="password" value={this.state.checkPwValue}/>
                            <span class="forget_pw" onClick={this.forGetPw}>忘记密码</span>
                            <div class="error">{this.state.checkPw===false?"密码不能为空且长度必须为6位以上的字母数字组成":""}</div>
                        </div>
                    </div>

                    <div class="bindBank_group">
                        <div class="bind_left"></div>
                        <div class="bind_right">
                            <button class="submitBtn" type="button" onClick={this.buttonRechargeForm}>确认提现</button>
                        </div>
                    </div>

                </div>
                <Modal
                    width={600}
                    visible={visible}
                    // title="添加银行卡"
                    // onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    style={
                        {}
                    }
                    footer={null}
                >
                    <div class="title_line">
                        <div class="custom_title">
                            添加银行卡
                        </div>
                    </div>
                    <div class="user_name">此银行卡必须为 <span class="bankcardName">{this.props.nameValue}</span>,否则会导致提现失败!</div>
                    <Alert
                        // message="Error"
                        description={this.state.responseMessage}
                        type="error"
                        showIcon
                        style={{display:this.state.bindfail?"":"none"}}
                    />
                    <div className="addBankcard">
                        <div class="addBankcard_left">
                            <div>真实姓名：</div>
                        </div>
                        <div class="addBankcard_right">
                            <div>
                                <Input placeholder={this.props.nameValue} readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className="addBankcard">
                        <div class="addBankcard_left">
                            <div>银行卡号：</div>
                        </div>
                        <div class="addBankcard_right">
                            <Input placeholder="请输入银行卡号" value={this.state.bankCardValue} onChange={this.bankCard} onInput={this.formatBC}/>
                            <RadioGroup onChange={this.onChangeRadio} value={this.state.checkedvalue} size="large">
                                <Radio value={1}>储蓄卡</Radio>
                                <Radio value={0}>信用卡</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div class="error bankCard_error">{this.state.bankCard===false?"卡号不能为空且必须是正确的卡号错任意一位都不行":""}</div>
                    <div className="addBankcard">
                        <div class="addBankcard_left">
                            <div>选择银行：</div>
                        </div>
                        <div class="addBankcard_right">
                            <select name="" id="chooseBnak" onChange={this.chooseBank}>
                                {
                                    supportBankList.map((value,index)=>{
                                        return(
                                            <option key={index} value={value.bankCode}>
                                                { value.bankName}
                                            </option>
                                        )
                                    })

                                }

                            </select>
                        </div>
                    </div>
                    <div className="addBankcard">
                        <div class="addBankcard_left">
                            <div>开户城市：</div>
                        </div>
                        <div class="addBankcard_right">
                            <select name="" id="province" onChange={this.getProvince}>
                                {
                                    province.map((value,index)=>{
                                        return(
                                            <option key={index} value={value}>
                                                {value}
                                            </option>

                                        )
                                    })
                                }
                            </select>
                            <select name="" id="city" onChange={this.getCity}>
                                {
                                    cityOne.map((value,index)=>{
                                        return(
                                            <option key={index} value={value}>
                                                {value}
                                            </option>

                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="addBankcard">
                        <div class="addBankcard_left">
                            <div>支行名称：</div>
                        </div>
                        <div class="addBankcard_right">
                            <Input placeholder="请输入开户支行名称" value={this.state.branchName} onChange={this.bankName}/>
                            <div class="error">{this.state.bankName===false?"请输入开户行名称且长度至少为4位中文字符":""}</div>
                        </div>
                    </div>
                    <div className="addBankcard">
                        <div class="addBankcard_left"></div>
                        <div class="addBankcard_right">
                            <button class="addBankcardBtn" type="button" onClick={this.sureAddCard}>确认添加</button>
                        </div>
                    </div>
                </Modal>

            </div>
        )
    }
}