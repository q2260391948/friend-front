<template>

  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch" />
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
    </van-tabs>
    <div style="margin-bottom: 16px" />
    <van-button class="add-button" type="primary" icon="plus" style="z-index: 999;" @click="toAddTeam" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <team-card-list :teamList="teamList" />
    </van-pull-refresh>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>

</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
const teamList = ref([]);
import {Toast} from "vant";
const count = ref(0);
const loading = ref(false);
const active = ref('public')
const router = useRouter();
const searchText = ref('');
/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else {
    // 查加密
    listTeam(searchText.value, 2);
  }
}


// 页面加载时只触发一次
onMounted( () => {
  listTeam();
})

/**
 * 搜索队伍
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', status = 0) => {
  console.log(val)
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    },
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
}


const onRefresh = () => {
  listTeam();
  setTimeout(() => {
    Toast.success('刷新成功');
    loading.value = false;
    count.value++;
  }, 1000);
};

// 跳转到创建队伍页
const toAddTeam = () => {
  router.push({
    path: "/team/add"
  })
}

const onSearch = (val) => {
  listTeam(val);
};

</script>

<style scoped>
#teamPage {

}
</style>
