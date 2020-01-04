<template>
  <div class="MyData">
    <van-nav-bar title="个人信息" left-arrow @click-left="routerBack" />
    <ul class="list">
      <li class="list-item">
        <div class="left">头像</div>
        <div class="right">
          <!-- 头像上传 -->
          <div class="cardUp">
            <div class="imgs">
              <img v-if="!avatar" src="../../assets/img/avatar.png" alt />
              <!-- <img id="photo" v-else :src="avatar" /> -->
              <div id='photo' v-else :style="{'backgroundImage':'url(' + avatar + ')'}"></div>
            </div>
            <input class="upLoad" type="file" accept="image/*" @change="doUpload($event)" />
          </div>
          <!-- ----  -->
          <span class="icon">&#xe627;</span>
        </div>
      </li>
      <li class="list-item">
        <div class="left">用户名</div>
        <div class="right">
          <font>{{userInfo.account}}</font>
          <!-- <span class="icon">&#xe627;</span> -->
        </div>
      </li>
      <li class="list-item" @click="getAlter">
        <div class="left">我的姓名</div>
        <div class="right">
          <font v-if="!userInfo.nickname">未设置</font>
          <font v-else>{{userInfo.nickname}}</font>
          <span class="icon"> &#xe627;</span>
        </div>
      </li>

      <li class="list-item" @click="getAlter">
        <div class="left">性别</div>
        <div class="right">
          <font>{{memberInfo.gender}}</font>
          <span class="icon"> &#xe627;</span>
        </div>
      </li>

      <li class="list-item" @click="getAlter">
        <div class="left">出生日期</div>
        <div class="right">
          <font>{{memberInfo.born_at | filterDate}}</font>
          <span class="icon"> &#xe627;</span>
        </div>
      </li>
      <li class="list-item" @click="getAlter">
        <div class="left">身高体重</div>
        <div class="right">
          <font>{{memberInfo.height}}cm/{{memberInfo.weight}}kg</font>
          <span class="icon"> &#xe627;</span>
        </div>
      </li>
      <li class="list-item">
        <div class="left">BMI</div>
        <div class="right">
          <font>{{memberInfo.bmi}}</font>
          <!-- <span class="icon">&#xe627;</span> -->
        </div>
      </li>
    </ul>
    <!--弹出层1（选择性别年龄）-->
    <van-popup v-model="show" round position="bottom" safe-area-inset-bottom closeable>
      <div class="select_sex">
        <div class="select_sex_boy" v-for="(item,index) in tabs" :key="index" @click="addClassName(index)">
          <img :src="item.active" alt v-if="thatnum!=index+1" />
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
    <van-popup v-model="show2" round position="bottom" closeable>
      <div class="show_title">你的身高</div>
      <DLRuler :value="height" :min="100" :max="300" :onChange="changeWeight"></DLRuler>
      <div class="show_title">你的体重</div>
      <DLRuler :value="weight" :min="30" :max="150" :onChange="changeWeight2"></DLRuler>
      <div class="btn2">
        <van-button class="common-btn" @click="submit">完成</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import DLRuler from "@/components/bin/DLRuler";
export default {
  components: { DLRuler },
  data() {
    return {
      userInfo: {},
      memberInfo: {},
      avatar: "", // 头像
      show: false, //弹出层1
      show2: false, //弹出层2
      thatnum: "", //性别
      tabs: [
        {
          img: require("../../assets/img/boy-on.png"),
          active: require("../../assets/img/boy-off.png")
        },
        {
          img: require("../../assets/img/girl-on.png"),
          active: require("../../assets/img/girl-off.png")
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
      mail: ""
    };
  },
  filters: {
    filterDate(date) {
      if (date) {
        return date.substring(0, 10);
      }
    }
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
        this.memberInfo = this.userInfo.member_info;
        this.uid = this.memberInfo.uid;

        this.name = this.userInfo.nickname;
        this.thatnum = this.memberInfo.gender;
        this.dataValue = this.memberInfo.born_at.substring(0, 10);
        this.height = this.memberInfo.height;
        this.weight = this.memberInfo.weight;

        // console.log(this.uid);
        this.avatar = this.userInfo.headimgurl;
        if (this.memberInfo.gender == 1) {
          this.memberInfo.gender = "男";
        } else if (this.memberInfo.gender == 2) {
          this.memberInfo.gender = "女";
        }
      });
    },
    //上传图片
    doUpload(e) {
      this.$http.post("/Index/oss").then(response => {
        const res = response.data.data;
        let OSS = require("ali-oss");
        let file = e.target.files[0];
        let client = new OSS({
          region: res.regionId,
          endpoint: res.endpoint,
          accessKeyId: res.AccessKeyId,
          accessKeySecret: res.AccessKeySecret,
          stsToken: res.SecurityToken,
          bucket: res.bucket
        });
        let randomName =
          new Date().getTime() + "." + file.name.split(".").pop();
        // 上传
        this.$toast.loading({
          forbidClick: true,
          loadingType: "spinner",
          message: "",
          duration: 0
        }); // 持续显示加载
        client
          .put(randomName, file)
          .then(results => {
            this.avatar = results.res.requestUrls[0];
            console.log(results.res.requestUrls[0]);
            const formData = {
              headimgurl: this.avatar
            };
            this.$http.post("/User/nickName", formData).then(response => {
              this.$toast.clear();
              const res = response.data;
              this.$toast(res.msg);
            });
          })
          .catch(err => {
            this.$toast("上传失败！");
          });
      });
    },
    // 性别
    addClassName(index) {
      this.thatnum = index + 1;
      console.log(this.thatnum);
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
      console.log(this.dataValue);
    },
    getNext() {
      if (this.thatnum == "") {
        this.$toast("请选择性别");
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
      console.log(this.height);
    },
    // 体重
    changeWeight2(value) {
      // console.log(value);
      this.weight = value;
      console.log(this.weight);
    },
    submit() {
      const params = {
        gender: this.thatnum,
        born_at: this.dataValue,
        height: this.height,
        weight: this.weight,
        nickname: this.name,
        mail: ""
      };
      this.$http.post("/User/info", params).then(response => {
        console.log(response);
        const res = response.data;
        this.$toast(res.msg);
        if (res.status == 200) {
          this.$toast(res.msg);
          this.getUserInfo();
          this.show2 = false;
        }
      });
    },
    getAlter() {
      this.show = true;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list {
  height: 100%;
  background: #fff;
  font-size: 14px;
  padding: 0 17px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 13px 0;
  border-bottom: 1px solid #f5f5f5;
}
.left {
  color: #30362a;
}
.right {
  display: flex;
  align-items: center;
}
.list > li:last-of-type {
  border: 0;
}
.list-item .icon {
  font-size: 16px;
}
.list-item font {
  color: #969993;
  /* margin-right: 5px; */
}
.van-nav-bar {
  background-color: transparent;
}
.icon {
  color: #969993;
}
.van-image {
  border-radius: 4px;
  overflow: hidden;
}
/* 图片上传 */
.cardUp {
  width: 100%;
  position: relative;
}
/* .imgs {
  width: 60px;
  height: 60px;
} */
#photo {
  border-radius: 4px;
  height: 60px;
  width: 60px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
}
.imgs img {
  height: 60px;
  width: 60px;
  border-radius: 4px;
}
.upLoad {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
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
