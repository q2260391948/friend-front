<template>
  <van-form @submit="onSubmit">
    <van-cell-group inset>

      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />

      <van-field
          v-model="userEmail"
          name="邮箱"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ required: true, message: '请填写邮箱' }]"
      />
      <!--验证码+按钮-->
      <div style="float: left;left: 0px;"> 
        <div style="width: 80%;display: inline-block">
              <van-field 
                v-model="code"
                name="验证码"
                label="验证码"
                placeholder="验证码"
                :rules="[{ required: true, message: '请填写验证码' }]"
            />
        </div>
        <van-button  type="success" @click="sendMessage" 
                     style="width: auto;display: inline-block;">
          发送</van-button>
      </div>
     <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />

    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup  lang="ts">
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
const router = useRouter()
const userAccount = ref('');
const userEmail = ref('');
const password = ref('');
const code = ref('');
import {Toast} from "vant";
const  checkPassword= ref('');

const onSubmit = async () => {
  const res = await myAxios.put('/user/forget', {
    userAccount:userAccount.value,
    userEmail:userEmail.value,
    code:code.value,
    userPassword: password.value,
  })
  if (res.code === 0 && res.data) {
    Toast.success('修改成功！');
    // 跳转到之前的页面
    window.location.href = `/user/login`;
  } else {
    Toast.fail('修改失败,\n'+res.description);
  }
}

const sendMessage = async () => {
  console.log()
  const res = await myAxios.post('/user/sendMessage', {
    userEmail:userEmail.value,
    code:code.value,
  })
  if (res.code === 0 && res.data) {
    Toast.success('发送成功！');
    // 跳转到之前的页面
  } else {
    Toast.fail('发送失败,\n'+res.description);
  }
}

</script>
<style scoped>

</style>