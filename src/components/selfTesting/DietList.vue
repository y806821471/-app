<template>
  <div class="DietList">
    <van-nav-bar title="饮食清单" left-arrow @click-left="routerBack" />
    <div class="total">
      <div class="total_number">
        <p>{{kcalTotal}}</p>
        <span>总热量(kcal)</span>
      </div>
      <div class="van-hairline--right"></div>
      <div class="total_number">
        <p>{{danbaiTotal}}</p>
        <span>蛋白质(g)</span>
      </div>
    </div>
    <div class="add_box">
      <!-- 早餐 -->
      <div class="meal" v-for="(i, index) in titleList" :key="index">
        <div class="meal_title">
          <div class="meal_title_left">
            <img :src="i.imgs" alt />
            <p>{{i.name}}</p>
            <span v-if="i.list">({{i.list.length || 0}}份)</span>
          </div>
          <div class="meal_title_right">
            <span>{{kcalListTotal(i.list)}}</span>
            <span>kcal</span>
          </div>
        </div>
        <div>
          <ul class="addFood">
            <li class="addFood_list" v-for="(item,index) in i.list" :key="index">
              <div class="addFood_list_left">
                <img :src="item.imgs" alt />
                <div>
                  <p>{{item.num}}{{item.unit}}{{item.name}}</p>
                  <span>{{item.kcal*item.num}}kcal/{{(item.protein*item.num).toFixed(2)}}g蛋白质</span>
                </div>
              </div>
              <div class="addFood_list_right" @click="removeFood(i.list,item.id)">
                <div class="icon">&#xe626;</div>
              </div>
            </li>
          </ul>
          <div class="addbtn" @click="toPage('/AddFood',i.name)">
            <van-icon name="add-o" />
            <div>添加食物</div>
          </div>
        </div>
      </div>
      <!-- 自测选择题 -->
      <router-link to="/TargetSelection2" class="select">
        <div class="select_left">自测选择题</div>
        <div class="select_right">
          <p v-if="formData && formData.length > 0">必填项/已作答</p>
          <p v-else>必填项/未作答</p>
          <span class="icon">&#xe627;</span>
        </div>
      </router-link>
    </div>

    <!-- 底部 -->
    <van-tabbar safe-area-inset-bottom>
      <van-button class="common-btn" @click="getBegin">开始今日评分</van-button>
    </van-tabbar>
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  data() {
    return {
      titleList: [
        {
          name: "早餐",
          imgs: require("../../assets/img/meal1.png"),
          Ename: "breakfast"
        },
        {
          name: "中餐",
          imgs: require("../../assets/img/meal2.png"),
          Ename: "lunch"
        },
        {
          name: "晚餐",
          imgs: require("../../assets/img/meal3.png"),
          Ename: "dinner"
        },
        {
          name: "加餐",
          imgs: require("../../assets/img/meal4.png"),
          Ename: "additional"
        }
      ],
      name: "",
      // formData: []
      formData:JSON.parse(localStorage.getItem('formData'))
    };
  },
  created() {

    this.name = this.$store.state.name;
    // this.formData = this.$route.params.formData;
    console.log("shuju ",this.formData);

    if (this.name && this.$store.state.titleList) {
      this.titleList = this.$store.state.titleList;
    }
    this.getRouterList();
  },
  computed: {
    kcalListTotal() {
      return function(value) {
        if (value) {
          let num = 0;
          value.forEach(val => {
            num += val.num * val.kcal;
          });
          return num;
        } else {
          return 0;
        }
      };
    },
    kcalTotal() {
      let kcal = 0;
      this.titleList.forEach(val => {
        if (val.list) {
          val.list.forEach(v => {
            kcal += v.num * v.kcal;
          });
        }
      });

      return kcal;
    },
    danbaiTotal() {
      let danbai = 0;
      this.titleList.forEach(val => {
        if (val.list) {
          val.list.forEach(v => {
            danbai += v.protein * v.num;
          });
        }
      });

      return danbai;
    }
  },
  methods: {
    toPage(path, name) {
      this.$store.commit("SET_titleList", this.titleList);
      this.$store.commit("SET_name", name);
      this.$router.push({
        path: path,
        query: {
          name: name
        }
      });
    },
    getBegin() {
      console.log(this.titleList);
      var breakfast = [];
      var lunch = [];
      var dinner = [];
      var additional = [];
      this.titleList.forEach(item => {
        switch (item.Ename) {
          case "breakfast":
            if (item.list) {
              item.list.forEach(ele => {
                breakfast.push({
                  name: ele.name,
                  id: ele.id,
                  num: ele.num
                });
              });
            }

            break;
          case "lunch":
            if (item.list) {
              item.list.forEach(ele => {
                lunch.push({
                  name: ele.name,
                  id: ele.id,
                  num: ele.num
                });
              });
            }

            break;
          case "dinner":
            if (item.list) {
              item.list.forEach(ele => {
                dinner.push({
                  name: ele.name,
                  id: ele.id,
                  num: ele.num
                });
              });
            }

            break;

          case "additional":
            if (item.list) {
              item.list.forEach(ele => {
                additional.push({
                  name: ele.name,
                  id: ele.id,
                  num: ele.num
                });
              });
            }

            break;
        }
      });
      
      if ( this.formData == undefined) {
        this.$toast("请完成自测选择题");
        return;
      }

      Dialog.confirm({
        title: "确认操作",
        message: "每日只有一次提交评分机会 确认现在提交？",
        confirmButtonText: "是，开始评分",
        cancelButtonText: "否，重新记录"
      })
        .then(() => {
          let params = {
            breakfast: JSON.stringify(breakfast),
            lunch: JSON.stringify(lunch),
            dinner: JSON.stringify(dinner),
            additional: JSON.stringify(additional)
          };
          this.$http.post("Food/foodDailySubmit", params).then(response => {
            console.log(response);
            const res = response.data;
            this.$toast(res.msg);
            if (res.status == 200) {
              this.$toast(res.msg);
              this.$router.push("selfTesting");
            }
          });
        })
        .catch(() => {
          // on cancel
        });
    },
    // 删除按钮
    removeFood(list, id) {
      list.forEach((item, index) => {
        if (item.id == id) {
          list.splice(index, 1);
        }
      });
    },
    getRouterList() {
      var newArr = this.$store.state.newArr;
      var backName = this.$route.query.name;
      if (this.titleList && this.name) {
        this.titleList.forEach(item => {
          if (item.name == this.name && item.name == backName) {
            this.$set(item, "list", newArr);
          }
        });
      }
    },
    routerBack() {
      this.$router.push("/selfTesting");
    }
  }
};
</script>

<style scoped>
.van-nav-bar {
  background-color: #fff;
}

.total {
  position: fixed;
  width: 100%;
  z-index: 1;
  background-color: #f9f9f9;
  display: flex;
  justify-content: space-around;
  padding: 16px 34px;
}

.total_number {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.total_number p {
  font-size: 18px;
  font-weight: 700;
}

.total_number span {
  color: rgba(150, 153, 147, 1);
}

.meal {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  margin: 0 17px 10px 17px;
}

.meal_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e2e2;
  padding: 10px 15px;
}

.meal_title_left {
  display: flex;
  align-items: flex-end;
}

.meal_title_left img {
  width: 27px;
  height: 27px;
  margin-bottom: 2px;
}

.meal_title_left p {
  font-size: 21px;
  font-weight: bold;
  margin-left: 10px;
}

.meal_title_left span {
  font-size: 14px;
  margin-left: 5px;
}

.meal_title_right {
  font-size: 11px;
  color: rgba(87, 118, 52, 1);
}

.meal_title_right span:first-child {
  font-size: 18px;
  padding-right: 5px;
}

.addFood {
  /* background-color: #fff; */
  padding: 0 15px;
}

.addFood_list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
}

.addFood_list:last-child {
  border-bottom: 1px solid #f3f3f3;
}

.addFood_list_left {
  display: flex;
  align-items: center;
}

.addFood_list_left img {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.addFood_list_left p {
  font-size: 16px;
}

.addFood_list_left span {
  font-size: 12px;
  color: rgba(150, 153, 147, 1);
}

.addFood_list_right .icon {
  color: #969993;
  font-size: 22px;
}

.addbtn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
  color: rgba(87, 118, 52, 1);
  font-size: 15px;
}

.van-icon-add-o {
  margin-right: 6px;
  font-size: 16px;
}

.add_box {
  margin-bottom: 72px;
  margin-top: 75px;
}

.common-btn {
  margin: 10px 17px;
}

.select {
  background-color: #fff;
  margin: 0 17px 10px 17px;
  padding: 15px;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.select_left {
  font-size: 16px;
  font-weight: bold;
  color: rgba(48, 54, 42, 1);
}

.select_right {
  display: flex;
  align-items: center;
  color: rgba(150, 153, 147, 1);
}

.select_right p {
  font-size: 14px;
}

.select_right .icon {
  font-size: 18px;
}
</style>