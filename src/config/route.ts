// 定义一些路由
import Index from "../pages/Index.vue";
import Team from "../pages/TeamPage.vue";
import UserPage from "../pages/UserPage.vue";
import UserUpdatePage from "../pages/UserUpdatePage.vue";
import UserTeamJoinPage from "../pages/UserTeamJoinPage.vue";
import UserTeamCreatePage from "../pages/UserTeamCreatePage.vue";
import SearchPage from "../pages/SearchPage.vue";
import SearchResultPage from "../pages/SearchResultPage.vue";
import UserEditPage from "../pages/UserEditPage.vue";
import UserLoginPage from "../pages/UserLoginPage.vue";
import TeamAddPage from "../pages/TeamAddPage.vue";
import TeamUpdatePage from "../pages/TeamUpdatePage.vue";
import TokenPage from "../pages/TokenPage.vue";
import JoinUsersPage from "../pages/JoinUsers.vue";
import UserRegisterPage from "../pages/RegisterPage.vue";
import UserEidTagPage from "../pages/UserTagPage.vue";
import ForgetPage from "../pages/ForgetPage.vue";
/**meta:{navShow :true}是否是一级页面 */
const routes = [
    { path: '/', component: Index ,meta:{navShow :true,tabbarShow:true}},
    { path: '/user/Token', title: '聊天室', component: TokenPage },
    { path: '/team', title: '找队伍', component: Team ,meta:{navShow :true,tabbarShow:true}},
    { path: '/team/add', title: '创建队伍', component: TeamAddPage },
    { path: '/team/update', title: '更新队伍', component: TeamUpdatePage },
    { path: '/user', title: '个人信息', component: UserPage ,meta:{navShow :true,tabbarShow:true}},
    { path: '/search', title: '找伙伴', component: SearchPage },
    { path: '/user/list', title: '用户列表', component: SearchResultPage },
    { path: '/user/edit', title: '编辑信息', component: UserEditPage  },
    { path: '/user/login', title: '登录', component: UserLoginPage ,meta:{navShow :true}},
    { path: '/user/forget', title: '忘记密码', component: ForgetPage },
    { path: '/user/register', title: '注册', component: UserRegisterPage },
    { path: '/user/update', title: '更新信息', component: UserUpdatePage },
    { path: '/user/team/join', title: '加入队伍', component: UserTeamJoinPage },
    { path: '/user/team/create', title: '创建队伍', component: UserTeamCreatePage },
    { path: '/user/team/users', title: '队员列表', component: JoinUsersPage },
    { path: '/user/edit/tag', title: '编辑标签', component: UserEidTagPage }


]

export default routes;
