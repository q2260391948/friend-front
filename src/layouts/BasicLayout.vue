<template> 
  <!--没有左<的顶部-->
  <div v-show="$route.meta.navShow" class="login-container">
  <van-nav-bar
      :title="title"
      @click-right="onClickRight"
      fixed
  >
</van-nav-bar>
</div>
  <!--有左<的顶部-->
<div v-show="!$route.meta.navShow" class="login-container">
<van-nav-bar
      :title="title"
      @click-left="onClickLeft"
      @click-right="onClickRight"
      fixed
      left-arrow
  >
</van-nav-bar>  </div>
  <!--fixed固定-->
  <!--<van-nav-bar
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >-->
  <!--搜索
  <template #right>
      <van-icon name="search" size="18"/>
    </template>
  -->
<!--中间内容-->
  <div id="content">
    <router-view/>
  </div>
<!--下导航栏-->
<div  v-show="$route.meta.navShow&&$route.meta.tabbarShow"> <!--通过route.ts文件里的设置其是否展示下部导航-->
  <van-tabbar route @change="onChange">
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import {ref} from "vue";
import routes from "../config/route";

const router = useRouter();
const DEFAULT_TITLE = '伙伴匹配';
const title = ref(DEFAULT_TITLE);

/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  title.value = route?.title ?? DEFAULT_TITLE;
})


const onClickLeft = () => {
  router.back();
};


/**点击搜索小图标 查找队友 
const onClickRight = () => {
  router.push('/search')
};*/

</script>

<style scoped>
#content {
  padding-bottom: 50px;
}
.login-container {
  padding-top: 46px;
}
</style>
