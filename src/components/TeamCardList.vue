<template>
  <div
      id="teamCardList"
  >
  <van-swipe-cell v-for="team in props.teamList"  style="margin-top: 10px;margin-bottom: 10px;height: auto;">
    <!--内容-->
    <van-card :thumb="team.avatarUrl" :desc="team.description" :title="`${team.name}`"
              class="goods-card">
        <!--tag-->
        <template #tags>
        <van-tag mark type="danger" style="margin-right: 8px; margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          <span class="sp_font">队伍人数</span>
          {{ `: ${team.userVOS.length}/${team.maxNum}` }}
        </div>
        <div v-if="team.expireTime">
          <span class="sp_font">过期时间</span>
          {{ ': ' + team.expireTime.substring(0, 19).replace("T"," ") }}
        </div>
        <div>
          <span class="sp_font">创建时间</span>
          {{ ': ' + team.createTime.substring(0, 19).replace("T"," ") }}
        </div>
      </template>
      <template #footer>
      <!--查看-->
      <van-button size="mini" text="查看" type="primary"
                    @click="getCurrentUserList(team.userVOS)"
                    custom-style="btn"/>
    </template>
    </van-card>
    <!--右滑-->
  <template #right>
    <!--加入-->
    <van-button square text="加入" type="primary" v-if="team.userId !== currentUser?.id &&!team.hasJoin "
                  @click="preJoinTeam(team)" class="lr_btn"/>


    <!--退出-->
    <van-button square text="退出" type="warning" v-if="team.userId === currentUser?.id || hasJoin(team.id)" 
                  @click="doQuitTeam(team.id)" class="lr_btn"/>
    <!--解散-->
    <van-button square text="解散" type="danger" v-if="team.userId === currentUser?.id"
                @click="doDeleteTeam(team.id)" class="lr_btn"/>
  </template>
    <!--左滑-->
  <template #left>
    <!--更新-->
    <van-button square type="success" text="更新" v-if="team.userId === currentUser?.id" 
                @click="doUpdateTeam(team.id)" class="lr_btn"/>
   </template>

  </van-swipe-cell>
  </div>
  <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
    <van-field v-model="password" placeholder="请输入密码"/>
  </van-dialog>
</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team";
import myAxios from "../plugins/myAxios";
import {Toast} from "vant";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user";
import {useRouter} from "vue-router";
import {UserType} from "../models/user";
import ikun from  "../assets/ikun.png"
import {currentID} from "../states/currentID";

interface TeamCardListProps {
  teamList: TeamType[];
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
});

const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref(0);
const currentUser = ref();
const users: any[] = ([]);
const router = useRouter();
onMounted(async () => {
  currentUser.value = await getCurrentUser();
})
let TM: TeamType;
const hasJoin = (id: number) => {
  for (let team of props.teamList) {
    if (team.id === id) {
      TM = team;
    }
  }
  for (let user of TM.userVOS) {
    if (user.id == currentUser.value.id) {
      return true;
    }
  }
}

const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  // alert(joinTeamId.value)
  console.log(team.status)
  if (team.status === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;
  }
}

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}

/**
 * 加入队伍
 */
const doJoinTeam = async () => {
  if (!joinTeamId.value) {
    return;
  }
  const res = await myAxios.post('/team/join', {
    currentId:currentID.value,
    teamId: joinTeamId.value,
    password: password.value
  });
  if (res?.code === 0) {
    Toast.success('加入成功');
    doJoinCancel();
  } else {
    Toast.fail('加入失败' + (res.description ? `，${res.description}` : ''));
  }
}

const getCurrentUserList = (userVOS: UserType[]) => {
  users.push(JSON.stringify(userVOS));
  router.push({
    path: '/user/team/users',
    query: {
      users: JSON.stringify(userVOS)
    }
  })

}


/**
 * 跳转至更新队伍页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

/**
 * 退出队伍
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    currentId:currentID.value,
    teamId: id
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 解散队伍
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    currentId:currentID.value,
    id:id,
  });
  if (res?.code === 0) {
    Toast.success('操作成功');
  } else {
    Toast.fail('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;

}

.van-card__thumb img {
  margin: 100px;
}
  .goods-card {
    margin: 0;
    background-color: @white;
  }

  .lr_btn {
    height: 100%;
  }
  .sp_font{
    font-weight: 500;
  }
</style>
