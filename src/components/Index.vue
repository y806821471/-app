<template>
  <div class="Home">
    <div class="head">
      <div class="search">
        <van-search v-model="search" placeholder="请输入您要搜索的关键词" shape="round" @search="onSearch"
          background="transparent" />
        <router-link to="/ServiceCenter" class="icon">&#xe618;</router-link>
      </div>
      <!-- 轮播图 -->
      <div class="banner">
        <van-swipe :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item,index) in banners" :key="index">
            <img :src="item.imgs" alt />
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
    <!-- 中间导航 -->
    <div class="nav">
      <van-grid :border="false" :column-num="4">
        <van-grid-item to="/selfTesting">
          <img src="../assets/img/nav1.png" alt />
          <div>自测</div>
        </van-grid-item>
        <van-grid-item to="/ClubCard">
          <img src="../assets/img/nav2.png" alt />
          <div>会员</div>
        </van-grid-item>
        <van-grid-item @click="$toast('敬请期待')">
          <img src="../assets/img/nav3.png" alt />
          <div>商城</div>
        </van-grid-item>
        <van-grid-item to="/Question">
          <img src="../assets/img/nav4.png" alt />
          <div>管家</div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- Tab 标签页 -->
    <van-tabs v-model="activeName" @click="onClick">
      <van-tab :title="tabs.title" v-for="(tabs,index) in tabList" :key="index" :name="tabs.id">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <router-link :to="{path:'/MessageDetails',query:{id:item.id}}" tag="li" v-for="(item,index) in newsList"
            :key="index" class="ore-item">
            <div class="left">
              <img :src="item.screen_shot" alt />
            </div>
            <div class="right">
              <p>{{item.title}}</p>
              <span>{{item.created_at.substring(0,16)}}</span>
            </div>
          </router-link>
        </van-list>
      </van-tab>
    </van-tabs>
    <!--弹出层1（选择性别年龄）-->
    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom :close-on-click-overlay="false">
      <div class="select_sex">
        <div class="select_sex_boy" v-for="(item,index) in tabs" :key="index" @click="addClassName(index)">
          <img :src="item.active" v-if="thatnum!=index+1" alt/>
          <img :src="item.img" v-if="thatnum==index+1" alt />
        </div>
      </div>
      <van-cell-group>
        <van-field v-model="name" placeholder="姓名" clearable />
      </van-cell-group>
      <div class="time">
        <div class="age">{{timeAge}}</div>
        <van-field v-model="dataValue" placeholder="请选择出生日期" @click="showPopup" />
        <van-popup v-model="dataShow" position="bottom" round>
          <van-datetime-picker @cancel="Cancel" @confirm="Confirm" v-model="currentDate" type="date" :min-date="minDate"
            :max-date="maxDate" />
        </van-popup>
      </div>
      <div class="btn">
        <van-button class="common-btn" @click="getNext">下一步</van-button>
      </div>
    </van-popup>
    <!-- 弹出层2 （选择身高体重）-->
    <van-popup v-model="show2" round position="bottom" :close-on-click-overlay="false">
      <div class="show_title">你的身高</div>
      <DLRuler :value="height" :min="100" :max="300" :onChange="changeWeight"></DLRuler>
      <div class="show_title">你的体重</div>
      <DLRuler :value="weight" :min="30" :max="150" :onChange="changeWeight2"></DLRuler>
      <div class="btn2">
        <van-button class="common-btn" @click="submit">完成</van-button>
      </div>
    </van-popup>

    <!-- 底部导航 -->
    <app-bar></app-bar>
  </div>
</template>

<script>
import DLRuler from "@/components/bin/DLRuler";
// import { log } from "util";
export default {
  components: { DLRuler },
  data() {
    return {
      userInfo: {},
      search: "", //搜索框
      activeName: 1,
      banners: [], // 轮播图
      newsList: [], // 新闻列表
      tabList: [],
      id: "",
      page: 1,
      loading: false,
      finished: false,

      show: false, //弹出层1
      show2: false, //弹出层2
      thatnum: "", //性别
      tabs: [
        {
          img: require("../../src/assets/img/boy-on.png"),
          active: require("../../src/assets/img/boy-off.png")
        },
        {
          img: require("../../src/assets/img/girl-on.png"),
          active: require("../../src/assets/img/girl-off.png")
        }
      ],
      dataShow: false, //日期选择
      name: "", //姓名
      dataValue: "", //时间
      timeAge: "", // 年龄
      currentDate: new Date(1998, 5, 15), //默认选中时间
      minDate: new Date(1930, 0, 1), //最小
      maxDate: new Date(), //最大
      height: "", //身高
      weight: "", //体重
      mail: "",
      memberInfo: ""
    };
  },
  created() {
    this.getUserInfo();
    this.getBanners();
    this.getNewsCategory();
  },
  methods: {
    // 搜索
    onSearch() {},
    // 轮播图
    getBanners() {
      this.$http("/System/bannerList").then(response => {
        // console.log("轮播图：", response.data.data);
        const res = response.data.data;
        this.banners = res;
      });
    },
    onClick() {
      this.page = 1;
      this.onLoad();
    },
    // 新闻类别
    getNewsCategory() {
      this.$http("/System/newsCategory").then(response => {
        // console.log("新闻类别",response);
        const res = response.data.data;
        this.tabList = res;
      });
    },
    // 新闻列表
    onLoad() {
      const params = {
        category_id: this.activeName,
        page: this.page
      };
      this.page++;
      this.$http("/System/newsList", { params: params }).then(response => {
        const res = response.data.data.data;
        if (response.data.status == 200) {
          this.newsList = res;
        }
        this.loading = false;
        this.finished = true;
      });
    },
    // 性别
    addClassName(index) {
      this.thatnum = index + 1;
      // console.log(this.thatnum);
      if(this.thatnum == 1){
        this.height = 175;
        this.weight = 65;
      }else{
        this.height = 160;
        this.weight = 45;
      }
    },
    // 时间选择
    showPopup() {
      this.dataShow = true;
    },
    // 时间选择取消按钮
    Cancel() {
      this.dataShow = false;
    },
    // 时间选择确认按钮
    Confirm() {
      this.dataShow = false;
      var date = this.currentDate;
      var dateTime =
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      var age = new Date().getFullYear() - date.getFullYear() + "岁";
      this.dataValue = dateTime;
      this.timeAge = age;
    },
    getNext() {
      if (this.thatnum == "") {
        this.$toast("请选择性别");
        return;
      }
      if (this.name == "") {
        this.$toast("请输入姓名");
        return;
      }
      if (this.dataValue == "") {
        this.$toast("请选择出生日期");
        return;
      }
      this.show = false;
      this.show2 = true;
    },
    // 身高
    changeWeight(value) {
      // console.log(value);
      this.height = value;
    },
    // 体重
    changeWeight2(value) {
      // console.log(value);
      this.weight = value;
    },
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        console.log(response.data.data);
        this.userInfo = response.data.data;
        this.memberInfo = this.userInfo.member_info;
        // console.log(this.memberInfo);
        if (this.memberInfo.height == "") {
          this.show = true;
        }
      });
    },
    submit() {
      const params = {
        gender: this.thatnum,
        nickname: this.name,
        born_at: this.dataValue,
        height: this.height,
        weight: this.weight,
        mail: ""
      };
      this.$http.post("/User/info", params).then(response => {
        console.log(response);
        const res = response.data;
        this.$toast(res.msg);
        if (res.status == 200) {
          this.$toast(res.msg);
          this.show2 = false;
        }
      });
    }
  }
};
</script>
<style scoped>
.Home {
  padding-top: 0;
}
#app {
  background-color: #f9f9f9;
}
.head {
  background: linear-gradient(180deg, #425a26 0%, #577634 100%);
  height: 210px;
}
.search {
  z-index: 2;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 45px 17px 10px 17px;
  display: flex;
  justify-content: space-between;
  background: linear-gradient(180deg, #425a26 0%, #4b662c 100%);
}
.search .van-search__content {
  background: rgba(255, 255, 255, 0.2);
}
.icon {
  width: 30px;
  height: 30px;
  margin: 5px 0 0 10px;
}
.banner {
  padding: 90px 17px 0 17px;
}
.van-cell {
  color: #d8d8d8;
}
.nav {
  margin-top: 26px;
}
.van-grid-item__content img {
  width: 60px;
  height: 60px;
}
.van-grid-item__content div {
  margin-top: 5px;
}
.ore-item {
  padding: 10px 17px;
  display: flex;
}
.left {
  width: 85px;
  height: 70px;
  background-color: #eee;
}
.left img {
  width: 100%;
  height: 100%;
}
.right {
  width: 70%;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.right p {
  font-size: 15px;
  color: #30362a;
}
.right span {
  color: #969993;
}
/* 搜索框 */
.search .van-search {
  padding: 0;
  width: 100%;
}
.search .van-search__action {
  padding: 0 17px;
  color: #fff;
}

.search .van-field__control {
  color: #d8d8d8;
}
.search ::-webkit-input-placeholder {
  color: #d8d8d8;
  font-size: 13px;
}
/* 轮播 */
.van-swipe {
  border-radius: 8px;
  height: 145px;
}
.van-swipe img {
  width: 100%;
  height: 100%;
}
/* 弹出层1 */
.select_sex {
  display: flex;
  justify-content: space-between;
  align-content: center;
  padding: 50px 68px;
}
.select_sex_boy {
  width: 90px;
  height: 90px;
}
.select_sex_boy img {
  width: 100%;
}
.van-cell-group {
  padding: 0 17px;
  margin-bottom: 10px;
}
.time {
  position: relative;
  padding: 0 17px;
}
.age {
  position: absolute;
  top: 49%;
  left: 125px;
  z-index: 1;
  transform: translateY(-50%);
  font-size: 14px;
}
.btn {
  padding: 140px 17px 30px 17px;
}
.btn2 {
  padding: 35px 17px 15px 17px;
}
/* 弹出层2 */
.show_title {
  text-align: center;
  font-size: 21px;
  margin-top: 33px;
}
</style>