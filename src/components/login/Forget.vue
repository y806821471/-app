<template>
  <div class="login">
    <van-nav-bar title left-arrow @click-left="routerBack" />
    <van-cell-group>
      <div class="title">忘记密码</div>
      <div class="top">当前手机号为 <span>{{userInfo.mobile}}</span></div>
      <van-field type="tel" v-model="validateForm.smsCode" placeholder="请输入验证码">
        <sms-code slot="button" :mobile="userInfo.mobile" @sendCode="sendCode" prop="smscode"></sms-code>
      </van-field>
      <!-- 密码显示 -->
      <van-field v-model="validateForm.password" placeholder="请输入登录密码" @click-right-icon="clickIconEye" right-icon="closed-eye" v-if="pwdType"/>
      <!-- 密码隐藏 -->
      <van-field v-model="validateForm.password" type="password" placeholder="请输入登录密码" @click-right-icon="clickIconEye" right-icon="eye-o" v-else/>
      <van-button class="common-btn" @click="submit">确定</van-button>
      <div class="bottom">
        有疑问？<router-link to="/ServiceCenter">&nbsp;联系客服</router-link>
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
      userInfo: {}, //用户信息
      validateForm: {
        smsCode: "", //验证码
        password:"" // 密码 
      },      
      pwdType: false
    };
  },
  created () {
    this.getUserInfo();
  },
  methods: {
    // 用户信息
    getUserInfo () {
      this.$http("User/info").then(response => {
        console.log(response.data.data);
        this.userInfo = response.data.data;
      });
    },
    // 验证码
    sendCode() {
      // if (!/^[1][3-9][0-9]{9}$/.test(this.validateForm.mobile)) {
      //   this.$toast("请输入正确的手机号");
      //   return;
      // }
      let publicKey =
        "-----BEGIN PUBLIC KEY-----" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDhh0tx4USkRz/w9Cbba02j+D6y" +
        "ON/Oaq+lMgg1w7rh7okvljnCNCFfIfAYlwf+J6D7XXtwJSJQLXQ5ode2ljpbk93m" +
        "NtWafH9+JxIRp37EnsuHaNkVaRx9DIzE+lYgU5BHIZ5QlILDXBAsZk4IxNZt1RS5" +
        "exENFz47MzJHug14TQIDAQAB" +
        "-----END PUBLIC KEY-----";
      let encryptor = new JSEncrypt();
      encryptor.setPublicKey(publicKey); // 设置公钥
      let mobile = this.userInfo.mobile;
      console.log(mobile);
      
      let securityCode = encryptor.encrypt(
        JSON.stringify({ type: 0, mobile: mobile })
      ); // 进行加密
      const formData = {
        data: securityCode
      };
      this.$http.post("/Index/sms", formData).then(response => {
        const res = response.data;
        console.log(res);
        if (res.status == 200) {
          this.$toast("验证码已发送, 请注意查收!");
        } else {
          this.$toast(res.msg);
        }
      });
    },
    // 确定
    submit() {
      // if (!/^\d{6}$/.test(this.validateForm.smsCode)) {
      //   this.$toast("验证码为六位数字");
      //   return;
      // }
      const formData = {
        mobile: this.userInfo.mobile,
        new_psw: this.validateForm.password,
        code: this.validateForm.smsCode,
        account: this.userInfo.account
      };
      this.$http.post("/User/forget", formData).then(response => {
        const res = response.data;
        console.log(res);
        this.$toast(res.msg);
        if (res.status === 200) {
          this.$router.push("/Login");
        }
      });
    },
   clickIconEye() {
      this.pwdType = !this.pwdType;
    }
  }
};
</script>

<style scoped>
.login{
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
</style>
