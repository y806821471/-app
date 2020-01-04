<template>
  <div class="AddFood">
    <van-nav-bar title="选择食物" left-arrow @click-left="routerBack" />
    <van-tabs v-model="activeName" sticky line-height="0" title-active-color="#577634" title-inactive-color="#969993"
      background="#F9F9F9" @click="onClick">
      <van-tab v-for="(tabs,index) in categoryList" :key="index" :name="tabs.id">
        <!-- 标签 -->
        <div slot="title" class="title">
          <img :src="tabs.imgs" alt />
          <img class="imgShade" src="../../assets/img/shade.png" alt v-if="activeName == tabs.id" />
          {{tabs.name}}
        </div>
        <!-- 内容 -->
        <van-list v-model="loading" :finished="finished" finished-text="" @load="onLoad">
          <li class="content" v-for="(item,index) in foodList" :key="index">
            <div class="content_left">
              <div @click="getSelect(item)" class="option">
                <div class="foodimg" >
                  <img :src="item.imgs" alt="">
                  <img src="../../assets/img/shade.png" alt="" class="duihao" v-if="foodListId.indexOf(item.id)>=0">
                </div>
                <div class="foodName">{{item.name}}</div>
              </div>

              <div class="clickHint">
                <van-icon name="question-o" @click="getHint(item.id)" />
                <!-- ？提示框-->
                <div class="content_hint" v-if="hint && hintId == item.id">
                  <div class="description">{{item.description}}</div>
                  <!-- <div>1{{item.unit}}{{item.name}}={{Math.ceil(item.kcal)}}kcal/{{Math.ceil(item.protein)}}g蛋白质</div> -->
                  <van-icon name="cross" @click="offHint" />
                  <div class="triangle"></div>
                  <div class="coverup"></div>
                </div>
              </div>
            </div>
            <div class="content_right">
              <!-- 步进器 -->
              <van-stepper min="1" max="20" integer @change="change(item.id,$event)" />
              <!-- 爱心 -->
              <div @click="getSelect(item)">
                <div class="icon red_icon" v-if="foodListId.indexOf(item.id)>=0">&#xe658;</div>
                <div class="icon" v-else>&#xe658;</div>
              </div>
              <!-- 单位  -->
              <div class="units">{{item.unit}}</div>
            </div>
          </li>
        </van-list>
      </van-tab>
    </van-tabs>
    <!-- 底部 -->
    <van-tabbar safe-area-inset-bottom>
      <van-button class="common-btn" @click="submit">我选好了</van-button>
    </van-tabbar>
  </div>
</template>

<script>
// import Bus from "../../../public/js/bus";
export default {
  data() {
    return {
      activeName: 1,
      hint: false, // 提示框的显示隐藏
      red: false, // 选中状态样式
      value: "", // 步进器值
      categoryList: {}, // 食物种类
      foodList: {}, // 食物列表
      foodList2: [],
      foodList3: [],
      loading: false,
      finished: false,
      page: 1,
      foodListId: [],
      hintId: "",
      dataList: []
    };
  },
  created() {
    this.getCategoryList();
    this.dataList = this.$store.state.titleList;
  },
  methods: {
    // 获取食物种类
    getCategoryList() {
      this.$http("/Food/categoryList").then(response => {
        const res = response.data.data.data;
        if (response.status == 200) {
          this.categoryList = res;
        }
      });
    },
    // 获取所有食物列表
    onLoad() {
      this.$http("/Food/foodList").then(response => {
        const res = response.data.data.data;
        if (response.status == 200) {
          this.foodList = res.filter(
            item => item.category_id == this.activeName
          );
          this.foodList2 = res;
          this.foodList3 = res;
          //        this.foodList.forEach((val) => {
          //          // 步进器固定值
          //          this.$set(val, "num", 1);
          //        });

          this.foodList3.forEach(val => {
            // 步进器固定值
            this.$set(val, "num", 1);
          });
        }
        this.loading = false;
        this.finished = true;
      });
    },
    onClick() {
      this.hint = false;
      this.foodList = this.foodList2.filter(
        item => item.category_id == this.activeName
      );
      this.foodList2 = this.foodList3;
    },
    // 选中
    getSelect(item) {
      var ids = this.foodListId.indexOf(item.id);
      if (ids >= 0) {
        this.foodListId.splice(ids, 1);
      } else {
        this.foodListId.push(item.id);
      }
    },
    change(id, value) {
      //    this.foodList.forEach((val) => {
      //      if (id == val.id) {
      //        this.$set(val, "num", value);
      //      }
      //    });
      this.foodList3.forEach(val => {
        if (id == val.id) {
          this.$set(val, "num", value);
        }
      });
    },
    // 提示框
    getHint(id) {
      this.hintId = id;
      this.hint = true;
    },
    // 关闭提示框
    offHint() {
      this.hint = false;
    },
    // 提交
    submit() {
      console.log(this.dataList);
      let arr = this.foodList3;
      let newArr = [];
      this.foodListId.forEach(val => {
        arr.forEach(v => {
          if (val == v.id) {
            newArr.push(v);
          }
        });
      });
      console.log(newArr);

      this.$store.commit("SET_titleList", this.dataList);
      this.$store.commit("SET_newArr", newArr);
      setTimeout(() => {
        this.$router.push({
          name: "DietList",
          query: { name: this.$route.query.name }
        });
      }, 200);
    },
    routerBack() {
      this.$router.push("/DietList");
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background: #f9f9f9ff;
}
.title {
  position: relative;
  font-size: 15px;
}
.title img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 5px;
}
.imgShade {
  position: absolute;
  top: 4px;
  left: 0;
  width: 35px;
  height: 35px;
}
.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f5f5f5ff;
  padding: 13px 0;
}
.content:last-child {
  border: 0;
}
.content_left {
  display: flex;
  align-items: center;
}
.option{
  display: flex;
  align-items: center
}
.foodimg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: relative;
  margin-right: 8px;
  overflow: hidden;
}
.foodimg img {
  width: 100%;
  height: 100%;
}
.duihao {
  position: absolute;
  top: 0;
  left: 0;
}
.clickHint {
  position: relative;
}
.foodName {
  font-size: 15px;
  margin-right: 5px;
}
.content_left .van-icon-question-o {
  font-size: 16px;
  color: #969993ff;
  padding-top: 6px;
}
.content_right {
  display: flex;
  align-items: center;
  position: relative;
}
.content_right .icon {
  border: 1px solid rgba(226, 226, 226, 1);
  border-left: 0;
  border-radius: 0px 4px 4px 0px;
  padding: 5px 7px;
}
.red_icon {
  color: #d94600ff;
}
/* 单位 */
.units {
  position: absolute;
  top: 50%;
  left: 66px;
  transform: translateY(-50%);
  color: rgba(150, 153, 147, 1);
  font-size: 14px;
}
/* 提示框 */
.content_hint {
  z-index: 1;
  position: absolute;
  top: 33px;
  left: -38px;
  /* min-width: 210px; */
  background-color: #fff;
  box-shadow: 0px 0px 7px 0px rgba(225, 225, 225, 0.5);
  border: 1px solid rgba(226, 226, 226, 1);
  border-radius: 30px;
  padding: 9px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #969993ff;
  box-sizing: border-box;
}
.description {
  white-space: nowrap;
}
.content_hint .van-icon-cross {
  font-size: 14px;
  margin-left: 15px;
}
/* 三角形 */
.triangle {
  width: 8px;
  height: 8px;
  background-color: #fff;
  border-top: 1px solid rgba(226, 226, 226, 1);
  border-left: 1px solid rgba(226, 226, 226, 1);
  box-shadow: 0px 0px 7px 0px rgba(225, 225, 225, 0.5);
  transform: rotate(45deg);
  position: absolute;
  top: -5px;
  left: 40px;
}
.coverup {
  width: 10px;
  height: 10px;
  background-color: #fff;
  transform: rotate(45deg);
  position: absolute;
  top: -3px;
  left: 39px;
}
.common-btn {
  margin: 10px 17px;
}
</style>