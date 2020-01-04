<template>
  <div class="SetUp">
    <van-nav-bar title="设置" left-arrow @click-left="routerBack" />
    <ul class="list">
      <div class="item">
        <router-link to="/AlterEmail" tag="li" class="list-item">
          <div class="left">邮箱</div>
          <div class="right">
            <font v-if="!mail">未设置</font>
            <font>{{mail}}</font>
            <span class="icon">&#xe627;</span>
          </div>
        </router-link>
        <li class="list-item">
          <div class="left">手机号码</div>
          <div class="right">
            <font>{{userInfo.mobile}}</font>
            <span class="icon">&#xe627;</span>
          </div>
        </li>
      </div>
      <div class="item">
        <router-link to="/Password" tag="li" class="list-item">
          <div class="left">登录密码</div>
          <div class="right">
            <span class="icon">&#xe627;</span>
          </div>
        </router-link>
        <router-link to="/CashAccount" tag="li" class="list-item">
          <div class="left">提现账户</div>
          <div class="right">
            <font v-if="!account">未设置</font>
            <font v-else>已设置</font>
            <span class="icon">&#xe627;</span>
          </div>
        </router-link>
      </div>
      <div class="item">
        <li class="list-item">
          <div class="left">
            <div>关于我们</div>
          </div>
          <div class="right">
            版本V{{version}}
            <span class="icon">&#xe627;</span>
          </div>
        </li>
      </div>
    </ul>
    <!-- 版本弹出 -->
    <van-button size="large" hairline @click="dropOut">退出登录</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {},
      accountInfo: [],
      mail: "",
      account:"",
      version: "1.0"
    };
  },
  mounted() {
    this.getUserInfo();
    this.getAccountInfo();
  },
  methods: {
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        this.userInfo = response.data.data;
        this.mail = this.userInfo.member_info.mail;
      });
    },
    // 微信/支付宝 信息获取
    getAccountInfo() {
      this.$http("/User/bankList").then(response => {
        const res = response.data.data;
        this.accountInfo = res;
        this.accountInfo.forEach(item =>{
          this.account = item.account
          console.log( this.account);
          
        })
      });
    },
    // 退出
    dropOut() {
      localStorage.clear();
      sessionStorage.clear();
      this.$http.defaults.headers.token = "";
      this.$router.push("/Login");
    }
  }
};
</script>

<style scoped>
.list {
  height: 100%;
  /* background: #fff; */
  font-size: 14px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f5f5f5;
}
.item {
  margin-bottom: 10px;
  padding: 0 17px;
  background: #fff;
}
.left {
  color: #30362a;
}
.right {
  display: flex;
  align-items: center;
  color: #969993;
}
/* .list > li:last-of-type {
  border: 0;
} */
.list-item .icon {
  font-size: 16px;
  color: #969993;
}
.list-item font {
  color: #969993;
  margin-right: 5px;
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
</style>