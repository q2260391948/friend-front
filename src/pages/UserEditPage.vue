<template>
  <van-form @submit="onSubmit">
    <van-field v-if="editUser.editKey!=='avatarUrl'  "
               v-model="editUser.currentValue"
               :name="editUser.editKey"
               :label="editUser.editName"
               :textarea="`请输入${editUser.editName}`"
    />
    <div v-if="editUser.editKey==='avatarUrl'">
      <van-uploader v-model="fileList" multiple :before-read="beforeRead" :after-read="afterRead"/>
    </div>

    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {getCurrentUser} from "../services/user";

/**
 * import {getCurrentUserState} from "../states/user";
 */
let tag;
const route = useRoute();
const router = useRouter();

onMounted(()=>{
  if (editUser.value.currentValue==="1"){
    editUser.value.currentValue="男";
  }else if (editUser.value.currentValue==="0") {
    editUser.value.currentValue="女";
  }
})

const editUser = ref({
  editKey: route.query.editKey,
  currentValue: route.query.currentValue,
  editName: route.query.editName,
})
console.log(editUser.value.editKey)
const onSubmit = async () => {
  const currentUser = await getCurrentUser();
  console.log(editUser.value)
  if (!currentUser) {
    Toast.fail('用户未登录');
    return;
  }
  console.log(currentUser, '当前用户')
  if (editUser.value.editKey==="gender"){
    if (editUser.value.currentValue==="男"){
      editUser.value.currentValue="1";
    }else if (editUser.value.currentValue==="女") {
      editUser.value.currentValue="0";
    }
  }

  if (editUser.value.editKey==="phone"){
    if (editUser.value.currentValue?.length!==11){
      Toast.fail('电话长度应为11位!');
      return;
    }
  }

  const res = await myAxios.post('/user/update?currentId', {
    'id': currentUser.id,
    [editUser.value.editKey as string]: editUser.value.currentValue,
  })
  console.log(editUser.value.currentValue)
  console.log(res, '更新请求');
  console.log(res)
  if (res.code === 0 && res.data > 0) {
    Toast.success('修改成功');
    router.back();
  } else {
    Toast.fail('修改错误');
  }
};


const fileList = ref([
  {url: editUser.value.currentValue, isImage: true},
  // Uploader 根据文件后缀来判断是否为图片文件
  // 如果图片 URL 中不包含类型信息，可以添加 isImage 标记来声明

]);
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
  editUser.value.currentValue =  "http://ru5ziixua.hd-bkt.clouddn.com/"+ file.file.name;
}


</script>

<style scoped>

</style>
