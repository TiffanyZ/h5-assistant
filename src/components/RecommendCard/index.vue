<template>
  <div class="comp-recommend-card">
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item, index) in totalList" :key="index" class="item-recommend">
        <!-- 快速问答卡片 -->
        <div class="rec-card">
          <div class="rec-title">{{item[1] || ''}}</div>
          <div class="rec-content">
            <li
              v-for="(val, _index) in curList[index]"
              :key="_index"
              @click="sendQuestion(val)"
              :class="{'last-li': _index == curList[index].length - 1, 'fadeIn':slideFadeIn[index] == 1,'fadeOut':slideFadeIn[index] == 0}"
              :style="{'animation-delay':`${_index*0.1}s`}"
            >{{val}}</li>
            <div class="rec-replay" @click="changeRecList(index)" v-if="item[0].length > 5">
              <win-icon name="replay" :style="{'transform': `rotateZ(${isIconChange*360}deg)`}" />换一换
            </div>
          </div>
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { swiperOptions, recommendList } from '@/common/comData/homeData';
export default {
  name: "RecommendCard",

  props: {
  },

  mixins: [],

  components: {
    swiper,
    swiperSlide,
  },

  data() {
    return {
      swiperOptions: swiperOptions,
      totalList: recommendList, // 推荐卡片列表
      allPage: 0,
      curPage: [], // 每个板块目前处于第几页
      curList: [], //每个板块当前页数的列表 固定5条
      slideFadeIn: [], //滑入／滑出标识
      isSlideChange: false,
      isIconChange: 0, //换一换按钮动画标识
    };
  },

  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },

  watch: {},

  created() {
    this.getAllList();
  },

  mounted() {},

  destroyed() {},

  methods: {
    getAllList() {
      // this.totalList = recommendList;
      let resData = recommendList;
      let getArr = [];
      if (resData.length > 0) {
        let that = this;
        resData.forEach((item) => {
          getArr.push([item.arr, item.name]);
          that.curPage.push(0);
          that.slideFadeIn.push(-1);
        });
      }
      this.allPage = resData.length || 0;
      this.totalList = getArr;
      this.getTipiclList();
    },
    // 获取第一页列表
    getTipiclList() {
      let allArr = this.totalList;
      let getArr = [];
      if (this.allPage > 0) {
        allArr.forEach((item) => {
          let arr = item[0] || [];
          let arr1 = arr && arr.length >= 5 ? arr.slice(0, 5) : arr;
          getArr.push(arr1);
        });
      }
      this.curList = getArr;
    },
    // 点击推荐卡片中换一换
    changeRecList(index) {
      let _this = this;
      if (!_this.isSlideChange) {
        _this.isIconChange = !_this.isIconChange;
        _this.isSlideChange = true;
        let val = _this.curPage[index];
        let data = _this.totalList[index][0];
        //换页
        this.$set(
          _this.curPage,
          index,
          ++val > Math.ceil(data.length / 5) - 1 ? 0 : val
        );
        if (data.length > 5) {
          _this.changeTipiclList(index);
        } else {
          _this.isSlideChange = false;
        }
      }
    },
    //换一换方法
    changeTipiclList(index) {
      let _this = this;
      _this.$set(_this.slideFadeIn, index, 0);
      let i = _this.curPage[index];
      // console.log( _this.curPage);
      let _item = _this.totalList[index][0].slice(i * 5, (i + 1) * 5);
      let timeOut = setTimeout(() => {
        _this.$set(_this.curList, index, _item);
        _this.$set(_this.slideFadeIn, index, 1);
        _this.isSlideChange = false;
        let timer = setTimeout(() => {
          _this.$set(_this.slideFadeIn, index, -1);
          clearTimeout(timer);
        },900)
        clearTimeout(timeOut);
      }, 900);
    },
    sendQuestion(val) {
      this.$emit("sendMsg", val);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./style.less";
</style>
