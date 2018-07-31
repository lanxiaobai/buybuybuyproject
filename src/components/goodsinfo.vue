<template>
     <div>
        <div class="section">
            <div class="location">
                <span>当前位置：</span>
                <a href="/index.html">首页</a> &gt;
                <a href="/goods.html">购物商城</a> &gt;
                <a href="/goods/42/1.html">商品详情</a>
            </div>
        </div>
        <div class="section">
            <div class="wrapper clearfix">
                <div class="wrap-box">
                    <div class="left-925">
                        <div class="goods-box clearfix">
                            <div v-if="this.imglist.length!=0" class="pic-box">
                                <ProductZoomer :baseImages="images" :base-zoomer-options="zoomerOptions">
                                    
                                </ProductZoomer>
                            </div>
                            <div class="goods-spec">
                                <h1>{{goodsinfo.title}}</h1>
                                <p class="subtitle">{{goodsinfo.sub_title}}</p>
                                <div class="spec-box">
                                    <dl>
                                        <dt>货号</dt>
                                        <dd id="commodityGoodsNo">{{goodsinfo.goods_no}}</dd>
                                    </dl>
                                    <dl>
                                        <dt>市场价</dt>
                                        <dd>
                                            <s id="commodityMarketPrice">¥{{goodsinfo.market_price}}</s>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dt>销售价</dt>
                                        <dd>
                                            <em id="commoditySellPrice" class="price">¥{{goodsinfo.sell_price}}</em>
                                        </dd>
                                    </dl>
                                </div>
                                <div class="spec-box">
                                    <dl>
                                        <dt>购买数量</dt>
                                        <dd>
                                            <div class="stock-box">
                                                <div class="el-input-number el-input-number--small">
                                                    <span role="button" class="el-input-number__decrease" :class="{'is-disabled':buyNum==1}">
                                                        <i @click="buyNum==1?1:buyNum--" class="el-icon-minus"></i>
                                                    </span>
                                                    <span role="button" class="el-input-number__increase" :class="{'is-disabled':buyNum==goodsinfo.stock_quantity}">
                                                        <i @click="buyNum<goodsinfo.stock_quantity?buyNum++:goodsinfo.stock_quantity" class="el-icon-plus"></i>
                                                    </span>
                                                    <div class="el-input el-input--small">
                                                        <!---->
                                                        <input v-model="buyNum" autocomplete="off" size="small" type="text" rows="2" max="60"
                                                            min="1" validateevent="true" class="el-input__inner" role="spinbutton"
                                                            aria-valuemax="60" aria-valuemin="1" aria-valuenow="1" aria-disabled="false">
                                                        <!---->
                                                        <!---->
                                                        <!---->
                                                    </div>
                                                </div>
                                            </div>
                                            <span class="stock-txt">
                                                库存
                                                <em id="commodityStockNum">{{goodsinfo.stock_quantity}}</em>件
                                            </span>
                                        </dd>
                                    </dl>
                                    <dl>
                                        <dd>
                                            <div id="buyButton" class="btn-buy">
                                                <button onclick="cartAdd(this,'/',1,'/shopping.html');" class="buy">立即购买</button>
                                                <button onclick="cartAdd(this,'/',0,'/cart.html');" class="add">加入购物车</button>
                                            </div>
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div id="goodsTabs" class="goods-tab bg-wrap">
                             <Affix>
                                <div id="tabHead" class="tab-head" style="position: static; top: 517px; width: 925px;">
                                    <ul>
                                        <li>
                                            <a @click="isShowDesc=true" href="javascript:;" :class="{selected:isShowDesc}">商品介绍</a>
                                        </li>
                                        <li>
                                            <a @click="isShowDesc=false" href="javascript:;" :class="{selected:!isShowDesc}">商品评论</a>
                                        </li>
                                    </ul>
                                </div>
                             </Affix>
                            <div v-html="goodsinfo.content" class="tab-content entry" v-show="isShowDesc">
                               
                            </div>
                            <div class="tab-content" v-show="!isShowDesc">
                                <div class="comment-box">
                                    <div id="commentForm" name="commentForm"
                                        class="form-box">
                                        <div class="avatar-box">
                                            <i class="iconfont icon-user-full"></i>
                                        </div>
                                        <div class="conn-box">
                                            <div class="editor">
                                                <textarea v-model.trim="comentContent" id="txtContent" name="txtContent" sucmsg=" " datatype="*10-1000" nullmsg="请填写评论内容！"></textarea>
                                                <span class="Validform_checktip"></span>
                                            </div>
                                            <div class="subcon">
                                                <input id="btnSubmit"  name="submit" v-on:click="errTip" type="submit" value="提交评论" class="submit">
                                                <span class="Validform_checktip"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <ul id="commentList" class="list-box">
                                        <p v-if="messageList.length==0" style="margin: 5px 0px 15px 69px; line-height: 42px; text-align: center; border: 1px solid rgb(247, 247, 247);">暂无评论，快来抢沙发吧！</p>
                                        <li v-for="(item, index) in messageList" :key="item.id">
                                            <div class="avatar-box">
                                                <i class="iconfont icon-user-full"></i>
                                            </div>
                                            <div class="inner-box">
                                                <div class="info">
                                                    <span>{{item.user_name}}</span>
                                                    <span>{{item.add_time | cutTime}}</span>
                                                </div>
                                                <p>{{item.content}}</p>
                                            </div>
                                        </li>
                                       
                                    </ul>
                                    <div class="page-box" style="margin: 5px 0px 0px 62px;">
                                        <Page :page-size-opts="[5,10,15,20]" @on-change="pageChange($event)" @on-page-size-change="pageSizeChange($event)" :total="totalCount" :page-size="pageSize" placement="top" show-elevator show-sizer />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="left-220">
                        <div class="bg-wrap nobg">
                            <div class="sidebar-box">
                                <h4>推荐商品</h4>
                                <ul class="side-img-list">
                                    <li v-for="(item, i) in hotgoodslist" :key="item.id">
                                        <div class="img-box">
                                            <router-link :to="`/goodsinfo`+item.id">
                                                <img :src="item.img_url">
                                            </router-link>
                                        </div>
                                        <div class="txt-box">
                                            <router-link :to="`/goodsInfo/`+item.id">{{item.title}}</router-link>
                                            <span>{{item.add_time | cutTime}}</span>
                                        </div>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <BackTop></BackTop>
    </div>
</template>

<script>
// 放大镜
import ProductZoomer from 'vue-product-zoomer';
export default {
    data:function(){
        return {
            goodsinfo:{},
            hotgoodslist:[],
            imglist:[],
            isShowDesc:true,
            buyNum:1,
            // 轮播图数据
            images:{
                normal_size: []
            },
            // 轮播图的配置
            zoomerOptions: {
                zoomFactor: 2,
                pane: "container-round",
                hoverDelay: 300,
                namespace: "inline-zoomer",
                move_by_click: true,
                scroll_items: 5,
                choosed_thumb_border_color: "#bbdefb"
            },
            // 评论的内容
            comentContent:'',
            pageIndex: 1,
            pageSize: 5,
            // 评论的数据
            messageList: [],
            // 总条数
             totalCount: 0
        };
    },
    methods: {
        getgoodsinfo(){
            // 强制初始化
            this.imglist = [];
            // 清空预览图片的数组
            this.images.normal_size = [];
            this.axios
            .get(`site/goods/getgoodsinfo/${this.$route.params.id}`)
            .then((response)=>{
                // console.log(this.$route);
                this.goodsinfo=response.data.message.goodsinfo;
                this.hotgoodslist=response.data.message.hotgoodslist;
                this.imglist=response.data.message.imglist;
                this.imglist.forEach((v, i) => {
                    this.images.normal_size.push({
                    id: v.id,
                    url: v.original_path
                    });
                });
            })
            .catch((err12)=>{
                console.log(err12);
            })
        },
        errTip(){
            if(this.comentContent==''){
                this.$Message.error({
                    content:'对方不想说话,并且向你抛出个异常',
                    closable:true
                });
                return;
            }
            this.axios.post(`site/validate/comment/post/goods/${this.$route.params.id}`,{
            commenttxt:this.comentContent
            }).then(response=>{
             if(response.data.status==0){
                this.$Message.success('评论发表成功!!');
                this.pageIndex=1;
                this.getcomengts();
                }
         }).catch(err=>{

         })
            this.comentContent='';
        },
        getcoments(){
            this.axios.get(`site/comment/getbypage/goods/${this.$route.params.id}?pageIndex=${
            this.pageIndex
            }&pageSize=${this.pageSize}`)
            .then(response=>{
                // console.log(response)
                this.messageList=response.data.message;
                this.totalCount=response.data.totalcount;
            })
            .catch(err=>{
                console,log(err);
            })
        },
        // 页码改变
        pageChange(page){
            this.pageIndex=page;
            // 重新获取数据
            this.getcoments();
        },
        // 页容量改变
        pageSizeChange(size){
            this.pageSize=size;
            // 重新获取数据
            this.getcoments();
        }

    },
 
    // 注册组件放大镜
    components: {
        ProductZoomer
    },
    beforeCreate() {
       
    },
    created () {
        // 获取评论
        this.getcoments();
        // 获取商品详情
         this.getgoodsinfo();
    },
    beforeMount () {
        
    },
    mounted() {
        
    },
    watch: {
        $route(to,from){
            this.getgoodsinfo();
            this.getcoments();
        }
    }
}
</script>

<style>
@import url("../../node_modules/font-awesome/css/font-awesome.min.css");
.inline-zoomer-zoomer-box {
  width: 368px;
}
.pic-box .control-box .thumb-list {
  display: flex;
}
.thumb-list img {
  height: 78px;
  width: 78px;
  margin: 5px;
}
.control i {
  text-align: center;
}
</style>



