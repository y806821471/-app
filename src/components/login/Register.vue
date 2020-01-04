<template>
  <div class="login">
    <van-nav-bar title left-arrow @click-left="routerBack" />
    <van-cell-group>
      <div class="title">注册</div>
      <div class="top">注册成功后可用用户名直接登录</div>
      <van-field v-model="validateForm.username" placeholder="请输入用户名" clearable />
      <!-- 密码显示 -->
      <van-field
        v-model="validateForm.password"
        placeholder="请输入登录密码"
        @click-right-icon="clickIconEye"
        right-icon="closed-eye"
        v-if="pwdType"
      />
      <!-- 密码隐藏 -->
      <van-field
        v-model="validateForm.password"
        type="password"
        placeholder="请输入登录密码"
        @click-right-icon="clickIconEye"
        right-icon="eye-o"
        v-else
      />
      <van-field v-model="validateForm.mobile" type="tel" placeholder="请输入手机号码" clearable />
      <van-field type="tel" v-model="validateForm.smscode" placeholder="请输入验证码">
        <sms-code slot="button" :mobile="validateForm.mobile" @sendCode="sendCode" prop="smscode"></sms-code>
      </van-field>
      <van-field type="tel" v-model="validateForm.invitecode" placeholder="请输入邀请码" clearable />
      <van-button class="common-btn" @click="submit">注册</van-button>
      <div class="bottom">
        已注册？
        <router-link to="/Login">&nbsp;登陆</router-link>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import smsCode from "@/components/bin/smsCode";
export default {
  components: {
    smsCode
  },
  data() {
    return {
      validateForm: {
        username: "", // 用户名
        mobile: "", // 手机号码
        password: "", // 密码
        password2: "", // 密码
        smscode: "", // 验证码
        invitecode: "" // 邀请码
      },
      pwdType: false
    };
  },
  methods: {
    // 验证码
    sendCode() {
      if (!/^[1][3-9][0-9]{9}$/.test(this.validateForm.mobile)) {
        this.$toast("请输入正确的手机号");
        return;
      }
      let publicKey =
        "-----BEGIN PUBLIC KEY-----" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhh0tx4USkRz/w9Cbba02j+D6y" +
        "ON/Oaq+lMgg1w7rh7okvljnCNCFfIfAYlwf+J6D7XXtwJSJQLXQ5ode2ljpbk93m" +
        "NtWafH9+JxIRp37EnsuHaNkVaRx9DIzE+lYgU5BHIZ5QlILDXBAsZk4IxNZt1RS5" +
        "exENFz47MzJHug14TQIDAQAB" +
        "-----END PUBLIC KEY-----";
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey); // 设置公钥
      let mobile = this.validateForm.mobile;
      let securityCode = encryptor.encrypt(
        JSON.stringify({ type: 0, mobile: mobile })
      ); // 进行加密
      const formData = {
        data: securityCode
      };
      this.$http.post("/Index/sendSms", formData).then(response => {
        const res = response.data;
        console.log(res);
        if (res.status == 200) {
          this.$toast("验证码已发送, 请注意查收!");
        } else {
          this.$toast(res.msg);
        }
      });
    },
    // 注册
    submit() {
      // if (!/^[\w\u4e00-\u9fa5]{2,10}$/.test(this.validateForm.username)) {
      //   this.$toast("用户名为3-12位");
      //   return;
      // }
      // if (!/^[1][3-9][0-9]{9}$/.test(this.validateForm.mobile)) {
      //   this.$toast("请输入正确的手机号");
      //   return;
      // }
      // if (!/^\d{4}$/.test(this.validateForm.smscode)) {
      //   this.$toast("验证码为四位数字");
      //   return;
      // }
      // if (!/^(?=.*\d)(?=.*[a-zA-Z]).{6,20}$/.test(this.validateForm.password)) {
      //   this.$toast("密码为6-20位数字字母组合");
      //   return;
      // }
      // if (this.validateForm.password !== this.validateForm.password2) {
      //   this.$toast("两次密码输入不一致");
      //   return;
      // }
      // if (!/^\d{6}$/.test(this.validateForm.dealPassword)) {
      //   this.$toast("交易密码为六位数字");
      //   return;
      // }
      const formData = {
        mobile: this.validateForm.mobile,
        pwd: this.validateForm.password,
        code: this.validateForm.smscode,
        invite_code: this.validateForm.invitecode,
        account: this.validateForm.username
      };
      this.$http.post("/User/register", formData).then(response => {
        const res = response.data;
        this.$toast(res.msg);
        if (res.status === 200) {
          this.$toast("注册成功")
          this.$router.push("/Login");
        }
      });
    },
    // 密码显示隐藏
    clickIconEye() {
      this.pwdType = !this.pwdType;
    }
  }
};
</script>

<style scoped>
.login {
  background-color: #fff;
  height: 100%;

  width: 100%;
}
.top {
  font-size: 14px;
  color: #969993;
  margin: 10px 0 40px 0;
}
.input_title {
  color: #d94600;
  margin-top: 15px;
}
</style>
