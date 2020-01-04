<template>
  <div class="ServiceCenter">
    <van-nav-bar title="客服" left-arrow @click-left="routerBack" />
    <ul class="list">
      <li class="list-item" v-for="(item,index) in servicesList" :key="index">
        <div>
          {{item.name}}：
          <font>{{item.value}}</font>
        </div>
        <div v-clipboard:copy="item.value" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <span class="icon">&#xe606;</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      servicesList: []
    };
  },
  created() {
    this.getServices();
  },
  methods: {
    // 客服列表
    // getServices() {
    //   this.$http("/System/serverList").then(response => {
    //     const res = response.data;
    //     console.log(res.data);
    //     if (res.status === 200) {
    //       this.servicesList = res.data;
    //     }
    //   });
    // },
    async getServices() {
      const { data: res } = await this.$http("/System/serverList");
      console.log("客服列表", res);
      if (res.status !== 200) {
        return this.$toast("获取客服列表失败！");
      }
      this.servicesList = res.data;
    },
    //复制地址
    onCopy: function(e) {
      this.$toast("复制成功");
    },
    onError: function(e) {
      this.$toast("复制失败");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  height: 100%;
  background: #fff;
  font-size: 14px;
  padding: 0 17px;
}
.list-item {
  display: flex;
  height: 50px;
  justify-content: space-between;
  align-items: center;
  color: #30362a;
  border-bottom: 1px solid #f5f5f5;
}
.list > li:last-of-type {
  border: 0;
}
.list-item .icon {
  font-size: 18px;
}
.list-item font {
  color: #969993;
  margin-right: 10px;
}
.van-nav-bar {
  background-color: transparent;
}
.icon {
  color: #969993;
}
</style>
