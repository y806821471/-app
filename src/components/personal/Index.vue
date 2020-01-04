<template>
  <div class="personal">
    <div class="head">
      <!-- 顶部icon -->
      <div class="head_top">
        <router-link to="/ServiceCenter" class="icon icon_right">&#xe618;</router-link>
      </div>
      <div class="head_centre">
        <div class="msg_hd">
          <div class="msg_hd_left">
            <div class="photo" @click="getMyData">
              <img width="60px" height="60px" src="../../assets/img/avatar.png" v-if="!userInfo.headimgurl"/>
              <!-- <img width="60px" height="60px" :src="userInfo.headimgurl" v-else/> -->
              <div id='photo' v-else :style="{'backgroundImage':'url(' + userInfo.headimgurl + ')'}"></div>
              <img src="../../assets/img/member2.png" alt="" class="member" v-if="userInfo.is_effective == 2">
            </div>
            <div class="name">
              <p>{{userInfo.nickname}}</p>
              <!-- <p v-else>未设置名字</p> -->
              <div class="code">
                <!-- 有邀请码 -->
                <div class="code_left" v-if="userInfo.invite_code !=''">
                  <span>邀请码：</span>
                  <span>{{userInfo.invite_code}}</span>
                </div>
                <!-- 无邀请码 -->
                <div class="code_left" v-else>
                  <span>邀请码：</span>
                  <span>——</span>
                </div>
                <!-- 复制 -->
                <div class="copy" v-clipboard:copy="userInfo.invite_code" v-clipboard:success="onCopy"
                  v-clipboard:error="onError">复制</div>
              </div>
            </div>
          </div>
          <div class="msg_hd_right" @click="showPopup()">
            <div class="icon">&#xe60c;</div>
            <div class="invite">
              邀<br />
              请<br />
              码
            </div>
          </div>
        </div>
        <div class="msg_bd">
          <div @click="getProperty">
            <p>{{userInfo.money}}</p>
            <span>我的资产</span>
          </div>
          <div @click="getMyFans">
            <p>{{userInfo.push_people}}</p>
            <span>我的粉丝</span>
          </div>
        </div>
      </div>
      <!-- 续费会员 -->
      <div class="head_base" v-if="userInfo.is_effective==2">
        <div class="head_base_left">
          <img src="../../assets/img/member1.png" alt />
          <span>{{userInfo.member_expire}}到期</span>
        </div>
        <div class="head_base_right">
          <van-button type="default" round size="small" @click="getRenew">立即续费</van-button>
        </div>
      </div>
      <!-- 开通会员 -->
      <div class="head_base" v-if="userInfo.is_effective==1">
        <div class="head_base_left">
          <img src="../../assets/img/member1.png" alt />
          <span>开通即可享私人定制食谱</span>
        </div>
        <div class="head_base_right">
          <van-button type="default" round size="small" @click="getRenew">立即开通</van-button>
        </div>
      </div>
    </div>
    <!-- ----------------- -->
    <ul class="list">
      <router-link to="/TargetSelection" tag="li">
        <div class="left">
          <div class="icon" style="color:#6E5155;">&#xe7b5;</div>
          <div class="title">目标</div>
        </div>
        <div class="right">
          <span v-if="userInfo.aims">{{userInfo.aims}}</span>
          <span v-else>请选择</span>
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
      <router-link to="/TestingRecord" tag="li">
        <div class="left">
          <div class="icon" style="color:#D6A24D;">&#xe6db;</div>
          <div class="title">自测记录</div>
        </div>
        <div class="right">
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
      <router-link to="/Question" tag="li">
        <div class="left">
          <div class="icon" style="color:#5E9F3F;">&#xe611;</div>
          <div class="title">管家</div>
        </div>
        <div class="right">
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
      <router-link to="/ServiceCenter" tag="li">
        <div class="left">
          <div class="icon" style="color:#485E76;">&#xe646;</div>
          <div class="title">客服</div>
        </div>
        <div class="right">
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
      <router-link to="/SetUp" tag="li">
        <div class="left">
          <div class="icon" style="color:#D25A7F;">&#xe604;</div>
          <div class="title">设置</div>
        </div>
        <div class="right">
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
    </ul>
    <!-- 二维码弹窗 -->
    <van-popup v-if="show" v-model="show" position="bottom">
      <div class="images">
        <img src="../../assets/img/QRcode.png" alt />
        <div class="num">
          <span>{{Invitation[0]}}</span>
          <span>{{Invitation[1]}}</span>
          <span>{{Invitation[2]}}</span>
          <span>{{Invitation[3]}}</span>
          <span>{{Invitation[4]}}</span>
          <span>{{Invitation[5]}}</span>
          <!-- <span>{{userInfo.invite_code}}</span> -->
        </div>
        <!-- 二维码 -->
        <div class="QRcode">
          <div id="qr"></div>
        </div>
        <div class="but" @click="saveImg"></div>
      </div>
    </van-popup>
    <!-- 底部导航 -->
    <app-bar></app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      Invitation: [],
      codeurl: "",
      show: false,
      userInfo: {},
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        console.log(response.data.data);
        this.userInfo = response.data.data;
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
      });
    },
    // 二维码
    getcode() {
      this.$http("/User/getRegister").then(response => {
        this.Invitation = response.data.data.invite_code.split("");
        this.codeurl = response.data.data.url;
        let qr = new QRCode(document.getElementById("qr"), {
          width: 140,
          height: 140,
          colorDark: "#000000",
          colorLight: "rgba(255,255,255,1)"
        });
        qr.makeCode(this.codeurl);
      });
    },
    //复制地址
    onCopy: function(e) {
      this.$toast("复制成功");
    },
    onError: function(e) {
      this.$toast("复制失败");
    },
    // 弹出层
    showPopup() {
      this.show = true;
      this.$nextTick(() => {
        this.getcode();
      });
    },
    getRenew() {
      this.$router.push("/ClubCard");
    },
    getProperty() {
      this.$router.push("/MyProperty");
    },
    getMyFans() {
      this.$router.push("/MyFans");
    },
    getMyData() {
      this.$router.push("/MyData");
    },
    // 截屏+保存
    saveImg(
      successCB,
      errorCB,
      fileName,
      imgID,
      overwrite,
      format,
      quality,
      clip
    ) {
      let that = this;
      setTimeout(() => {
        successCB = successCB || function() {};
        errorCB = errorCB || function() {};
        fileName = fileName || Date.parse(new Date()); //文件名 不需后缀名, 默认当前时间戳
        imgID = imgID || String(Date.parse(new Date())); //原生图片ID, 默认当前时间戳
        overwrite = overwrite || true; //是否覆盖
        format = format || "png"; //保存的格式
        quality = quality || 50; //保存质量，1-100
        clip = clip || {
          top: "0px",
          left: "0px",
          width: "100%",
          height: "90%"
        }; //指定截屏区域
        let self = plus.webview.currentWebview();
        let bitmap = new plus.nativeObj.Bitmap(imgID);
        //绘制截图
        self.draw(
          bitmap,
          function() {
            // 保存Bitmap图片
            bitmap.save(
              "_doc/shareimg.png",
              {
                overwrite: overwrite,
                format: format,
                quality: quality,
                clip: clip
              },
              function(i) {
                //保存到系统相册
                plus.gallery.save(
                  i.target,
                  function(d) {
                    bitmap.clear();
                    that.$toast("已保存至系统相册");
                  },
                  function(e) {
                    bitmap.clear();
                    errorCB({ error: "图片保存失败", details: e });
                  }
                );
              },
              function(e) {
                bitmap.clear();
                that.$toast("图片绘制失败");
              }
            );
          },
          function(e) {
            that.$toast("图片绘制失败");
          }
        );
      }, 100);
    }
  }
};
</script>

<style scoped>
.personal {
  padding-top: 0;
}
.head {
  background: linear-gradient(180deg, #425a26 0%, #577634 100%);
}
.head_top {
  padding: 40px 15px 0 0;
  line-height: 40px;
  text-align: center;
  overflow: hidden;
}
.icon_right {
  width: 40px;
  height: 40px;
  display: block;
  float: right;
}
.head_centre {
  padding: 5px 0 15px 17px;
}
.msg_hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.msg_hd_left {
  display: flex;
  align-items: center;
}
.name {
  margin-left: 7px;
}
.name p {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
  color: #fff;
  padding-left: 5px;
}
.code {
  color: #fff;
  display: flex;
}
.code .code_left {
  padding: 2px 7px;
  border: 1px solid rgb(134, 160, 105);
  border-width: 1px;
  border-radius: 20px 0px 0px 20px;
  border-right: 0;
}
.code .copy {
  padding: 2px 7px;
  overflow: hidden;
  border: 1px solid rgb(134, 160, 105);
  border-radius: 0px 20px 20px 0px;
  border-left: 0;
  background: rgba(255, 255, 255, 0.2);
}
.msg_hd_right {
  display: flex;
  align-items: center;
  border-radius: 22px 0px 0px 22px;
  height: 44px;
  color: #fff;
  padding: 0 15px;
  background: rgba(255, 255, 255, 0.2);
}
.invite {
  padding-left: 6px;
  line-height: 11px;
  font-size: 9px;
}
.msg_bd {
  display: flex;
  color: #fff;
  margin-top: 15px;
}
.msg_bd div {
  margin-right: 60px;
}
.msg_bd p {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}
.msg_bd span {
  font-size: 11px;
}
.head_base {
  margin: 0 17px;
  padding: 10px 17px;
  background: linear-gradient(
    149deg,
    rgba(210, 165, 0, 1) 0%,
    rgba(254, 210, 3, 1) 100%
  );
  border-radius: 10px 10px 0px 0px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.head_base_left {
  display: flex;
  align-items: center;
}
.head_base_left img {
  width: 24px;
  height: 20px;
  margin-right: 8px;
}
.head_base_left span {
  font-size: 14px;
  color: #fff;
}
.van-button--small {
  color: #d2a500;
  font-weight: bold;
  padding: 0 13px;
}
.list {
  width: 100%;
  padding: 0 17px;
  margin-bottom: 65px;
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
.list .left {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #00b1;
}
.left .icon {
  font-size: 20px;
}
.list .left .title {
  color: #30362a;
  font-size: 15px;
  margin-left: 6px;
}
.list .right {
  display: flex;
  align-items: center;
  color: #969993;
  font-size: 14px;
}
.right .icon {
  color: #d8d8d8;
  font-size: 20px;
}
.van-popup {
  background-color: transparent;
}
.van-popup--bottom {
  bottom: 50%;
  transform: translateY(50%);
  left: 0;
  width: 100%;
}
.images {
  position: relative;
}
.images img {
  width: 100%;
}
.num {
  position: absolute;
  bottom: 60%;
  left: 21%;
  font-size: 20px;
  color: #ff2323;
  font-weight: 700;
}
.num span {
  margin: 0 17%;
}
@media only screen and (device-width: 320px) {
  .num span {
    margin: 0 13%;
  }
}
@media only screen and (device-width: 414px) {
  .num span {
    margin: 0 20%;
  }
}
.QRcode {
  /* width: 50%; */
  border-radius: 4px;
  position: absolute;
  bottom: 120px;
  left: 50%;
  transform: translate(-50%);
}
@media only screen and (device-width: 320px) {
  .QRcode {
    border-radius: 4px;
    position: absolute;
    bottom: 95px;
    left: 50%;
    transform: translate(-50%);
  }
}
.QRcode #qr {
  background: #fff;
  height: 155px;
  width: 155px;
  padding: 8px;
  display: flex;
  justify-content: center;
}
.photo {
  position: relative;
}
#photo{
  height: 60px;
  width: 60px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.photo img:first-child {
  border-radius: 50%;
}
.member {
  position: absolute;
  right:0px;
  bottom: 0px;
  width: 20px;
  height: 17px;
}
.but {
  position: absolute;
  left: 0;
  bottom: 10px;
  width: 100%;
  height: 45px;
  border-radius: 25px;
}
</style>