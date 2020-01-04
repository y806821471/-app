<template>
  <div class="login">
    <van-nav-bar title left-arrow @click-left="routerBack" />
    <van-cell-group>
      <div class="title">登录</div>
      <div class="top">欢迎来到乐烹烹</div>
      <van-field v-model="validateForm.mobile" type="tel" placeholder="请输入用户名" clearable />
      <!-- <div class="input_title">密码</div> -->
      <!-- 密码显示 -->
      <van-field v-model="validateForm.password" placeholder="请输入登录密码" @click-right-icon="clickIconEye" right-icon="closed-eye" v-if="pwdType"/>
      <!-- 密码隐藏 -->
      <van-field v-model="validateForm.password" type="password" placeholder="请输入登录密码" @click-right-icon="clickIconEye" right-icon="eye-o" v-else/>
      <van-button class="common-btn" @click="submit">登录</van-button>
      <router-link to="/Forget" class="forget">忘记密码？</router-link>
      <div class="bottom">
        还没账号？
        <router-link to="/Register">&nbsp;注册</router-link>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validateForm: {
        mobile: "",
        password: "",
      },
      pwdType: false
    };
  },
  created(){
  },
  methods: {
    // 登录
    submit() {
      // if (!/^[1][3-9][0-9]{9}$/.test(this.validateForm.mobile)) {
      //   this.$toast("请输入正确的手机号");
      //   return;
      // }
      // if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/.test(this.validateForm.password)) {
      //   this.$toast("密码为6-20位数字字母组合");
      //   return;
      // }
      const formData = {
        account: this.validateForm.mobile,
        pwd: this.validateForm.password,
      };
      this.$http.post("/User/login", formData).then(response => {
        const res = response.data;
        console.log(res);
        this.$toast(res.msg);
        if (res.status === 200) {
          this.$http.defaults.headers.token = res.data.token;
          localStorage.setItem("accessToken", res.data.token);
          this.$router.push("/Index");
        }
      });
    },
    clickIconEye() {
      this.pwdType = !this.pwdType;
    },
  }
};
</script>

<style scoped>
.login{
  background-color: #fff;
  height: 100%;
  width: 100%;
}
.top {
  font-size: 14px;
  color: #969993;
  margin:10px 0 40px 0;
}
.input_title {
  color: #d94600;
  margin-top: 15px;
}
.forget{
  font-size: 14px;
  color: #969993;
}
.login .common-btn{
  margin: 20px 0 10px 0;
}
.bottom{
  position: relative;
  bottom: 10px;
  left: 0;
}
</style>
