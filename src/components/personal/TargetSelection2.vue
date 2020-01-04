<template>
  <!-- 调查问卷 -->
  <div class="TargetSelection">
    <!-- 顶部 -->
    <van-nav-bar title="膳食调查选择题" left-arrow @click-left="routerBack" />
    <!-- 进度条 -->
    <van-progress color="#597837" :percentage="per" />
    <!-- 选择题部分 -->
    <div v-for="(item,index) in list" :key="item.id">
      <div v-if="answerIndex == index+1">
        <div class="title">{{item.question}}</div>
        <!-- 单选框 -->
        <div class="content">
          <van-radio-group v-model="radio">
            <van-cell-group v-for="(answer,id) in item.answer_list" :key="id">
              <van-cell :title="answer.answer" clickable @click="radio =answer.id">
                <van-radio slot="right-icon" :name="answer.id" checked-color="#597837" />
              </van-cell>
            </van-cell-group>
          </van-radio-group>
        </div>
        <!-- 复选框 -->
        <!-- <div v-show="item.check_type == 3" class="content">
          <van-checkbox-group v-model="result">
            <van-cell-group v-for="(answer,id) in item.answer_list" :key="id">
              <van-cell :title="answer.answer" @click.native="toggle(answer.id,id)" clickable>
                <van-checkbox :name="answer.id" ref="checkboxes" slot="right-icon" checked-color="#597837"
                  shape="square" />
              </van-cell>
            </van-cell-group>
          </van-checkbox-group>
        </div> -->
      </div>
    </div>
    <!-- 底部 -->
    <van-tabbar safe-area-inset-bottom>
      <van-button class="common-btn" @click="submit" data-index="index" ref="nextclick">下一步</van-button>
    </van-tabbar>
  </div>
</template>

<script>
let formData = [];
export default {
  data() {
    return {
      radio: "",
      result: [],
      list: [], //数据列表
      answerIndex: 1, // 题目索引
      questionId: "",
      answerId: "" //
    };
  },
  created() {
    this.getList();
  },
  computed: {
    per() {
      if (this.list.length > 0) {
        return (this.answerIndex / this.list.length) * 100;
      }
      return 1;
    }
  },
  watch: {
    answerIndex(newV, oldV) {
      // console.log(newV, oldV);
      if (this.answerIndex == this.list.length) {
        this.$refs.nextclick.innerText = "提交";
        return;
      }
    }
  },
  methods: {
    toggle(id, index) {
      // console.log(id);
      this.$refs.checkboxes[index].toggle();
    },
    // 获取列表信息
    getList() {
      this.$http("/Food/questionList", {
        params: {
          type: "1"
        }
      }).then(response => {
        this.list = response.data.data.data;
        console.log(this.list);
      });
    },
    // 提交
    submit() {
      this.list.forEach((i, index) => {
        if (this.answerIndex == index + 1) {
          this.questionId = i.id;
          this.answerId = this.radio.toString();
        }
      });
      console.log(this.answerId);
      
      if (this.answerId == "") {
        this.$toast("请选择选项，然后继续");
        return;
      }
      this.result = [];
      this.answerIndex++;
      formData.push({ question_id: this.questionId, answer_id: this.answerId });
      this.radio='';
      console.log(formData);
      if (this.answerIndex - 1 == this.list.length) {
        const params = {
          form_data: JSON.stringify(formData),
          type: 1
        };
        // return;
        this.$http.post("/Food/questionSubmit", params).then(response => {
          const res = response.data;
          console.log(res);
          localStorage.setItem("formData", JSON.stringify(formData));
          this.$router.back();
          this.$toast(res.msg);
          // this.$router.push({ name: "DietList",  params:{formData:formData}});   
        });
      }
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background-color: #f9f9f9;
}
.van-progress__pivot {
  font-size: 0;
}

.content {
  margin-top: 20px;
  margin-bottom: 70px;
}
.van-radio-group {
  padding: 0 17px;
}
.van-cell-group {
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.04);
}
.van-checkbox-group {
  padding: 0 17px;
}
.van-cell {
  padding: 17px;
  border-radius: 8px;
}
.van-cell::after {
  border: 0;
}
.title {
  font-size: 21px;
  font-weight: bold;
  text-align: center;
  padding: 0 17px;
  margin-top: 20px;
  
}
.common-btn {
  margin: 10px 17px;
}
</style>