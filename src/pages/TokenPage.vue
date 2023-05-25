<template>
  <van-grid :column-num="1" style="float: left;">
    <van-grid-item v-for="value in 1" :key="value" :text="`您正在和${user.username}聊天`"/>
  </van-grid>
  <!--展示-->
  <div id="Content" style="overflow-y: scroll;">

  </div>

  <div id="input">
    <textarea v-model="text" type="text" placeholder="在此输入内容..." id="input_text"></textarea>
    <div style="clear:both"></div>
    <!--按钮-->
    <div>
      <van-button block type="primary" id="submit" @click="doSearchResult">发送</van-button>
    </div>

  </div>
  <van-cell-group>
  </van-cell-group>
</template>

<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from "vue";
// import {getCurrentUserState} from "../states/user";
import {getCurrentUser} from "../services/user";
import {currentID} from "../states/currentID";
import {Toast} from "vant";

const route = useRoute();
const user = route.query;
let nowTime = ref(null);
let Token = ref([]);
const text = ref(null);
let currentUser  = ref();

console.log(user)
const timestampToTime = (times) => {
  let time = times[1]
  let mdy = times[0]
  mdy = mdy.split('/')
  let month = parseInt(mdy[0]);
  let day = parseInt(mdy[1]);
  let year = parseInt(mdy[2])
  return year + '-' + month + '-' + day + ' ' + time
}

nowTime = timestampToTime(new Date().toLocaleString('en-US', {hour12: false}).split(" "));
//打印结果为：2022-8-31 11:08:34


onMounted(async () => {
   currentUser = await getCurrentUser();
})
const doSearchResult = () => {

  const name = user.username;
  const ws = new WebSocket("ws://localhost:8090/api/chat");
  // const ws = new WebSocket("ws://124.221.169.181:8090/api/chat");
  ws.onopen = () => {
    console.log("Socket 已连接");
  }
  if (text.value !== "") {
    Token.value.push(text.value);
  }

  /**
   *接受数据
   * @param ev
   */
  ws.onmessage = (ev) => {
    console.log(ev)
    const data = ev.data;
    const parse = JSON.parse(data);
    console.log(parse.message)
    // Get.value.push(parse.message);
    let querySelector = document.querySelector("#Content");
    let img = document.createElement("img");
    img.src = user.avatarUrl;
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.marginTop = "5%";
    querySelector.appendChild(img)
    let span = document.createElement("span");
    span.style.width = "100%";
    span.style.marginTop = "-10%";
    span.style.marginLeft = "13%";
    span.style.float = "left";
    span.style.position = "relative ";
    span.innerHTML = parse.message
    querySelector.appendChild(span)
    let br = document.createElement("br");
    querySelector.appendChild(br)

    console.log(querySelector)
  }

  /**
   **关闭连接时将聊天记录存储
   */
  ws.onclose = () => {
    sessionStorage.setItem(user.username, Token);
    console.log("Socket已关闭");
  }


  const json = {"toName": name, "message": text.value}
  console.log(json)
  console.log(JSON.stringify(json))
  ws.onerror = function () {
    Toast.fail("Socket发生了错误");
    //此时可以尝试刷新页面
  }

  /**
   * 发送对话
   */
  ws.addEventListener('open', function () {
    console.log(json)
    if (text.value === "" || text.value === null) {
      return;
    } else {
      ws.send(JSON.stringify(json))
      let querySelector = document.querySelector("#Content");
      let span = document.createElement("span");
      span.innerHTML = text.value
      span.id = "mes_right";
      span.style.width = "200px"
      span.style.float = "right";
      span.style.width = "100%";
      span.style.textAlign = "right";
      span.style.marginRight = "15%"
      span.style.marginTop = "5%"
      span.style.wordBreak = "break-all"
      querySelector.appendChild(span)
      let img = document.createElement("img");
      img.src = currentUser.avatarUrl
      img.style.width = "50px";
      img.style.height = "50px";
      img.style.marginLeft = "85%";
      img.style.marginTop = "-9%";
      querySelector.appendChild(img)
    }
    text.value = "";
  });

}
</script>

<style scoped>
#Content {
  width: 99.9%;
  height: 400px;
  background-color: #f0f0f0;
}

#input textarea {
  width: 99.9%;
  height: 80px;
  border-style: solid none none none;
}

#input {
  width: 98.9%;
  height: 150px;
}

#input input {
  width: 99.9%;
  height: 100px;
}

#input button {
  float: right;
}

#mes_time {
  text-align: center;
  width: 100%;
  font-size: 10px;

}

/**
右边 */
#mes_r, #mes_l {
  right: 0;
  float: right;
  width: 99.6%;
  text-align: right;
}

/**消息框 */
#demo_r, #demo_l {

  width: auto;
  float: right;
  margin-top: 25px;
  background-color: lightsteelblue;
  border-radius: 5px;
  padding: 7px;
}

#img_right, #img_left {
  right: 0;
  width: 50px;
  height: 50px;
  float: right;
  margin: 10px;
}

/**
左边 */
#mes_l {
  left: 0;
  float: left;
  text-align: left;
}

/**消息框 */
#demo_l {
  float: left;
  background-color: #1989FA;
}

#img_left {
  float: left;
}

#submit {
  width: 100px;
}
</style>