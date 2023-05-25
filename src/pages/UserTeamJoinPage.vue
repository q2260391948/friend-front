<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜索队伍" @search="onSearch"/>
    <team-card-list :teamList="teamList"/>
    <van-empty v-if="teamList?.length < 1" description="数据为空"/>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {currentID} from "../states/currentID";

const router = useRouter();
const searchText = ref('');
const teamList = ref([]);

/**
 * 搜索队伍
 * @param val
 * @returns {Promise<void>}
 */
const listTeam = async (val = '') => {
  console.log(val)
  console.log(currentID.value)
  const res = await myAxios.get("/team/list/my/join", {
    params: {
      currentId: currentID.value,
      searchText: val,
      pageNum: 1,
    },
  });
  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    Toast.fail('加载队伍失败，请刷新重试');
  }
}


// 页面加载时只触发一次
onMounted(async () => {
      const res = await myAxios.get("/team/list/my/join", {
                params: {
                  currentId: currentID.value
                }
              }
          )
      ;
      if (res?.code === 0) {
        teamList.value = res.data;
        console.log(teamList.value)
        console.log("查找结果")
      } else {
        Toast.fail('加载队伍失败，请刷新重试');
      }
    }
)

const onSearch = (val: string | undefined) => {
  listTeam(val);
};

</script>

<style scoped>
#teamPage {

}
</style>
