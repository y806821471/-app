<template>
  <div class="MyFans">
    <van-nav-bar title="我的粉丝" left-arrow @click-left="routerBack" />
    <div class="msg_bd">
      <div class="fansnum">
        <p>{{fansnumber.push_count}}</p>
        <span>全部粉丝</span>
      </div>
      <div class="fansnum">
        <p>{{fansnumber.push_one_count}}</p>
        <span>一级粉丝</span>
      </div>
      <div class="fansnum">
        <p>{{fansnumber.push_two_count}}</p>
        <span>二级粉丝</span>
      </div>
    </div>
    <!-- tab -->
    <van-tabs v-model="active" line-width="40" background="#fff" title-active-color="#D94600"
      title-inactive-color="#969993" line-height="2" >
      <van-tab title="一级会员">
        <van-list class="list" v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div class="list-item" v-for="(item, index) in list" :key="index">
            <div class="left">
              <img width="40px" height="40px" src="../../assets/img/avatar.png" v-if="!item.headimgurl" />
              <img width="40px" height="40px" :src="item.headimgurl" v-else />
              <div>
                <div class="title">{{item.nickname}}</div>
                <div class="data">{{item.created_at}}</div>
              </div>
            </div>
            <div class="right color1" v-if="item.is_effective_name=='未下单'">{{item.is_effective_name}}</div>
            <div class="right color2" v-else>{{item.is_effective_name}}</div>
          </div>
        </van-list>
      </van-tab>
      <van-tab title="二级会员">
        <van-list class="list" v-model="loading2" :finished="finished2" finished-text="没有更多了" @load="onLoad2">
          <div class="list-item" v-for="(item, index) in list2" :key="index">
            <div class="left">
              <img width="40px" height="40px" src="../../assets/img/avatar.png" v-if="item.headimgurl==''" />
              <img width="40px" height="40px" :src="item.headimgurl" v-else />
              <div>
                <div class="title">{{item.nickname}}</div>
                <div class="data">{{item.created_at}}</div>
              </div>
            </div>
            <div class="right color1" v-if="item.is_effective_name=='未下单'">{{item.is_effective_name}}</div>
            <div class="right color2" v-else>{{item.is_effective_name}}</div>
          </div>
        </van-list>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      fansnumber: {}, //粉丝数量
      fansInfo: {}, //信息
      list: [], // 1级会员
      loading: false,
      finished: false,
      page: 1,
      list2: [], // 2级会员
      loading2: false,
      finished2: false,
      page2: 1
    };
  },
  created() {
    this.getFansInfo();
  },
  methods: {
    getFansInfo() {
      this.$http("/User/pushNegative").then(response => {
        console.log(response.data.data.count);
        this.fansnumber = response.data.data.count;
      });
    },
    onLoad() {
      const params = {
        type: "1",
        page: this.page
      };
      this.page++;
      this.$http("/User/pushNegative", { params: params }).then(response => {
        let res = response.data.data.data;
        console.log("粉丝", res);
        this.list = res;
        this.loading = false;
        this.finished = true;
      });
    },
    onLoad2() {
      const params = {
        type: "2",
        page: this.page2
      };
      this.page2++;
      this.$http("/User/pushNegative", { params: params }).then(response => {
        let res = response.data.data.data;
        console.log("粉丝", res);
        this.list2 = res;
        this.loading2 = false;
        this.finished2 = true;
      });
    }
  }
};
</script>

<style scoped>

.msg_bd {
  position: fixed;
  width: 100%;
  top: 66px;
  left: 0;
  z-index: 1;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-between;
  padding: 10px 17px;
}
.van-sticky--fixed {
  top: 150px;
}
.fansnum {
  text-align: center;
}
.msg_bd p {
  font-size: 20px;
  font-weight: 700;
  color: rgba(48, 54, 42, 1);
  margin-bottom: 5px;
}
.msg_bd span {
  font-size: 11px;
  font-weight: 500;
  color: rgba(150, 153, 147, 1);
}
.list {
  width: 100%;
  height: 100%;
  padding: 0 17px;
  margin-top: 115px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 17px 0;
  line-height: 26px;
  border-bottom: solid 1px #f5f5f5;
}
.left {
  display: flex;
  align-items: center;
}
.left img {
  border-radius: 50%;
  margin-right: 10px;
}
.title {
  color: rgba(48, 54, 42, 1);
  font-size: 16px;
}
.data {
  color: rgba(150, 153, 147, 1);
}
.van-image {
  margin-right: 10px;
}
.right {
  font-size: 14px;
}
.color1 {
  color: rgba(150, 153, 147, 1);
}
.color2 {
  color: rgba(217, 70, 0, 1);
}
</style>