<template>
  <van-pull-refresh v-model="load" @refresh="onRefresh">
    <van-cell center title="匹配模式">
      <template #right-icon>
        <van-switch v-model="isMatchMode" size="24"/>
        <van-icon id="search" name="search" size="18" @click="toSearch"/>
      </template>
    </van-cell>
    <user-card-list :user-list="userList" :loading="loading"/>
    <van-empty v-if="!userList || userList.length < 1" description="数据为空"/>
  </van-pull-refresh>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from 'vue';
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import UserCardList from "../components/UserCardList.vue";
import {UserType} from "../models/user";

import {useRouter} from "vue-router";
import {currentID} from "../states/currentID";

const router = useRouter();
const isMatchMode = ref<boolean>(false);
const count = ref(0);
const load = ref(false);
const userList = ref([]);
const loading = ref(true);
const isListeningToScroll = ref(false); // 添加标志变量
// 页面加载时只触发一次
onMounted(() => {
  loadData();
})
/**
 * 加载数据
 */
const loadData = async () => {

  let userListData;
  loading.value = true;
  // 匹配模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData=null;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
        currentId: currentID.value,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          Toast.fail('请求失败');
        })
  } else {
    // // 普通模式，直接分页查询用户
    let pageNum=1;
    userListData=null;
    userListData = await myAxios.get('/user/recommend', {
      params: {
        currentId:currentID.value,
        pageSize: 10,
        pageNum: pageNum,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          Toast.fail('请求失败');
        })
    if (!isListeningToScroll.value) { // 只在需要时添加监听器
      isListeningToScroll.value = true; // 更新标志变量
      window.addEventListener('scroll', async function () {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;
        const distance = scrollHeight - scrollTop - clientHeight;
        if (distance < 50) {
          // 已经滚动到底部
          // do something
          // alert("滚动到了底部")
          pageNum = pageNum + 1;
          const Data = await myAxios.get('/user/recommend', {
            params: {
              currentId: currentID.value,
              pageSize: 10,
              pageNum: pageNum,
            },
          })
              .then(function (response) {
                console.log('/user/recommend succeed', response);
                return response?.data?.records;
              })
              .catch(function (error) {
                console.error('/user/recommend error', error);
                Toast.fail('请求失败');
              })
          console.log(Data)
          if (Data) {
            Data.forEach((user: UserType) => {
              if (user.tags) {
                user.tags = JSON.parse(user.tags);
              }
            })
            userList.value = userList.value.concat(Data);
          }
        }
      });
    }
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
  }
  loading.value = false;
}

watchEffect(() => {
  loadData();
})
/**点击搜索小图标 查找队友 */
const toSearch = () => {
  router.push('/search')
}

const onRefresh = () => {
  loadData();
  setTimeout(() => {
    Toast.success('刷新成功');
    load.value = false;
    count.value++;
  }, 1000);
};


</script>

<style scoped>
#search {
  margin: 5px;
  color: #1989FA;
}
</style>
