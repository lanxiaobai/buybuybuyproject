<template>
    <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <router-link to="/index">首页</router-link>&gt;
                <router-link to="/buyCar">购物车</router-link>
            </div>
        </div>

        <div class="section">
            <div class="wrapper">
                <div class="bg-wrap">
                    <!--购物车头部-->
                    <div class="cart-head clearfix">
                        <h2>
                            <i class="iconfont icon-cart"></i>我的购物车</h2>
                        <div class="cart-setp">
                            <ul>
                                <li class="first active">
                                    <div class="progress">
                                        <span>1</span>
                                        放进购物车
                                    </div>
                                </li>
                                <li>
                                    <div class="progress">
                                        <span>2</span>
                                        填写订单信息
                                    </div>
                                </li>
                                <li class="last">
                                    <div class="progress">
                                        <span>3</span>
                                        支付/确认订单
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!--购物车头部-->
                    <!--商品列表-->
                    <div class="cart-box">
                        <input id="jsondata" name="jsondata" type="hidden">
                        <table width="100%" align="center" class="cart-table" border="0" cellspacing="0" cellpadding="8">
                            <tbody>
                                <tr>
                                    <th width="48" align="center">
                                        <a>选择</a>
                                    </th>
                                    <th align="left" colspan="2">商品信息</th>
                                    <th width="84" align="left">单价</th>
                                    <th width="104" align="center">数量</th>
                                    <th width="104" align="left">金额(元)</th>
                                    <th width="54" align="center">操作</th>
                                </tr>
                                <tr v-if="message.length==0">
                                    <td colspan="10">
                                        <div class="msg-tips">
                                            <div class="icon warning">
                                                <i class="iconfont icon-tip"></i>
                                            </div>
                                            <div class="info">
                                                <strong>购物车没有商品！</strong>
                                                <p>您的购物车为空，
                                                    <a href="/index.html">马上去购物</a>吧！</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                <!-- 有数据的时候显示 -->
                                <tr v-for="(item, index) in message" :key="item.id">
                                    <td width="48" align="center">
                                        <el-switch v-model="item.isSelected"  active-color="#409eff" inactive-color="#555555">
                                        </el-switch>
                                    </td>
                                    <td align="left" colspan="2">
                                        <div class="shopInfo"><img :src="item.img_url" alt="" style="width: 50px; height: 50px; margin-right: 10px;">
                                            <span>{{item.title}}</span>
                                        </div>
                                    </td>
                                    <td width="84" align="left">{{item.sell_price}}</td>
                                    <td width="104" align="center">
                                        <el-input-number v-model="item.buycount" @change="countChange($event,index)" size="mini" :min="1" :max="10000" label="描述文字"></el-input-number>
                                    </td>
                                    <td width="104" align="left">{{item.buycount*item.sell_price}}</td>
                                    <td width="54" align="center">
                                        <a @click="delIndex=index;showmodal=true" href="javascript:void(0)">删除</a>
                                    </td>
                                </tr>
                                <tr>
                                    <th align="right" colspan="8">
                                        已选择商品
                                        <b class="red" id="totalQuantity">{{selectcount}}</b> 件 &nbsp;&nbsp;&nbsp; 商品总金额（不含运费）：
                                        <span class="red">￥</span>
                                        <b class="red" id="totalAmount">{{totalPrice}}</b>元
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!--/商品列表-->
                    <!--购物车底部-->
                    <div class="cart-foot clearfix">
                        <div class="right-box">
                            <button class="button" onclick="javascript:location.href='/index.html';">继续购物</button>
                            
                                <button @click="toPayOrder" class="submit">立即结算</button>
                           
                        </div>
                    </div>
                    <!--购物车底部-->
                </div>
            </div>
        </div>
        <Modal v-model="showmodal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>警告</span>
            </p>
            <div style="text-align:center">
                
                <p>确定要删除吗?</p>
            </div>
            <div slot="footer">
                <Row>
                    <Col span="12"><Button type="success" long size="small" @click="showmodal=false" >取消</Button></Col>
                    <Col span="12"> <Button type="error" long size="small" @click="del"  >确定</Button></Col>
                </Row> 
            </div>
        </Modal>

    </div>
</template>

<script>
    export default {
        name: 'buyCar',
        data:function () {
            return {
                message:[],
                showmodal:false,
                delIndex:0
            }
        },
        created () {
            this.$Spin.show();
            let buyList=this.$store.state.buyList;
            console.log(buyList);
            let ids='';
            for (const key in buyList) {
                ids+=key;
                ids+=',';
            }
            // 切掉最后一个逗号
            ids=ids.slice(0,-1);
            if(ids==''){
                this.$Spin.hide();
                return;
            }
            this.axios.get(`site/comment/getshopcargoods/${ids}`)
            .then(response=>{
                // console.log(response);
                response.data.message.forEach((v,i) => {
                    v.buycount=buyList[v.id];
                    v.isSelected=true;
                });
                this.message=response.data.message;
                 this.$Spin.hide();
            })
            .catch(err=>{
                console.log(err);
            })
        },
        computed: {
            selectcount(){
                let totalCount=0;
                this.message.forEach(v=>{
                    if(v.isSelected){
                        totalCount+=v.buycount
                    }
                })
                return totalCount;
            },
            totalPrice(){
                let price=0;
                this.message.forEach(v=>{
                    if(v.isSelected){
                        price+=v.buycount*v.sell_price;
                    }
                })
                return price;
            },
        },
        methods: {
            countChange(value,index){
                // console.log(value,index);
                // console.log(111);
                
                this.$store.commit('changeCount',{
                    goodId:this.message[index].id,
                    goodNum:value
                })
            },
            del(){
                this.$store.commit('delGoodById',this.message[this.delIndex].id);
                this.message.splice(this.delIndex,1);
                this.showmodal=false;
            },
            // 判断购物车里的商品是否选中
            toPayOrder(){
                let ids='';
                this.message.forEach(v=>{
                    if(v.isSelected){
                        ids+=v.id;
                        ids+=','
                    }
                });
                if(ids==''){
                    this.$Message.error('购物车为空!')
                    return;
                }
                // 切掉最后一个逗号
                ids=ids.slice(0,-1);
                // 然后跳转
                this.$router.push('/payOrder/'+ids);
            }
        }
    }
</script>