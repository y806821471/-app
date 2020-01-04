<template>
  <div class="cookbook">
    <div class="date">
      <p v-if="cookbookList&&cookbookList[active]">
        {{cookbookList[active].cycle | filterDate }}{{cookbookList[active].cycle | filterDate2 }}</p>
      <span>{{list[active].dateTitle}}</span>
    </div>
    <!-- 会员 -->
    <div class="swiper-container" v-if="userInfo.is_effective==2">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="(item, index) in cookbookList" :key="index">
          <div class="offer_hd" :style="{'backgroundImage': 'url(' + item.img+ ')'}" @click="showPopup(item)">
            <div class="title">
              <div class="title_left">膳食建议</div>
              <div class="title_right">
                <p>详情</p>
                <span class="icon">&#xe627;</span>
              </div>
            </div>
            <div class="intro">为您推荐每日科学膳食建议，使达成目标事半功倍</div>
          </div>
          <div class="offer_bd" :style="{'backgroundColor':item.color}">
            <ul>
              <li class="list-item">
                <div class="left">
                  <img src="../../assets/img/meal1.png" alt />
                </div>
                <div class="right">
                  <div class="top">
                    <p>早餐</p>
                    <span v-if="item.breakfast">({{item.breakfast.total_cal}}kcal)</span>
                  </div>
                  <div class="bott" v-if="item.breakfast">{{item.breakfast.food_list}}</div>
                </div>
              </li>
              <li class="list-item">
                <div class="left">
                  <img src="../../assets/img/meal2.png" alt />
                </div>
                <div class="right">
                  <div class="top">
                    <p>午餐</p>
                    <span v-if="item.lunch">({{item.lunch.total_cal}}kcal)</span>
                  </div>
                  <div class="bott" v-if="item.lunch">{{item.lunch.food_list}}</div>
                </div>
              </li>
              <li class="list-item">
                <div class="left">
                  <img src="../../assets/img/meal3.png" alt />
                </div>
                <div class="right">
                  <div class="top">
                    <p>晚餐</p>
                    <span v-if="item.dinner">({{item.dinner.total_cal}}kcal)</span>
                  </div>
                  <div class="bott" v-if="item.dinner">{{item.dinner.food_list}}</div>
                </div>
              </li>
              <li class="list-item">
                <div class="left">
                  <img src="../../assets/img/meal4.png" alt />
                </div>
                <div class="right">
                  <div class="top">
                    <p>加餐</p>
                    <span v-if="item.additional">({{item.additional.total_cal}}kcal)</span>
                  </div>
                  <div class="bott" v-if="item.additional">{{item.additional.food_list}}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!-- 不是会员 -->
    <div class="fixation" v-if="userInfo.is_effective==1">
      <div class="offer_hd">
        <div class="title">
          <div class="title_left">总热量 4389 千卡</div>
        </div>
        <div class="intro">为您推荐每日科学膳食建议，使达成目标事半功倍</div>
      </div>
      <div class="offer_bd">
        <ul>
          <li class="list-item">
            <div class="left">
              <img src="../../assets/img/meal1.png" alt />
            </div>
            <div class="right">
              <div class="top">
                <p>早餐</p>
              </div>
              <div class="bott">全麦面包/荷包蛋/拿铁咖啡</div>
            </div>
          </li>
          <li class="list-item">
            <div class="left">
              <img src="../../assets/img/meal2.png" alt />
            </div>
            <div class="right">
              <div class="top">
                <p>午餐</p>
              </div>
              <div class="bott">五谷饭/胡萝卜汁/西红柿鸡蛋/清炒芦笋</div>
            </div>
          </li>
          <li class="list-item">
            <div class="left">
              <img src="../../assets/img/meal3.png" alt />
            </div>
            <div class="right">
              <div class="top">
                <p>晚餐</p>
              </div>
              <div class="bott">生菜/番茄/豆腐</div>
            </div>
          </li>
          <li class="list-item">
            <div class="left">
              <img src="../../assets/img/meal4.png" alt />
            </div>
            <div class="right">
              <div class="top">
                <p>加餐</p>
              </div>
              <div class="bott">苹果/梨子/酸奶</div>
            </div>
          </li>
        </ul>
      </div>
      <!-- 遮罩层 -->
      <van-overlay :show="show" class="overlay">
        <div class="overlay_content" @click="getVip">
          <div class="icon">&#xe657;</div>
          <div style="white-space:nowrap;margin-top:10px">开通会员即可解锁更多食谱</div>
        </div>
      </van-overlay>
    </div>

    <div class="reset" @click="getReset">
      <span class="icon">&#xe628;</span>
      <span>我要重置目标</span>
    </div>
    <!-- 弹出层 -->
    <van-popup v-model="show2" closeable round close-icon="arrow-down" position="bottom" :style="{ height: '90%' }">
      <div class="popup_title">膳食搭配建议</div>
      <div class="popup_content">
        <div class="chart_title">
          <span></span>
          <span>三大营养素功能比</span>
        </div>
        <!-- 饼状图 -->
        <div id="main2" style="width: 100%; height:160px;"></div>
        <!-- 饼图右侧 -->
        <div class="main2_right">
          <div class="datas">
            <div class="datas_left">
              <div class="sign"></div>
              <div class="type">脂肪：</div>
            </div>
            <div class="percentage">{{proportion.proportion_fat}}%</div>
          </div>
          <div class="datas">
            <div class="datas_left">
              <div class="sign2"></div>
              <div class="type">蛋白质：</div>
            </div>
            <div class="percentage">{{proportion.proportion_protein}}%</div>
          </div>
          <div class="datas">
            <div class="datas_left">
              <div class="sign3"></div>
              <div class="type">碳水化合物：</div>
            </div>
            <div class="percentage">{{proportion.proportion_other}}%</div>
          </div>
        </div>
        <!-- ----------------- -->
        <div class="chart_title">
          <span></span>
          <span>营养师建议</span>
          <div class="chart_content" v-html="suggestion"></div>
        </div>
      </div>
    </van-popup>
    <!-- 提示弹出框 -->
    <van-popup v-model="show3" class="popup_message">
      <div class="gray"></div>
      <div class="message_hd">
        <div>
          您好，欢迎您选择
          <br />
          <span class="red">乐烹烹</span>膳食管理服务
        </div>
      </div>
      <div class="message_bd">
        根据您的个人情况，营养师为您生成了
        <span>减肥营养</span>调理的一周食谱，希望您能根据此建议调整您的饮食生活习惯，通过膳食营养改善达到促进健康的目标。
      </div>
      <div class="message_img">
        <img src="../../assets/img/314.png" alt />
      </div>
      <div class="but">
        <van-button class="common-btn" @click="notarize">好的，我知道了</van-button>
      </div>
    </van-popup>
    <!-- 底部导航 -->
    <app-bar></app-bar>
  </div>
</template>

<script>
import Swiper from "swiper";
import "../../assets/css/swiper.min.css";
import { Dialog } from "vant";
import { log } from 'util';
export default {
  data() {
    return {
      list: [
        {
          bg: require("../../assets/img/week1.png"),
          bgc: "rgba(210, 187, 149, 1)",
          dateTitle: "星期一"
        },
        {
          bg: require("../../assets/img/week2.png"),
          bgc: "rgba(178, 105, 108, 1)",
          dateTitle: "星期二"
        },
        {
          bg: require("../../assets/img/week3.png"),
          bgc: "rgba(184, 159, 101, 1)",
          dateTitle: "星期三"
        },
        {
          bg: require("../../assets/img/week4.png"),
          bgc: "rgba(118, 131, 108, 1)",
          dateTitle: "星期四"
        },
        {
          bg: require("../../assets/img/week5.png"),
          bgc: "rgba(95, 118, 144, 1)",
          dateTitle: "星期五"
        },
        {
          bg: require("../../assets/img/week6.png"),
          bgc: "rgba(135, 104, 108, 1)",
          dateTitle: "星期六"
        }
      ],
      cookbookList: [],
      suggestion: "",
      proportion: [],
      userInfo: {},
      show: true,
      show2: false,
      show3: false,
      reFresh: true,
      active: 0,
      week: new Date().getDay(),
      obj: {}
    };
  },
  created() {
    this.getMember();
    this.getUserInfo();
  },
  filters: {
    filterDate(value) {
      return value.toString().substring(4, 6) + "月";
    },
    filterDate2(value) {
      return value.toString().substring(6) + "日";
    }
  },
  methods: {
    swiperCreate() {
      let vm = this;
      const screenWidth = window.screen.width;
      let modifier = (screenWidth + (screenWidth / 100) * 2) / 100;
      this.$nextTick(() => {
        let swiper = new Swiper(".swiper-container", {
          // loop: true, //让Swiper看起来是循环的。
          slidesPerView: "auto", //设置slider容器能够同时显示的slides数量
          centeredSlides: true, //设定为true时，active slide会居中，而不是默认状态下的居左。
          effect: "coverflow",
          // initialSlide :1,//默认第二个
          coverflowEffect: {
            rotate: 0, // 旋转的角度
            stretch: -20, // 拉伸   图片间左右的间距和密集度
            depth: 100, // 深度   切换图片间上下的间距和密集度
            modifier: modifier, // 修正值 该值越大前面的效果越明显
            slideShadows: false // 页面阴影效果
          },
          on: {
            slideChangeTransitionEnd() {
              vm.active = this.realIndex;
            }
          }
        });
        console.log(swiper);
      });
    },
    // 图表渲染
    echartsInit() {
      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("main2"));
      // 绘制图表
      let option = {
        series: [
          {
            name: "三大营养素功能比",
            type: "pie",
            // color: ["#7184FEFF", "#E97A65FF", "#FED172FF"],
            radius: ["30%", "80%"], // 设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
            center: ["24%", "50%"], // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            avoidLabelOverlap: false,
            animation: false,
            silent: true,
            label: {
              normal: {
                position: "inner", // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                // formatter: '{a} {b} : {c}个 ({d}%)'   设置标签显示内容 ，默认显示{b}
                // {a}指series.name  {b}指series.data的name
                // {c}指series.data的value  {d}%指这一部分占总数的百分比
                formatter: "{d}%"
              }
            },
            data: [
              {
                value: this.proportion.proportion_fat,
                name: "脂肪",
                itemStyle: { color: "#7184FE" }
              },
              {
                value: this.proportion.proportion_protein,
                name: "蛋白质",
                itemStyle: { color: "#E97A65" }
              },
              {
                value: this.proportion.proportion_other,
                name: "碳水化合物",
                itemStyle: { color: "#FED172" }
              }
            ]
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取食谱列表
    getMember() {
      this.$http("/Food/cookbookMember").then(response => {
        const res = response.data.data;
        // console.log(res);
        if (response.status == 200) {
          this.cookbookList = res;
          console.log("列表", this.cookbookList);
          if (this.cookbookList != null) {
            this.cookbookList.forEach(item => {
              this.list.forEach(v => {
                if (item.week == v.dateTitle) {
                  this.$set(item, "img", v.bg);
                  this.$set(item, "color", v.bgc);
                }
              });
            });
            // 过滤
            this.cookbookList = this.cookbookList.filter(
              item => item.status != 2
            );
          } else if (
            this.cookbookList == null &&
            this.userInfo.is_effective == 2
          ) {
            this.$toast.fail("食谱暂未推送");
          }
          this.swiperCreate();
        }
      });
    },
    // 用户信息
    getUserInfo() {
      this.$http("User/info").then(response => {
        this.userInfo = response.data.data;
        if (this.userInfo.is_effective == 2 && this.week == 1) {
          this.show3 = true;
        }
      });
    },
    // 重置
    getReset() {
      Dialog.confirm({
        title: "确认操作",
        message: "是否重置目标"
      })
        .then(() => {
          // on confirm
          this.$router.push("TargetSelection");
        })
        .catch(() => {
          // on cancel
        });
    },
    showPopup(item) {
      console.log(item);

      this.suggestion = item.suggestion;
      this.proportion = item.proportion;

      this.show2 = true;
      this.$nextTick(() => {
        //  执行echarts方法
        this.echartsInit();
      });
    },

    notarize() {
      this.show3 = false;
    },
    getVip() {
      this.$router.push("/ClubCard");
    }
  }
  // watch: {
  //   activeChange() {
  //     this.reFresh = false;
  //     this.$nextTick(() => {
  //       this.reFresh = true;
  //     });
  //   }
  // }
};
</script>

<style scoped>
.cookbook {
  padding-top: 0;
}
.date {
  margin-top: 60px;
  padding: 0 34px 27px 34px;
}
.date p {
  color: rgba(150, 153, 147, 1);
  margin-bottom: 8px;
}
.date span {
  font-size: 24px;
  font-weight: bold;
}
/* ______________ */
.swiper-border {
  width: 100%;
  padding: 25px 0 0 0;
}
.swiper-container {
  width: 100%;
  padding-bottom: 25px;
}
.swiper-slide {
  background-position: center;
  width: 80%;
  border-radius: 10px;
  overflow: hidden;
}
.swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
}
/* ----------------- */
.offer_hd {
  padding: 15px 17px;
  color: #fff;
  background: url(../../assets/img/week1.png);
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title_left {
  font-size: 18px;
  font-weight: bold;
}
.title_right {
  display: flex;
  align-items: center;
}
.title_right p {
  font-size: 11px;
}
.title_right span {
  font-size: 12px;
}
.intro {
  font-size: 11px;
  margin-top: 5px;
}
.fixation {
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  margin: 35px;
}
.offer_bd {
  background-color: rgba(210, 187, 149, 1);
  padding: 8px 0;
}
.list-item {
  display: flex;
  align-items: center;
  padding: 17px;
  color: #fff;
}

.left img {
  border-radius: 50%;
  margin-right: 10px;
  width: 45px;
  height: 45px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}
.top p {
  font-size: 16px;
  font-weight: bold;
}
.right {
  width: 100%;
}
/* 底部重置 */
.reset {
  margin-bottom: 85px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgba(150, 153, 147, 1);
}
.reset .icon {
  font-size: 14px;
  margin-right: 5px;
}
.overlay {
  position: absolute;
  top: 0;
  font-size: 14px;
  text-align: center;
  color: rgba(255, 255, 255, 1);
  background: rgba(0, 0, 0, 0.8);
}
.overlay_content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.overlay_content .icon {
  font-size: 36px;
}
/* 弹出层 */
.popup_content {
  padding: 0 17px;
}
.popup_title {
  padding: 14px 17px;
  background: rgba(249, 249, 249, 1);
  font-size: 16px;
}
.chart_title {
  font-size: 15px;
  margin: 10px 0;
  font-weight: bold;
}
.chart_title span:first-child {
  display: inline-block;
  width: 2px;
  height: 12px;
  background-color: #577634;
  margin-right: 7px;
}
.chart_content {
  margin: 6px 0 20px 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(150, 153, 147, 1);
}
.chart_content >>> img {
  width: 100%;
}
.popup_message {
  background: transparent;
  border-radius: 8px;
  /* padding: 30px 22px; */
  width: 80%;
}
.gray {
  height: 30px;
  /* background-color: rgba(0, 0, 0, 0.7); */
}
.message_hd {
  padding: 30px 22px 0 22px;
  border-radius: 8px 8px 0px 0px;
  min-width: 200px;
  font-weight: bold;
  font-size: 18px;
  background-color: #fff;
}
.message_img {
  width: 96px;
  height: 85px;
  position: absolute;
  top: 0;
  right: 0;
}
.message_img img {
  width: 100%;
  height: 100%;
}
.red {
  color: #d94600;
}
.message_bd {
  padding: 18px 22px 0 22px;
  font-size: 15px;
  color: rgba(150, 153, 147, 1);
  font-weight: 400;
  background-color: #fff;
}
.message_bd span {
  color: #30362aff;
}
.but {
  background-color: #fff;
  padding: 30px 22px;
}
.common-btn {
  background: rgba(217, 70, 0, 0.1);
  font-size: 15px;
  color: rgba(217, 70, 0, 1);
}
.main2_right {
  position: absolute;
  top: 120px;
  right: 28px;
  min-width: 120px;
  line-height: 35px;
}
.datas {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.sign {
  width: 8px;
  height: 8px;
  background-color: #7184fe;
  border-radius: 50%;
}
.sign2 {
  width: 8px;
  height: 8px;
  background-color: #e97a65;
  border-radius: 50%;
}
.sign3 {
  width: 8px;
  height: 8px;
  background-color: #fed172;
  border-radius: 50%;
}
.type {
  font-size: 14px;
  margin-left: 8px;
}
.datas_left {
  display: flex;
  align-items: center;
}
.percentage {
  color: #969993;
  margin-left: 6px;
}
.color1 {
  color: #e97a65;
}
.color2 {
  color: #fed172;
}
.van-popup--center {
  top: 45%;
}
</style>