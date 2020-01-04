<template>
  <div class="Question">
    <div class="head">
      <van-nav-bar title="管家" left-arrow @click-left="routerBack" />
      <div class="icon icon_right" @click="getQuestionList">&#xe611;</div>
    </div>
    <van-cell-group>
      <div class="title">Hi～有什么需要反馈？</div>
      <van-field type="textarea" v-model="validateForm.question" placeholder="请详细描述您遇到的问题（必填）" />
      <div class="phone">
        <div class="title2">联系方式（非必填）</div>
        <van-field v-model="validateForm.mobile" type="tel" placeholder="请输入联系方式" clearable />
      </div>
    </van-cell-group>
    <!-- 底部 -->
    <van-tabbar  safe-area-inset-bottom>
      <van-button class="common-btn" @click="submit">提交</van-button>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      validateForm: {
        question: "",
        mobile: ""
      }
    };
  },
  created() {
  },
  methods: {
    submit() {
      if (
        this.validateForm.question.trim() === "" ||
        this.validateForm.question.trim().length < 10 ||
        this.validateForm.question.trim().length > 240
      ) {
        this.$toast("请输入问题，长度10-240");
        return;
      }
      const formData = {
        content: this.validateForm.question,
        imgs:""

      };
      this.$http.post("/System/issue", formData).then(response => {
        const res = response.data;
        if (res.status === 200) {
          this.$router.push("/QuestionList");
        }
        this.$toast(res.msg);
      });
    },
    getQuestionList() {
      this.$router.push("/QuestionList");
    }
  }
};
</script>

<style scoped>
.head {
  position: relative;
}
.van-nav-bar {
  background-color: transparent;
}
.icon_right {
  position: absolute;
  right: 17px;
  top: -30px;
  color: #969993;
  font-size: 18px;
  z-index: 2;
}
.title {
  font-size: 21px;
  color: rgba(48, 54, 42, 1);
  font-weight: bold;
  margin-bottom: 24px;
}
.van-cell-group {
  padding: 20px 4%;
  background: #F9F9F9;

}
.van-cell {
  padding: 10px 4%;
  min-height: 180px;
  border-radius: 5px;
  background: #F9F9F9;
  border: solid 0.5px #e2e2e2;
}
.common-btn {
  margin-top: 30px;
}
.title2 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 25px;
}
.phone .van-cell {
  border: 0;
  min-height: 20px;
  padding: 10px 0;
}
.common-btn{
  margin:10px 17px;
}
</style>