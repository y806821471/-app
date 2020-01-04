<template>
  <div class="login">
    <van-nav-bar title left-arrow @click-left="routerBack" />
    <van-cell-group>
      <div class="title">修改登陆密码</div>
      <van-field v-model="validateForm.password" placeholder="请输入新登陆密码" @click-right-icon="clickIconEye" right-icon="closed-eye" v-if="pwdType" />
      <van-field v-model="validateForm.password" type="password" placeholder="请输入新登陆密码" @click-right-icon="clickIconEye" right-icon="eye-o" v-else />

      <van-field v-model="validateForm.password2" placeholder="请再次输入新登陆密码" @click-right-icon="clickIconEye2" right-icon="closed-eye" v-if="pwdType2" />
      <van-field v-model="validateForm.password2" type="password" placeholder="请再次输入新登陆密码"  @click-right-icon="clickIconEye2" right-icon="eye-o" v-else />

      <van-field type="tel" v-model="validateForm.smscode" placeholder="请输入验证码">
        <sms-code slot="button" :mobile="validateForm.mobile" @sendCode="sendCode" prop="smscode"></sms-code>
      </van-field>

      <van-button class="common-btn" @click="submit">确定</van-button>
    </van-cell-group>
  </div>
</template>

<script>
import smsCode from "@/components/bin/smsCode";
import { log } from "util";
export default {
  components: {
    smsCode
  },
  data() {
    return {
      // userInfo: {}, //用户信息
      validateForm: {
        mobile: JSON.parse(localStorage.getItem("userInfo")).mobile,
        smsCode: "", //验证码
        password: "", // 密码
        password2: ""
      },
      pwdType: false,
      pwdType2: false
    };
  },
  created() {
  },
  methods: {
    // 验证码
    sendCode() {
      this.$http.post('/Index/sms').then((response) => {
        const res = response.data;
        this.$toast(res.msg);
      })
    },
    submit() {
      // if(!(/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/.test(this.validateForm.password))){
      //   this.$toast('密码为6-20位数字字母组合');
      //   return;
      // }
      if(this.validateForm.password !== this.validateForm.password2){
        this.$toast('两次密码输入不一致');
        return;
      }
      const formData = {
        new_psw: this.validateForm.password2,
        code: this.validateForm.smscode,
        type: '1',
      }
      this.$http.post('/User/edit', formData).then(response => {
        const res = response.data;
        this.$toast(res.msg);
        if(res.status === 200) {
          this.$toast(res.msg);
          this.$router.push("/Login");
        }
      })
    },
    clickIconEye() {
      this.pwdType = !this.pwdType;
    },
    clickIconEye2() {
      this.pwdType2 = !this.pwdType2;
    }
  }
};
</script>

<style scoped>
.login {
  background-color: #fff;
  height: 100%;
  position: fixed;
  width: 100%;
}
.top {
  font-size: 14px;
  color: #969993;
  margin: 10px 0 40px 0;
}
.login .van-cell-group {
  margin-top: 0;
}
.login .title {
  margin-bottom: 55px;
}
</style>
