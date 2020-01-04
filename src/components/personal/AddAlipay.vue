<template>
  <div class="card">
    <van-nav-bar title="支付宝" left-arrow @click-left="routerBack" right-text="保存" @click-right="submit" />
    <van-cell-group>
      <div class="title">账号</div>
      <!-- label="账号" -->
      <van-field v-model="validateForm.account" placeholder="请输入支付宝账号" />
      <div class="cardUp">
        <p>上传收款码</p>
        <div class="img">
          <img v-if="!qrCode" src="../../assets/img/qrCode2.png" alt="">
          <img v-else :src="qrCode">
        </div>
        <input class="upLoad" :disabled="isAdd" type="file" accept="image/*" @change="doUpload($event)">
      </div>
      <!-- <van-button class="common-btn" @click="submit">保存</van-button> -->
    </van-cell-group>
  </div>
</template>

<script>
export default {
  name: "AddWeChat",
  data() {
    return {
      validateForm: {
        account: ""
      },
      qrCode: "",
      id: "",
      isAdd: false,
      edit: false
    };
  },
  created() {
    this.getInfo();
    if (parseInt(this.times) >= 3) {
      this.isAdd = true;
    }
  },
  methods: {
    // 获取信息
    getInfo() {
      const params = {
        type: "2"
      };
      this.$http("/User/bankList", { params: params }).then(response => {
        const res = response.data.data;
        console.log("支付宝", res);
        if (res != "") {
          this.validateForm.account = res[0].account;
          this.qrCode = res[0].account_img;
          this.id = res[0].id;
          this.edit = true;
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
          .put(randomName, file, {
            progress: function*(percentage, cpt) {}
          })
          .then(results => {
            this.$toast.clear();
            this.qrCode = results.res.requestUrls[0];
          })
          .catch(err => {
            this.$toast("上传出错了");
          });
      });
    },
    submit() {
      if (this.validateForm.account.trim() == "") {
        this.$toast("请输入账号");
        return;
      }
      if (this.qrCode == "static/images/qrcode-bg.png") {
        this.$toast("请上传收款码");
        return;
      }
      const formData = {
        type: "2",
        account: this.validateForm.account,
        account_img: this.qrCode
      };
      const formData2 = {
        type: "2",
        account: this.validateForm.account,
        account_img: this.qrCode,
        bank_id: this.id
      };
      if (this.edit == true) {
        this.$http.post("/User/bankAdd", formData2).then(response => {
          this.$toast(response.data.msg);
          // console.log("修改",response);
          if (response.data.status === 200) {
            this.times++;
            this.getInfo();
            this.$router.back();
          }
        });
      } else {
        // 添加
        this.$http.post("/User/bankAdd", formData).then(response => {
          this.$toast(response.data.msg);
          // console.log("添加",response);
          if (response.data.status === 200) {
            this.times++;
            this.getInfo();
            this.$router.back();
          }
        });
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.van-cell-group {
  padding: 20px 17px;
}
.van-cell {
  padding: 10px 0 5px 0;
}
.van-field__label {
  min-width: 120px;
}
.title {
  color: #30362a;
  font-size: 16px;
}
.cardUp {
  width: 100%;
  text-align: center;
  position: relative;
  margin-top: 20px;
}
.cardUp p {
  text-align: left;
  font-size: 16px;
  margin-bottom: 15px;
}
.cardUp img {
  height: 140px;
  width: 140px;
  border-radius: 5px;
}
.upLoad {
  opacity: 0;
  position: absolute;
  top: 34px;
  left: 0;
  width: 100%;
  height: 140px;
}
.common-btn {
  margin-top: 60px;
}
.van-nav-bar__text {
  color: rgba(248, 54, 0, 1);
  background: transparent;
  font-size: 15px;
}
.van-nav-bar .van-nav-bar__right {
  height: 40px;
  line-height: 40px;
}
</style>
