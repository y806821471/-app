<template>
  <!-- 底部 -->
  <van-tabbar route active-color="#30362A" inactive-color="#969993" safe-area-inset-bottom>
    <van-tabbar-item replace to="/Index">
      <img v-if="routePath == '/Index'" width="24" src="../assets/img/home-on.png" />
      <img v-if="routePath != '/Index'" width="24" src="../assets/img/home-off.png" />
      <span class="item-text">首页</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/selfTesting">
      <img v-if="routePath == '/selfTesting'" width="24" src="../assets/img/selftesting-on.png" />
      <img v-if="routePath != '/selfTesting'" width="24" src="../assets/img/selftesting-off.png" />
      <span class="item-text">自测</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/cookbook">
      <img v-if="routePath == '/cookbook'" width="24" src="../assets/img/cookbook-on.png" />
      <img v-if="routePath != '/cookbook'" width="24" src="../assets/img/cookbook-off.png" />
      <span class="item-text">食谱</span>
    </van-tabbar-item>
    <van-tabbar-item replace to="/personal">
      <img v-if="routePath == '/personal'" width="24" src="../assets/img/personal-on.png" />
      <img v-if="routePath != '/personal'" width="24" src="../assets/img/personal-off.png" />
      <span class="item-text">我的</span>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
export default {
  methods: {},
  computed: {
    routePath() {
      return this.$route.path;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .item-text{padding-top: 5px;}
</style>
