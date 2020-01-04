<template>
  <div class="ClubCard">
    <van-nav-bar title="会员卡" left-arrow @click-left="routerBack" />
    <div class="bg">
      <div class="cal">
        <div class="cal_hd">
          <div class="cal_hd_top">
            <img width="60px" height="60px" src="../../assets/img/avatar.png" v-if="!userInfo.headimgurl" />
            <div id='photo' v-else :style="{'backgroundImage':'url(' + userInfo.headimgurl + ')'}"></div>
            <!-- <img width="60px" height="60px" :src="userInfo.headimgurl" v-else /> -->
            <span>{{userInfo.account}}</span>
          </div>
          <div class="cal_hd_bottom">开通即享会员专属权益</div>
        </div>
        <div class="cal_bd" v-if="userInfo.is_effective==2">
          <span>到期日：</span>
          <span>{{userInfo.member_expire}}</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="content_title">
        <div class="content_title_l"></div>
        <div class="content_title_c">三大权益</div>
        <div class="content_title_r"></div>
      </div>
      <div class="list-item">
        <img width="40px" height="40px" src="../../assets/img/equity1.png" />
        <div>
          <div class="title">订制食谱</div>
          <div class="intro">可以得到专属营养师订制的每日配餐和辅导</div>
        </div>
      </div>
      <div class="list-item">
        <img width="40px" height="40px" src="../../assets/img/equity2.png" />
        <div>
          <div class="title">推荐返佣</div>
          <div class="intro">可以通过推荐新会员获得奖金；</div>
        </div>
      </div>
      <div class="list-item">
        <img width="40px" height="40px" src="../../assets/img/equity3.png" />
        <div>
          <div class="title">参加活动</div>
          <div class="intro">参加会员活动</div>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <van-tabbar route active-color="#30362A" inactive-color="#969993" safe-area-inset-bottom>
      <van-button class="common-btn" @click="submit" v-if="userInfo.is_effective==1">开通会员卡</van-button>
      <van-button class="common-btn" @click="submit2" v-if="userInfo.is_effective==2">续费会员卡</van-button>
    </van-tabbar>

    <!--弹出层-->
    <!-- <van-popup v-model="show" round position="bottom" safe-area-inset-bottom closeable >
      <div class="popup_title">请选择支付方式</div>

      <div class="popup">
        <van-cell-group class="popup_select" clickable @click="radio = '1'">
          <div class="popup_left">
            <img src="../../assets/img/Wechat_icon.png" alt />
            <span>微信</span>
          </div>
          <van-radio-group v-model="radio" checked-color="#D94600">
            <van-radio name="1"></van-radio>
          </van-radio-group>
        </van-cell-group>
        <van-cell-group class="popup_select" clickable @click="radio = '2'">
          <div class="popup_left">
            <img src="../../assets/img/zhifubao_icon.png" alt />
            <span>支付宝</span>
          </div>
          <van-radio-group v-model="radio" checked-color="#D94600">
            <van-radio name="2"></van-radio>
          </van-radio-group>
        </van-cell-group>
        <van-button class="btn">确定</van-button>
      </div>
    </van-popup> -->
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  data() {
    return {
      userInfo: {},
      show: true,
      radio: "1"
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        this.userInfo = response.data.data;
        console.log(this.userInfo);
      });
    },
    // 开通会员
    submit() {
      Dialog.confirm({
        title: "确认操作",
        message: "是否开通会员卡"
      })
        .then(() => {
          this.$http.post("/User/becomeMember").then(response => {
            const res = response.data;
            console.log("kaitong", response);
            this.$toast(res.msg);
            if (res.status == 200) {
              this.$toast(res.msg);
              this.$router.back();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    submit2() {
      Dialog.confirm({
        title: "确认操作",
        message: "是否续费会员卡"
      })
        .then(() => {
          this.$http.post("/User/renew").then(response => {
            const res = response.data;
            console.log("xufei", response);
            this.$toast(res.msg);
            if (res.status == 200) {
              this.$toast(res.msg);
              this.$router.back();
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
};
</script>

<style scoped>
.ClubCard {
  padding-top: 0;
}
.bg {
  position: relative;
  min-height: 210px;
  background-image: url(../../assets/img/clubCard_bg.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.van-nav-bar {
  background-color: transparent;
}
.van-nav-bar__left .van-icon {
  color: #fff;
}
.van-nav-bar__title {
  color: #fff;
}
.cal {
  width: 90%;
  min-height: 172px;
  background-image: url(../../assets/img/clubCard.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
  position: absolute;
  top: 72px;
  left: 50%;
  transform: translate(-50%);
  border-radius: 10px;
  /* padding: 22px 26px 10px 26px; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cal_hd {
  padding: 22px 24px;
}
.cal_hd_top {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
#photo {
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.cal_hd_top img {
  border-radius: 50%;
}
.cal_hd_top span {
  margin-left: 10px;
  font-size: 16px;
  color: rgba(67, 54, 30, 1);
}
.cal_hd_bottom {
  font-size: 14px;
  color: rgba(138, 108, 55, 1);
}
.cal_bd {
  border-top: 1px solid #ccab72;
  padding: 10px 24px;
  color: rgba(138, 108, 55, 1);
}
.content {
  padding-top: 55px;
  background-color: #fff;
}
.content_title {
  display: flex;
  justify-content: center;
  align-items: center;
}
.content_title_l {
  width: 24px;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(235, 215, 175, 0.1) 0%,
    rgba(197, 163, 103, 1) 100%
  );
}
.content_title_c {
  font-size: 14px;
  font-weight: bold;
  color: rgba(48, 54, 42, 1);
  margin: 0 10px;
}
.content_title_r {
  width: 24px;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(197, 163, 103, 1) 0%,
    rgba(235, 215, 175, 0.1) 100%
  );
}
.list-item {
  display: flex;
  align-items: center;
  padding: 18px;
}
.title {
  color: rgba(48, 54, 42, 1);
  font-size: 15px;
  font-weight: bold;
}
.intro {
  font-size: 11px;
  color: rgba(150, 153, 147, 1);
}
.list-item img {
  margin-right: 10px;
}
.common-btn {
  margin: 10px 17px;
}

.popup {
  text-align: center;
  padding: 0 25px;
  /* margin-top: 15px; */
}
.popup_title {
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  padding: 13px 0;
  background-color: #f9f9f9;
}
.popup_select {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
}
.popup_left {
  display: flex;
  align-items: center;
}
.popup_left img {
  width: 24px;
  height: 24px;
}
.popup_left span {
  font-size: 15px;
  margin-left: 10px;
}
.btn {
  width: 100%;
  background: rgba(217, 70, 0, 1);
  border: 0;
  border-radius: 30px;
  height: 40px;
  line-height: 40px;
  color: #fff;
  margin: 50px 0;
  /* padding: 140px 17px 30px 17px; */
}
</style>