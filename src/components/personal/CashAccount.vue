<template>
  <div class="CashAccount">
    <van-nav-bar title="提现账户" left-arrow @click-left="routerBack" />
    <ul class="list">
      <router-link to="/AddWeChat" tag="li">
        <div class="left">
          <img src="../../assets/img/Wechat_icon.png" alt="" width="24px" height="24px">
          <div>微信</div>
        </div>
        <div class="right">
          <span v-if="!weChat">未添加</span>
          <span v-else>{{weChat}}</span>
          <van-icon name="arrow" />
        </div>
      </router-link>
      <router-link to="/AddAlipay" tag="li">
        <div class="left">
          <img src="../../assets/img/zhifubao_icon.png" alt="" width="24px" height="24px">
          <div>支付宝</div>
        </div>
        <div class="right">
          <span v-if="!alipay">未添加</span>
          <span v-else>{{alipay}}</span>
          <van-icon name="arrow" />
        </div>
      </router-link>
    </ul>
  </div>
</template>


<script>
export default {
  data() {
    return {
      bankList: [],
      weChat: "",
      alipay: ""
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      this.$http("/User/bankList").then(response => {
        const res = response.data.data;
        this.bankList = res;
        this.bankList.forEach(item => {
          if (item.type == 1) {
            this.weChat = item.account;
          }
          if (item.type == 2) {
            this.alipay = item.account;
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.list {
  width: 100%;
  padding: 0 3% 0 4%;
  background: #fff;
}
.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: solid 1px #f5f5f5;
}
.list .left {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #30362a;
}
.list .left div {
  margin-left: 10px;
}
.list li:last-of-type {
  border: 0;
}
.list .right {
  color: #969993;
  font-size: 14px;
  display: flex;
  align-items: center;
}
.list .right > span {
  font-size: 14px;
  color: #969993;
}
</style>