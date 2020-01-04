<template>
  <div class="sms-code">
    <van-count-down v-if="countDown" :time="time" format="ss s" @finish="finished"/>
    <div v-else @click="sendCode">发送验证码</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      countDown: false,
      time: 60000,
      startTime: '',
    }
  },
  props: {
    mobile:{
      type: String,
      require: true,
    }
  },
  created() {
    if(!!localStorage.getItem('smsCodeStratTime')){
      this.startTime = localStorage.getItem('smsCodeStratTime');
      this.countDown = true;
      let now = new Date().getTime();
      this.time = this.time - (now - this.startTime);
    }
  },
  methods:{
    sendCode() {
      if(!(/^[1][3-9][0-9]{9}$/.test(this.mobile))){
        this.$toast('请输入正确的手机号');
        return;
      }
      this.startTime = new Date().getTime();
      localStorage.setItem('smsCodeStratTime',this.startTime);
      this.countDown = true;
      this.$emit('sendCode');
    },
    finished() {
      this.countDown = false;
      localStorage.removeItem('smsCodeStratTime');
    }
  },
}
</script>

<style scoped>
.sms-code,.sms-code .van-count-down{ color: #D94600FF!important;}
</style>
