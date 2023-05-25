<template>
  <div>
    <br>
    <span style="font-weight: 400;margin: 15px;font-size: 30px;">添加标签</span>
    <br><span style="font-size: 10px;margin-left: 15px;color: gray;">添加符合你的{{ allGetTag }}个标签。</span>
  </div>
  <br>
  <!--已有标签-->
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in tagList">
      <van-tag class="tag" size="large" :id="`${tag.id}`" plain @click="updateTag(tag.id)" :color="`${getTagColor()}`"
               style="border: 1px solid #f0f0f0;padding: 8px;"
               :style="{backgroundColor:tag.color}">
        <!--{backgroundcolor:setBcolor(tag.id,tag.color)}-->
        {{ tag.text }}
      </van-tag>
    </van-col>
  </van-row>
  <!--自定义标签-->
  <div id="tags">
    <van-cell is-link @click="showPopup"
              style="padding: 15px;margin-top: 15px;">+自定义标签
    </van-cell>
    <van-popup
        v-model:show="show"
        round
        closeable
        position="bottom"
        :style="{ height: '50%' }">
      <!--内容-->
      <div style="width: auto;height: auto;padding: 15px;padding-top: 50px;">
        <van-cell-group inset style="margin-left: 0px;">
          <van-field
              v-model="Tagvalue"
              clearable
              placeholder="输入您的标签"
              maxlength="8"
          />
        </van-cell-group>
        <van-divider style="margin: 1px;"/>
        <span style="font-size: 10px;margin-left: 15px;color: gray;margin-top: -10px;">自定义标签最多八个字</span>
        <br>
        <van-button size="small"
                    style="right: 10px;float: right;margin-top: 20px;"
                    type="success"
                    @click="toAddNewTag">
          添加
        </van-button>
      </div>
    </van-popup>
  </div>
  <!--完成按钮-->
  <van-button class="add-button" type="primary" icon="success" style="z-index: 999;" @click="toAddTag"/>
</template>

<script setup lang="ts">
import {onMounted, ref, defineComponent, reactive} from "vue";
import {Toast} from "vant";
import myAxios from "../plugins/myAxios";
import qs from "qs";
import {getCurrentUser} from "../services/user";
import {currentID} from "../states/currentID";
// import {getCurrentUserState} from "../states/user";


//最大选中数量
let allGetTag = 10

//随机生成颜色
const getTagColor = () => {
  let arr = [6, 7, 8, 9, "a", "b", "c", "d", "e", "f"];
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += arr[Math.floor(Math.random() * 10)];
  }
  return color;
}


onMounted(async () => {
  const res = await myAxios.get("/user/get/tags?currentId="+currentID.value);
  console.log(res?.data.oldTags)
  console.log(TagList)
  if (res?.code === 0) {
    //已有的标签
    console.log(res?.data.oldTags)
    console.log(TagList)
    if (res.data.oldTags!=null){
      res.data.oldTags.forEach((i: any)=>
      {
        //添加至tagList
        tagList.value.push({text:i,id:`tag${tagList.value.length}`,color:get_color.toString()})
        //最大选中数量减少
        allGetTag-=1;
      })
    }
    //推荐的标签
    res.data.recommendTags.forEach((i: any) => {
      //添加至tagList
      tagList.value.push({text: i, id: `tag${tagList.value.length}`, color: "#ffffff"})
    })

  } else {
    Toast.fail('获取标签失败，请刷新重试');
  }
})

//标签列表
let TagList: any[] = []
// (已有+自己)标签列表
let tagList = ref(TagList);
//选中后呈现的标签颜色
let get_color = "rgb(51, 67, 83)"

//点击图标
const updateTag = (id: String) => {
  let tag = document.querySelector("#" + id);
  //未点击状态 点击
  if (tag.style.backgroundColor == "rgb(255, 255, 255)") {
    //已选中标签已满
    if (allGetTag == 0)//已选满 ，不展示自定义标签添加
    {
      Toast.fail("选中标签已达数量上限")
      return;
    }
    //console.log(tag.style.color)
    tag.style.backgroundColor = get_color;
    allGetTag -= 1;
  } else  //点击 取消选中 恢复白背景颜色
  {
    tag.style.backgroundColor = "#ffffff"
    allGetTag += 1;
  }
}

//展示弹出层
const show = ref(false);
const showPopup = () => {
  //已选中标签已满
  if (allGetTag == 0)//已选满 ，不展示自定义标签添加
  {
    Toast.fail("选中标签已达数量上限")
    return;
  }
  show.value = true;
};

//获取已选中的标签
const toAddTag = async () => {
  const currentUser = await getCurrentUser();
  if (allGetTag == 10) //未选中一个
    return;
  let msg = "[";
  //循环 获取已选中的标签的text
  TagList.forEach((tag: any) => {
    let tag_d = document.querySelector("#" + tag.id);
    if (tag_d.style.backgroundColor == get_color) {
      msg += '"' + tag.text + '",';
    }
  });
  msg = msg.substring(0, msg.length - 1) + "]";
  console.log(msg + "msg")
  console.log(currentUser.id)
  const res = await myAxios.post('/user/update', {
    id: currentUser.id,
    tags: msg.toString()
  })

  if (res?.code === 0) {
    Toast.success('修改成功!');
  } else {
    Toast.fail('修改失败，请刷新重试!');
  }
}

//自定义标签文本
const Tagvalue = ref('');
//自定义标签最大生成个数
let tagNum: number = 8;
//添加自定义标签
const toAddNewTag = () => {
  //输入的自定义标签是否为空
  if (Tagvalue.value.length == 0) {
    Toast.fail("自定义标签不能为空");
    return;
  }
  //先检索添加的在 已有标签中是否存在
  let i = TagList.length;
  TagList.forEach((tag: any) => {
    if (tag.text == Tagvalue.value) //已有标签存在 选中对应已有
    {//
      show.value = false;
      let tag_d = document.querySelector("#" + tag.id);
      tag_d.style.backgroundColor = get_color;
    } else
      i--;
  });
  if (i != 0)  //说明没有找到已有标签同
    return;

  //自定义标签已满
  if (tagNum == 0) {
    show.value = false;
    Toast.fail("自定义标签已达数量上限");
    return;
  }
  //不存在 生成一个新标签
  tagNum -= 1;
  const num = TagList.length; //获取已有标签数，便于后面生成新标签设置id
  let querySelector = document.querySelector("#tags");
  let demo = document.createElement("van-tag");
  demo.innerHTML = Tagvalue.value
  demo.id = "tag" + num;
  demo.style.float = "left";
  demo.style.marginTop = "15px"
  demo.style.backgroundColor = "#ffffff";
  demo.style.border = "1px solid #f0f0f0";
  demo.style.padding = "8px";
  demo.style.marginLeft = "15px"
  demo.size = "large"
  //添加点击事件
  demo.addEventListener("click", function () {

    //未点击状态 点击
    if (demo.style.backgroundColor == "rgb(255, 255, 255)") {
      //已选中标签已满
      if (allGetTag == 0)//已选满 ，不展示自定义标签添加
      {
        Toast.fail("选中标签已达数量上限")
        return;
      }
      //console.log(tag.style.color)
      demo.style.backgroundColor = get_color;
      allGetTag -= 1;
    } else  //点击 取消选中 恢复白背景颜色
    {
      demo.style.backgroundColor = "#ffffff"
      allGetTag += 1;
    }
    console.log(allGetTag)
  })
  querySelector.appendChild(demo)
  demo.style.color = getTagColor()
  allGetTag -= 1;
  show.value = false;
  //设置为选中
  let tag_d = document.querySelector("#" + demo.id);
  tag_d.style.backgroundColor = get_color;
  //新标签加入TagList
  TagList.push({text: Tagvalue.value.toString(), id: demo.id})
  return;
}
</script>

<style>
.tag {
  margin-top: 15px;
  padding: 5px;

}
</style>