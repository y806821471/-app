<template>
  <div class="selfTesting">
    <img src="../../assets/img/testing_bg.png" alt />
    <!-- 仪表盘 -->
    <div class="yibiao">
      <div id="sample"></div>
      <img src="../../assets/img/bg-img.png" id="bg_img" style="display:none" />
      <div class="label">{{score}}</div>
      <div class="label2">今日评分</div>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <van-button round @click="submit" v-if="score == 0">计算今日得分</van-button>
      <van-button round @click="submit2" v-else>获取定制食谱</van-button>
    </div>
    <!-- 建议内容 -->
    <div v-if="foodScoreList">
      <div class="suggest">
        <div class="suggest_title">
          <p></p>
          <span>营养师建议</span>
        </div>
        <div class="suggest_content">
          <span class="kind">种类：</span>
          <span>{{foodScoreList.kind}}</span>
        </div>
        <div class="suggest_content">
          <span class="kind">摄入量：</span>
          <span v-for="(item,index) in intake" :key="index">{{item}}</span>
        </div>
        <div class="suggest_content">
          <span class="kind">饮食习惯：</span>
          <span v-for="(item,index) in habits" :key="index">{{item}}</span>
        </div>
        <div class="suggest_content">
          <span class="kind">解释说明：</span>
          <span v-for="(item,index) in explain" :key="index">{{item}}</span>
        </div>
      </div>
      <div class="warn">
        <span class="warn_kind">不适人群：</span>
        <span>1.未满18岁；2.运动员；3.正在做重量训练；4.怀孕或哺乳中。</span>
      </div>
    </div>
    <!-- 底部导航 -->
    <app-bar></app-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      foodScoreList: "",
      score: "0", // 分数
      intake: [], // 摄入量
      habits: [], // 饮食习惯
      explain: [] // 解释说明
    };
  },
  mounted() {
    this.getFoodScore();
  },
  methods: {
    warning() {
      var echarts = require("echarts");
      // 指定图表的配置项和数据
      var value = this.score / 100, // 值，0~1之间
        startAngle = 215, // 开始角度
        endAngle = -35, // 结束角度
        splitCount = 100, // 刻度数量
        pointerAngle = (startAngle - endAngle) * (1 - value) + endAngle; // 当前指针（值）角度
      var myChart = echarts.init(document.getElementById("sample"));
      var option = {
        series: [
          {
            //灰色刻度
            type: "gauge",
            radius: "98%",
            startAngle: pointerAngle,
            endAngle: endAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
              length: 15,
              splitNumber: Math.ceil((1 - value) * splitCount),
              lineStyle: {
                color: "#D8D8D8",
                width: 1.5
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test gauge"
              }
            ]
          },
          {
            //渐变刻度
            type: "gauge",
            radius: "98%",
            startAngle: startAngle,
            endAngle: pointerAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
              length: 15,
              splitNumber: Math.ceil(value * splitCount),
              lineStyle: {
                color: {
                  image: document.getElementById("bg_img"),
                  repeat: "no-repeat"
                },
                width: 1.5
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test gauge"
              }
            ]
          },
          {
            //长刻度
            type: "gauge",
            radius: "104%",
            startAngle: pointerAngle,
            endAngle: pointerAngle,
            splitNumber: 1,
            axisLine: {
              show: false,
              lineStyle: {
                width: 3,
                opacity: 0
              }
            },
            title: { show: false },
            detail: { show: false },
            splitLine: { show: false },
            axisTick: {
              length: 15,
              splitNumber: 1,
              lineStyle: {
                color: {
                  image: document.getElementById("bg_img"),
                  repeat: "no-repeat"
                },
                width: 1.5
              }
            },
            axisLabel: { show: false },
            pointer: { show: false },
            itemStyle: {},
            data: [
              {
                value: value,
                name: "test gauge"
              }
            ]
          },
          {
            name: "内层刻度",
            type: "gauge",
            radius: "80%",
            startAngle: "215",
            endAngle: "-35",
            center: ["50%", "50%"],
            splitNumber: 4,
            axisLine: {
              //仪表盘轴线相关配置
              show: false
            },
            splitLine: {
              //分隔线样式。
              length: 7,
              lineStyle: {
                color: "#D8D8D8",
                width: 1
              }
            },
            axisLabel: {
              //刻度标签
              show: true,
              distance: 3,
              color: "#D8D8D8",
              fontSize: 12
            },
            axisTick: {
              //刻度样式
              show: true,
              splitNumber: 25,
              length: 4,
              lineStyle: {
                color: "#D8D8D8"
              }
            },
            pointer: {
              show: false
            },
            detail: {
              show: false
            }
          }
        ]
      };
      myChart.setOption(option);
    },
    // 获取数据
    getFoodScore() {
      this.$http("/Food/getFoodScore").then(response => {
        const res = response.data.data;
        this.foodScoreList = res;
        console.log(this.foodScoreList);
        if (this.foodScoreList != null) {
          this.score = this.foodScoreList.score;
          this.intake = this.foodScoreList.intake;
          this.habits = this.foodScoreList.habits;
          this.explain = this.foodScoreList.explain;
        }
        
        this.warning();
      });
    },
    submit() {
      this.$router.push("DietList");
    },
    submit2() {
      this.$router.push("cookbook");
    }
  }
};
</script>

<style scoped>
.selfTesting {
  padding-top: 0;
}
.selfTesting img {
  width: 100%;
}
.btn {
  text-align: center;
  margin-top: -30px;
}
.van-button--default {
  background: linear-gradient(
    153deg,
    rgba(87, 118, 52, 0.1) 0%,
    rgba(66, 90, 38, 0.1) 100%
  );
  border: 1px dashed rgba(151, 151, 151, 1);
  font-weight: bold;
  color: rgba(87, 118, 52, 1);
  font-size: 18px;
  padding: 0 54px;
}
.suggest {
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  margin: 22px 17px 6px 17px;
  padding: 16px;
}
.suggest_title {
  font-size: 15px;
  font-weight: bold;
  color: rgba(87, 118, 52, 1);
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.suggest_title p {
  width: 7px;
  height: 7px;
  background: rgba(87, 118, 52, 1);
  border-radius: 1px;
  transform: rotate(45deg);
  margin-right: 6px;
}
.suggest_content {
  font-size: 14px;
  color: #696b67;
  line-height: 21px;
}
.kind {
  font-weight: bold;
}
.warn {
  margin-left: 33px;
  margin-bottom: 100px;
  font-size: 10px;
  color: rgba(105, 107, 103, 1);
}
.warn_kind {
  font-size: 11px;
  font-weight: bold;
}
/* 仪表盘 */
.yibiao {
  position: relative;
}
#sample {
  width: 100%;
  height: 245px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
}
.label {
  text-align: center;
  font-size: 40px;
  /* line-height: 350px; */
  position: absolute;
  top: 100px;
  left: 0;
  width: 100%;
  /* height: 300px; */
  color: #d94600;
}
.label2 {
  text-align: center;
  font-size: 12px;
  /* line-height: 410px; */
  position: absolute;
  top: 150px;
  left: 0;
  width: 100%;
  /* height: 300px; */
  color: #d94600;
}
</style>