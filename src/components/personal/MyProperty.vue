<template>
  <div class="MyProperty">
    <div class="p_fixed">
      <van-nav-bar title="资产" left-arrow @click-left="routerBack" :fixed='false' />
      <div class="head">
        <div class="head_left">
          <p>总资产(元)</p>
          <b>{{userInfo.money}}</b>
        </div>
        <div class="head_right" @click="getWithdraw">
          <span>提现</span>
          <span class="icon">&#xe627;</span>
        </div>
      </div>
    </div>
    <div class="centre">资产明细</div>
    <!-- ----------------- -->
    <ul class="list">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <li v-for="(item,index) in list" :key="index">
          <div class="left">
            <div class="title">{{item.status_name}}</div>
            <div class="data">{{item.created_at | filterDate}}</div>
          </div>
          <div class="right color-green" v-if="item.num >= 0">+{{parseInt(item.num).toFixed(2)}}</div>
          <div class="right color-red" v-if="item.num < 0">{{parseInt(item.num).toFixed(2)}}</div>
        </li>
      </van-list>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem("userInfo")),
      loading: false,
      finished: false,
      list: {}
    };
  },
  created() {
    // this.getDetail();
    console.log("用户信息", this.userInfo);
  },
  filters: {
    filterDate(date) {
      return date.substring(0, 16);
    },
  },
  methods: {
    // 明细
    onLoad() {
      this.$http("/User/moneyLog").then(response => {
        // console.log(response);
        const res = response.data.data.data;
        console.log(res);
        if (res.status = 200) {
          this.list = res;
        }
        this.loading = false;
        this.finished = true;
      });
    },
    getWithdraw() {
      this.$router.push("/Withdraw");
    }
  }
};
</script>

<style scoped>
.MyProperty {
  padding-top: 0;
}
.p_fixed{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
}
.van-nav-bar {
  /* background: linear-gradient(180deg, #425a26 0%, #577634 100%); */
  background-color: transparent;
  position: absolute;
}
.van-nav-bar__left .van-icon {
  color: #fff;
}
.van-nav-bar__title {
  color: #fff;
}
.head {
  background: linear-gradient(180deg, #425a26 0%, #577634 100%);
  color: #fff;
  padding-top: 66px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head_left {
  padding: 28px 18px;
}
.head_left b {
  font-size: 30px;
}
.head_right {
  display: flex;
  align-items: center;
  border-radius: 22px 0px 0px 22px;
  color: #fff;
  padding: 5px 5px 5px 15px;
  background: rgba(255, 255, 255, 0.2);
}
.head_right span {
  font-size: 14px;
  padding-right: 5px;
}
.centre {
  margin-top: 181px;
  line-height: 32px;
  text-align: center;
  color: #969993;
}
.list {
  width: 100%;
  padding: 0 17px;
  margin-bottom: 10px;
  background-color: #fff;
}
.list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: solid 1px #f5f5f5;
}
.list li:last-child {
  border-bottom: 0;
}
.left .title {
  font-size: 15px;
  color: rgba(48, 54, 42, 1);
  font-weight: bold;
  margin-bottom: 5px;
}
.left .data {
  color: rgba(150, 153, 147, 1);
}
.right {
  font-weight: 500;
  color: rgba(217, 70, 0, 1);
  font-size: 18px;
}
.color-green {
  color: rgba(82, 111, 49, 1);
}
.color-red {
  color: rgba(217, 70, 0, 1);
}
</style>