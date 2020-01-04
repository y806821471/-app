<template>
  <div id="app">
    <!--<router-view class="router-view"></router-view>-->
    <keep-alive>
    	<router-view class="router-view" v-if="$route.meta.keepAlive"></router-view>
  	</keep-alive>
  	<router-view class="router-view" v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>

export default {
}
</script>

<style>
.router-view { position: absolute; left: 0; top: 0; width: 100%; padding-top: 66px;}

</style>
