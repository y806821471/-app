<template>
  <div class="AlterEmail">
    <van-nav-bar title="邮箱地址" left-arrow @click-left="routerBack" />
    <div class="list-item">
      <van-field v-model="validateForm.mail" type="tel" placeholder="请输入邮箱" clearable />
    </div>
    <van-button size="large" hairline @click="submit">确定</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validateForm: {
        mail: ""
      }
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    getUserInfo() {
      this.$http("User/info").then(response => {
        console.log(response.data.data);
        this.userInfo = response.data.data;
        this.validateForm.mail = this.userInfo.member_info.mail;
      });
    },
    submit() {
      if(this.validateForm.mail ==""){
        this.$toast("邮箱不能为空")
        return;
      }
      if (!/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(this.validateForm.mail)) {
        this.$toast("请输入正确的邮箱");
        return;
      }
      const formData = {
        mail: this.validateForm.mail,
        gender: this.userInfo.member_info.gender,
        born_at: this.userInfo.member_info.born_at,
        height: this.userInfo.member_info.height,
        weight: this.userInfo.member_info.weight
      };
      this.$http.post("/User/info", formData).then(response => {
        console.log(response);
        const res = response.data;
        this.$toast(res.msg);
        if (res.status === 200) {
          this.$toast(res.msg);
          this.getUserInfo();
          this.$router.back();
        }
      });
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