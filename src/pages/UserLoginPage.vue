<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>

      <van-image style="margin-left: 25%"
          round
          width="10rem"
          height="10rem"
          :src="logo"
      />

      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
      <br>
      <span @click="openForget" class="float-right"><font color="#C1C1C1">忘记密码</font></span>
    </div>
  </van-form>


  <van-button class="add-button" type="primary" icon="plus" @click="toAddUser" />
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUserState, setCurrentUserState} from "../states/user";
import {currentID, setcurrentID} from "../states/currentID";
// import {setcurrentID} from "../states/currentID";
import logo from '../assets/logo.png'
const router = useRouter();
const route = useRoute();
const userAccount = ref('');
const userPassword = ref('');

const onSubmit = async () => {
  const res = await myAxios.post('/user/login', {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
  })
  console.log(res, '用户登录');
  if (res.code === 0 && res.data) {
    Toast.success('登录成功！');
    // 跳转到之前的页面
    currentID.value=res.data.id;
    console.log("res.data:"+ res.data)
    const Rest = await myAxios.get('/user/current?id='+currentID.value);
    // alert(Rest.data.userAccount)
    if (Rest.code === 0) {
      setCurrentUserState(Rest.data);
    }
    router.push({
      path: '/'
    });

  } else {
    Toast.fail('登录失败！');
  }
};
const toAddUser=()=>{
  window.location.href = `/user/register`;
}
const openForget=()=>{
  window.location.href = `/user/forget`;
}
</script>

<style scoped>
 .float-right {
  display: block;
  /*float: right;*/
  margin-left: 13px;
  overflow: hidden;
   text-align: right;
   margin-right: 10px;
}

/* .float-right>span {*/
/*  display: block;*/
/*   color: #1989FA;*/
/*  margin: 13px auto 0;*/
/*  overflow: hidden;*/
/*  text-align: center;*/
/*}*/
</style>
