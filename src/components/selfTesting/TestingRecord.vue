<template>
  <div class="TestingRecord">
    <div class="top">
      <!-- 头部 -->
      <div class="heard">
        <van-icon name="arrow-left" @click="routerBack" />
        <!-- 开始时间 -->
        <div class="dates">
          <van-field v-model="startValue" readonly @click="showStartTime()" />
          <div class="icon" style="font-size: 14px;">&#xe60a;</div>
          <div style="margin:0 5px">-</div>
          <!-- 结束时间 -->
          <van-field v-model="endValue" readonly @click="showEndTime()" />
          <div class="icon" style="font-size: 14px;">&#xe60a;</div>
        </div>
      </div>
      <!-- 开始时间 弹出层 -->
      <van-popup v-model="showStart" position="bottom" :style="{ height: '40%' }">
        <van-datetime-picker v-model="startTime" type="date" :min-date="minDate" :max-date="maxDate"
          @confirm="confirmStartFn()" @cancel="cancelFn()" />
      </van-popup>
      <!-- 结束时间 弹出层 -->
      <van-popup v-model="showEnd" position="bottom" :style="{ height: '40%' }">
        <van-datetime-picker v-model="endTime" type="date" :min-date="minDate" :max-date="maxDate"
          @confirm="confirmEndFn()" @cancel="cancelFn()" />
      </van-popup>
      <!-- ---头部结束---   -->
      <!-- echarts折线图 -->
      <div id="brokenline"></div>
    </div>
    <div class="bottom">
      <div class="values">
        <p v-if="scoreList&&scoreList.highest_score">{{scoreList.highest_score}}</p>
        <p v-else>-</p>
        <div>最高分</div>
      </div>
      <div class="values">
        <p v-if="scoreList&&scoreList.average_score">{{scoreList.average_score}}</p>
        <p v-else>-</p>
        <div>平均分</div>
      </div>
      <div class="values">
        <p v-if="scoreList&&scoreList.average_score">{{scoreList.lowest_score}}</p>
        <p v-else>-</p>
        <div>最低分</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      startValue: "", // 开始时间显示
      endValue: "",

      startTime: "", // 开始时间选择
      endTime: "", // 结束时间

      startDate: "",
      endDate: "",

      maxDate: new Date(), //最大时间
      minDate: new Date(2019, 0, 1), //最小时间

      showStart: false, // 用来显示弹出层
      showEnd: false,

      scoreList: [], // 数据列表
      list: [],
      year: new Date().getFullYear()
    };
  },
  mounted() {
    this.timeFormat(new Date(), "start");
    this.timeFormat2(new Date(), "before");
    this.getFoodScoreHistory();
  },
  methods: {
    brokenLineChart(list) {
      let dateList = [];
      let scoreList = [];
      if (list) {
        list.forEach(item => {
          dateList.push(this.year + "/" + item.date);
          scoreList.push(item.score);
        });
      }

      var echarts = require("echarts");
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("brokenline"));
      let option = {
        grid: {
          top: "3%", // 等价于 y: '16%'
          left: "3%",
          right: "4%",
          bottom: "4%",
          containLabel: true
        },
        tooltip: {
          //提示框
          trigger: "axis",
          backgroundColor: "#fff",
          textStyle: {
            //默认值，
            color: "#577634", //默认值各异
            fontSize: 12 //默认值，
          },
          formatter: function(params) {
            var result = "";
            var dotHtml =
              '<span style="display:inline-block;float:right;padding-right:45px;border-radius:0px;width:0px;height:10px;background-color:#fff">分</span>';
            params.forEach(function(item) {
              result += item.axisValue + "</br>" + dotHtml + item.data;
            });
            return result;
          },
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "line", // 默认为直线，可选为：'line' | 'shadow'
            lineStyle: {
              // 直线指示器样式设置
              color: "#fff",
              width: 1,
              type: "dotted"
            }
          }
        },
        xAxis: {
          type: "category",
          scale: true,
          axisLine: { show: false }, //轴线不显示
          axisTick: { show: false }, //
          data: dateList,
          axisLabel: {
            textStyle: {
              color: "#fff"
            },
            formatter: function(value) {
              return echarts.format.formatTime("MM/dd", value);
            }
          }
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          maxInterval: 25,
          axisLine: { show: false }, //轴线不显示
          axisTick: { show: false }, //
          axisLabel: {
            textStyle: {
              color: "#fff"
            }
          },
          splitNumber: 3,
          splitLine: {
            lineStyle: {
              color: "rgba(250,250,250,0.1)"
            }
          }
        },
        series: [
          {
            data: scoreList,
            type: "line",
            areaStyle: {
              //区域填充样式。
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: "rgba(250, 250, 250, 0.4)" // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "rgba(250, 250, 250, 0)" // 100% 处的颜色
                  }
                ]
              }
            },
            itemStyle: {
              //折线点
              normal: {
                color: "#fff"
                // borderWidth: 1
              }
            },
            lineStyle: {
              //折线
              normal: {
                color: "#fff",
                width: 1
              }
            }
          }
        ]
      };
      myChart.clear();
      myChart.setOption(option);
    },

    // 获取自测历史记录
    getFoodScoreHistory() {
      const params = {
        start_date: this.startDate,
        end_date: this.endDate
      };
      this.$http("Food/getFoodScoreHistory", { params: params }).then(
        response => {
          // console.log(response);
          const res = response.data.data;
          console.log(res);
          this.scoreList = res;
          if (res) {
            this.list = this.scoreList.list;
            // 过滤
            this.list = this.list.filter(item => item.status != 2);
          }

          this.brokenLineChart(this.list);
        }
      );
    },
    // 弹出层的显示
    showStartTime() {
      this.showStart = true;
    },
    showEndTime() {
      this.showEnd = true;
    },

    confirmStartFn() {
      // 开始时间确定按钮
      this.timeFormat(this.startTime, "s");
      this.timeFormat2(this.startTime, "s");
      // console.log("开始时间", this.startDate);
      this.getFoodScoreHistory();
      this.showStart = false;
    },
    //结束时间确定按钮
    confirmEndFn() {
      this.list =[]
      this.timeFormat(this.endTime, "e");
      this.timeFormat2(this.endTime, "e");
      // console.log("结束时间", this.endDate);
      this.getFoodScoreHistory();
      this.showEnd = false;
    },
    // 取消按钮
    cancelFn() {
      this.showStart = false;
    },
    // 时间转换
    timeFormat(time, str) {
      var Month = 0;
      var Day = 0;
      var CurrentDate = "";
      var CurrentDate2 = "";
      //初始化时间
      Month = time.getMonth() + 1;
      Day = time.getDate();
      if (Month >= 10) {
        CurrentDate += Month + "月";
      } else {
        CurrentDate += "0" + Month + "月";
      }
      if (Day >= 10) {
        CurrentDate += Day + "日";
      } else {
        CurrentDate += "0" + Day + "日";
      }
      if (str == "s") {
        this.startValue = CurrentDate;
      } else {
        this.endValue = CurrentDate;
      }
      // 前五天
      if (str == "start") {
        Day = time.getDate() - 4;
        time.setDate(Day);
        Month = time.getMonth() + 1;
        Day = time.getDate();
        if (Month >= 10) {
          CurrentDate2 += Month + "月";
        } else {
          CurrentDate2 += "0" + Month + "月";
        }
        if (Day >= 10) {
          CurrentDate2 += Day + "日";
        } else {
          CurrentDate2 += "0" + Day + "日";
        }
        this.startValue = CurrentDate2;
      }
    },
    timeFormat2(time2, str2) {
      var Year2 = 0;
      var Month2 = 0;
      var Day2 = 0;
      var CurrentDate3 = "";
      var CurrentDate4 = "";
      //初始化时间
      Year2 = time2.getFullYear();
      Month2 = time2.getMonth() + 1;
      Day2 = time2.getDate();

      CurrentDate3 += Year2 + "";
      CurrentDate4 += Year2 + "";
      if (Month2 >= 10) {
        CurrentDate3 += Month2 + "";
      } else {
        CurrentDate3 += "0" + Month2 + "";
      }
      if (Day2 >= 10) {
        CurrentDate3 += Day2;
      } else {
        CurrentDate3 += "0" + Day2;
      }
      if (str2 == "s") {
        this.startDate = CurrentDate3;
      } else {
        this.endDate = CurrentDate3;
      }

      // 前五天
      if (str2 == "before") {
        Day2 = time2.getDate() - 4;
        time2.setDate(Day2);
        Year2 = time2.getFullYear();
        Month2 = time2.getMonth() + 1;
        Day2 = time2.getDate();

        CurrentDate3 += Year2 + "";
        if (Month2 >= 10) {
          CurrentDate4 += Month2 + "";
        } else {
          CurrentDate4 += "0" + Month2 + "";
        }
        if (Day2 >= 10) {
          CurrentDate4 += Day2;
        } else {
          CurrentDate4 += "0" + Day2;
        }
        this.startDate = CurrentDate4;
      }
    }
  }
};
</script>

<style scoped>
.TestingRecord {
  padding: 0;
}
.top {
  background: linear-gradient(
    180deg,
    rgba(66, 90, 38, 1) 0%,
    rgba(87, 118, 52, 1) 100%
  );
}
.heard {
  display: flex;
  align-items: center;
  padding: 30px 16px 0 16px;
  height: 66px;
}
.van-icon {
  color: #fff;
  font-size: 16px;
}
#brokenline {
  width: 100%;
  height: 300px;
}
.bottom {
  display: flex;
  justify-content: space-around;
  margin: 30px 0;
}
.values {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.values p {
  font-size: 20px;
  font-weight: 700;
}
.values div {
  font-size: 11px;
  color: #969993ff;
}
/* 头部 */
.van-cell {
  width: 63px;
  background-color: transparent;
  padding: 0;
}
.van-cell:not(:last-child)::after {
  border: 0;
}
.van-cell::after {
  border: 0;
}
.heard {
  position: relative;
  display: flex;
  align-items: center;
  padding: 30px 16px 0 16px;
  height: 66px;
  color: #fff;
}
.dates {
  display: flex;
  align-items: center;
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, 10%);
}
</style>