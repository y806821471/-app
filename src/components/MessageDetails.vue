<template>
  <div class="MessageDetails">
    <van-nav-bar title="资讯详情" left-arrow @click-left="routerBack" />
    <div class="info">
      <div class="title">{{list.title}}</div>
      <div class="time">{{list.created_at.substring(0,16)}}</div>
      <div class="notice-content" v-html="list.details"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: JSON.parse(this.$route.query.id),
      list:[]
    };
  },
  created() {
    console.log("en", this.id);
    this.messageDetails();
  },
  methods: {
    messageDetails() {
      this.$http("/System/newsDetail", {
        params: {
          id: this.id
        }
      }).then(response => {
        // console.log("详情：", response);
        const res = response.data.data;
        if (res.status = 200) {
          this.list = res;
        }
      });
    }
  }
};
</script>

<style scoped>
.van-nav-bar{
  background-color: #F9F9F9;
}
.info {
  padding: 10px 17px;
}
.info .title {
  padding: 10px 0;
  font-size: 21px;
  display: flex;
  justify-content: center;
}
.info .time {
  color: #969993;
}
.notice-content {
  font-size: 15px;
  line-height: 24px;
  margin-top: 10px;
}
.notice-content >>> img {
  width: 100%;
  margin-top: 5px;
}
img {
  width: 100%;
  margin-top: 8px;
}
</style>