<template>
  <div class="withdraw">
    <van-nav-bar title="提现" left-arrow @click-left="routerBack" />
    <div class="content">
      <div class="top">
        <span>提现金额</span>
        <span>可提现：¥{{userInfo.money}}</span>
      </div>
      <van-cell-group>
        <van-field v-model="validateForm.money" type="tel" placeholder="请输入提现金额(10及10的倍数)" />
        <span class="all" @click="getAll">全部</span>
      </van-cell-group>
      <div class="title">到账账户</div>
      <van-cell-group class="select" clickable @click="radio = '1'">
        <div class="left">
          <img src="../../assets/img/Wechat_icon.png" alt />
          <span>微信</span>
        </div>
        <van-radio-group v-model="radio" checked-color="#D94600">
          <van-radio name="1"></van-radio>
        </van-radio-group>
      </van-cell-group>
      <van-cell-group class="select" clickable @click="radio = '2'">
        <div class="left">
          <img src="../../assets/img/zhifubao_icon.png" alt />
          <span>支付宝</span>
        </div>
        <van-radio-group v-model="radio" checked-color="#D94600">
          <van-radio name="2"></van-radio>
        </van-radio-group>
      </van-cell-group>
      <van-button class="common-btn" @click="submit">提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      validateForm: {
        money: ""
      },
      radio: "1",
      bankList: []
    };
  },
  created() {
    this.getBankList();
    console.log("用户信息", this.userInfo);
  },
  methods: {
    getAll() {
      this.validateForm.money = this.userInfo.money;
    },
    // 微信/支付宝 信息获取
    getBankList() {
      this.$http("/User/bankList").then(response => {
        const res = response.data.data;
        console.log(res);
        this.bankList = res;
      });
    },
    submit() {
      if (this.validateForm.money == "") {
        this.$toast("请先输入提现金额");
        return;
      }
      if (this.bankList == "") {
        this.$toast("请先添加提现账号");
        return;
      }
      const formData = {
        num: this.validateForm.money,
        type: this.radio
      };
      this.$http.post("/User/withdraw", formData).then(response => {
        const res = response.data;
        console.log(res);
        this.$toast(res.msg);
        if (res.status == 200) {
          this.$toast(res.msg);
          this.$router.back();
        }
      });
    }
  }
};
</script>

<style scoped>
.content {
  background-color: #fff;
  margin: 10px 17px 60px 17px;
  padding: 28px;
  border-radius: 5px;
}
.van-cell {
  padding: 10px 0;
}
.all {
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  font-size: 14px;
  color: rgba(217, 70, 0, 1);
  font-weight: bold;
}
.top {
  font-size: 14px;
}
.top span:last-child {
  margin-left: 10px;
  font-size: 11px;
  color: rgba(150, 153, 147, 1);
}
.title {
  font-size: 14px;
  margin-top: 30px;
}
.select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
}
.left {
  display: flex;
  align-items: center;
}
.left img {
  width: 24px;
  height: 24px;
}
.left span {
  font-size: 15px;
  margin-left: 10px;
}
.common-btn {
  margin-top: 40px;
}
</style>