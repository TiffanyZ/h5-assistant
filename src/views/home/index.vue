<template>
  <div class="page-home" :style="{ height: `${bodyHeight}px` }">
    <div class="home-main">
      <!-- 问候语 -->
      <div class="greeting">
        <p class="greeting-text">您好，我是智能助手！123456</p>
      </div>
      <!-- 悬挂问题(置顶问题) -->
      <div class="top-question">
        <div class="top-tag" v-for="(item, i) in topQuestion" :key="i">
          <win-tag round type="primary">{{ item || "" }}</win-tag>
        </div>
      </div>
      <!-- 提问引导卡 -->
      <recommend-card @sendMsg="sendQuestionFunc"></recommend-card>
      <!-- 问答组件 -->
      <!-- <chat-room :chatList="chatList"></chat-room> -->
    </div>
    <div class="home-bottom">
      <input type="text" class="input-Question" placeholder="在这里输入想说的话…" v-model="sendQuestion" />
      <div class="send-btn" @click="sendQuestionFunc(sendQuestion)">
        <img :src="sendImg" alt="send">
      </div>
    </div>
  </div>
</template>

<script>
import { topList } from '../../common/comData/homeData';
import { RecommendCard } from '@components';
export default {
  name: "home",

  mixins: [],

  components: {
    RecommendCard,
    // ChatRoom
  },

  data() {
    return {
      bodyHeight: "",
      topQuestion: topList, // 置顶卡片列表
      sendQuestion: '',
      sendImg: require("@assets/img/iconsend.png"),
      chatList: []
    };
  },

  computed: {
  },

  watch: {},

  created() {},

  mounted() {
    this.setBodyHeight();
  },

  destroyed() {},

  methods: {
    // 固定页面高度（原因：键盘弹出后webview高度会变高，因此要固定页面高度）
    setBodyHeight() {
      setTimeout(() => {
        this.bodyHeight = document.body.clientHeight;
      }, 0);
    },
    sendQuestionFunc(val) {
      console.log('send-msg');
      console.log(val);
      // 根据问题返回答案
      let obj = {
        questionTxt: val,
        answerType: 1,
        answerContnt: '测试答案'
      };
      this.chatList.push(obj);
    }
  }
};
</script>

<style lang="less" rel="stylesheet/less" scoped>
@import "./style.less";
</style>
