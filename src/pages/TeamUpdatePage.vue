<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>

        <van-field name="uploader" label="队伍头像:">
          <template #input>
            <van-uploader v-model=" fileList" multiple :before-read="beforeRead" :after-read="afterRead"/>
          </template>
        </van-field>

        <van-field
            v-model="addTeamData.name"
            name="name"
            label="队伍名"
            placeholder="请输入队伍名"
            :rules="[{ required: true, message: '请输入队伍名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="队伍描述"
            type="textarea"
            placeholder="请输入队伍描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="addTeamData.expireTime ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-datetime-picker
              v-model="addTeamData.expireTime"
              @confirm="showPicker = false"
              type="datetime"
              title="请选择过期时间"
              :min-date="minDate"
          />
        </van-popup>
        <van-field name="radio" label="队伍状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status " direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入队伍密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {currentID} from "../states/currentID";

const router = useRouter();
const route = useRoute();

// 展示日期选择器
const showPicker = ref(false);

const minDate = new Date();
const id = route.query.id;
// 需要用户填写的表单数据
const addTeamData = ref({})
const fileList = ref([
  {url: addTeamData.value.avatarUrl, isImage: true},
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明

]);
// 获取之前的队伍信息
onMounted(async () => {

      if (id <= 0) {
        Toast.fail('加载队伍失败');
        return;
      }
      const res = await myAxios.get("/team/get", {
        params: {
          id,
        }
      });
      if (res?.code === 0) {
        addTeamData.value = res.data;
        console.log(addTeamData.value)
        fileList.value[0].url = addTeamData.value.avatarUrl;
        addTeamData.value.status = addTeamData.value.status + "";
      } else {
        Toast.fail('加载队伍失败，请刷新重试');
      }
    }
)

// 提交
const onSubmit = async () => {
  const postData = {
    currentId: currentID.value,
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }
  console.log(addTeamData.value.avatarUrl)
  // todo 前端参数校验
  const res = await myAxios.post("/team/update", postData);
  if (res?.code === 0 && res.data) {
    Toast.success('更新成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    Toast.success('更新失败');
  }
}
console.log(addTeamData.value.avatarUrl)

console.log("fileList:" + fileList.value.values())
console.log(fileList)
const beforeRead = (file: any) => {
  if (file.type !== 'image/jpeg') {
    Toast('请上传 jpg 格式图片');
    return false;
  }
  return true;
};

const afterRead = (file: any) => {
  // 返回图片信息
  console.log(file);
  const ImgUploadFile = async (params: any) => {
    // 要把数据变成file格式
    const formData = new FormData(); // 下面有备注
    formData.append('file', params);
    console.log(formData)
    return await myAxios.post('/upload/img', formData, {
      headers: {
        // 注意修改请求头file格式
        'Content-Type': 'multipart/form-data',
      },
    });
  };
  ImgUploadFile(file.file)
  addTeamData.value.avatarUrl = "http://ru5ziixua.hd-bkt.clouddn.com/" + file.file.name;
  console.log(addTeamData.value.avatarUrl)
}

</script>

<style scoped>
#teamPage {

}
</style>
