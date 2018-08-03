<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="javascript:;">支付中心</a>
            </div>
        </div>

        <div class="section">
            <div class="wrapper" v-if="orderInfo">
                <div class="bg-wrap">
                    <div class="nav-tit pay">
                        <a href="javascript:;" class="selected">支付中心</a>
                    </div>
                    <div class="form-box payment">
                        <div class="el-row">
                            <div class="el-col el-col-18">
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>订 单 号：</dt>
                                            <dd>{{orderInfo.order_no}}</dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>收货人姓名：</dt>
                                            <dd>{{orderInfo.accept_name}}</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>送货地址：</dt>
                                            <dd>{{orderInfo.area}}{{orderInfo.address}}
                                            </dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>手机号码：</dt>
                                            <dd>{{orderInfo.mobile}}</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>支付金额：</dt>
                                            <dd>{{orderInfo.order_amount}} 元</dd>
                                        </dl>
                                    </div>
                                    <div class="el-col el-col-12">
                                        <dl class="form-group">
                                            <dt>支付方式：</dt>
                                            <dd>在线支付</dd>
                                        </dl>
                                    </div>
                                </div>
                                <div class="el-row">
                                        <div class="el-col el-col-12">
                                                <dl class="form-group">
                                                    <dt>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</dt>
                                                    <dd>{{orderInfo.message}}</dd>
                                                </dl>
                                            </div>
                                </div>
                            </div>
                            <div class="el-col el-col-6">
                                <p>支付宝扫一扫支付</p>
                                <VueQrcode v-if="codeUrl" :value="codeUrl" :options="{size:200}"></VueQrcode>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import VueQrcode from '@xkeshi/vue-qrcode';
    export default{
        data:function(){
           return {
                orderid:0,
                orderInfo:undefined,
                codeUrl:undefined
           }
        },

        // 注册组件
        components:{
            VueQrcode
        },
        created() {
            // 获取id
            this.orderid=this.$route.params.orderid;
            // 订单详情
            this.axios.get(`site/validate/order/getorder/${this.orderid}`)
            .then(response=>{
                console.log(response);
                this.orderInfo=response.data.message[0];
            })
            .catch(err=>{
                console.log(err);
            });
            // 赋值给二维码组件的url
            this.codeUrl=`http://47.106.148.205:8899/site/validate/pay/alipay/${this.orderid}`;

            // 使用计时器来轮翻询问接口是否已经支付成功,如果支付成功,则返回status==2
            let timeId=setInterval(()=>{
                this.axios.get(`/site/validate/order/getorder/${this.orderid}`)
                .then(response=>{
                    if(response.data.message[0].status==2){
                        // 提示支付成功
                        this.$Message.success('支付成功!');
                        // 清空计算器
                        clearInterval(timeId);
                        // 跳转到成功页
                        this.$router.push('/paySuccess');
                        
                    }
                })
                .catch(err=>{
                })
            },500);
        },
    }
</script>
<style >
    
</style>