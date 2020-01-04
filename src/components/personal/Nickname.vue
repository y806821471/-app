<template>
  <div class="AlterEmail">
    <van-nav-bar title="我的名字" left-arrow @click-left="routerBack" />
    <div class="list-item">
      <van-field v-model="validateForm.nickname" type="tel" placeholder="请输入名字" clearable />
    </div>
    <van-button size="large" hairline @click="submit">确定</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: "",
      validateForm: {
        nickname: ""
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        console.log(response.data.data);
        this.userInfo = response.data.data;
        this.validateForm.nickname = this.userInfo.nickname;
      });
    },
    submit() {
      const formData = {
        nickname: this.validateForm.nickname
      };
      this.$http.post("/User/nickName", formData).then(response => {
        console.log(response);
        const res = response.data;
        this.$toast(res.msg);
        if(res.status==200){
          this.$toast(res.msg);
          this.getUserInfo();
          this.$router.back();
        }
      })
    }
  }
};
</script>

<style scoped>
.list-item {
  height: 100%;
  font-size: 14px;
}
.van-button {
  margin-top: 40px;
}
.van-button--default {
  color: rgba(217, 70, 0, 1);
}
[class*="van-hairline"]::after {
  border: 0;
}
.van-cell::after {
  border: 0;
}
.van-field__control:disabled {
  color: #30362a;
}
</style>