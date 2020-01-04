<template>
  <div class="qusetionList">
    <van-nav-bar title="提交记录" left-arrow @click-left="routerBack" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-collapse v-model="activeNames" accordion>
        <van-collapse-item :name="item.index" v-for="(item,index) in list" :key="index" >
          <div slot="title" class="title">
            <div class="left">
              <div>{{item.content}}</div>
              <span>{{item.created_at}}</span>
            </div>
            <div class="right" v-if="item.child.content">已解决</div>     
            <div class="right2" v-else>未解决</div>

          </div>
          <div class="reply">
            <div>
              <span style="font-weight:bold;">客服：</span>
              <span>{{item.child.content}}</span>
            </div>
            <span class="created">{{item.child.created_at}}</span>
          </div>
        </van-collapse-item>
      </van-collapse>
    </van-list>
  </div>
</template>

<script>
export default {
  name: "QuestionList",
  data() {
    return {
      activeNames: [],
      list: [],
      loading: false,
      finished: false,
    };
  },
  created() {},
  methods: {
    onLoad() {
      this.$http("/System/issue").then(response => {
        const res = response.data;
        console.log(res);
        if (res.status = 200){
          this.list = res.data.data;
        }
        this.loading = false;
        this.finished = true;
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.van-nav-bar {
  background-color: transparent;
}
.van-list {
  padding: 0 4%;
  margin-top: 10px;
}
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left {
  font-size: 14px;
}
.left span {
  font-size: 12px;
  color: rgba(150, 153, 147, 1);
}
.right {
  color: rgba(217, 70, 0, 1);
  font-size: 12px;
  min-width: 40px;
  margin-left: 10px;
}
.right2 {
  color: rgba(150, 153, 147, 1);
  font-size: 12px;
  min-width: 40px;
  margin-left: 10px;
}
.created{
  font-size: 12px;
  color: rgba(150, 153, 147, 1);
}
.reply {
  color: #30362A;
}
 
</style>
