import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '@/components/Index'
import MessageDetails from '@/components/MessageDetails'



import Login from '@/components/login/Login'
import Register from '@/components/login/Register'
import Forget from '@/components/login/Forget'


// 自测
import selfTesting from '@/components/selfTesting/Index'
import TestingRecord from '@/components/selfTesting/TestingRecord'
import DietList from '@/components/selfTesting/DietList'
import AddFood from '@/components/selfTesting/AddFood'


//食谱
import cookbook from '@/components/cookbook/Index'

// 我的
import personal from '@/components/personal/Index'
import ServiceCenter from '@/components/personal/ServiceCenter'
import MyProperty from '@/components/personal/MyProperty'
import MyFans from '@/components/personal/MyFans'
import MyData from '@/components/personal/MyData'
import ClubCard from '@/components/personal/ClubCard'
import Question from '@/components/personal/Question'
import QuestionList from '@/components/personal/QuestionList'
import SetUp from '@/components/personal/SetUp'
import AlterEmail from '@/components/personal/AlterEmail'
import Withdraw from '@/components/personal/Withdraw'
import TargetSelection from '@/components/personal/TargetSelection' // 膳食问卷
import TargetSelection2 from '@/components/personal/TargetSelection2'
import Nickname from '@/components/personal/Nickname'
import Password from '@/components/personal/Password'
import CashAccount from '@/components/personal/CashAccount'
import AddWeChat from '@/components/personal/AddWeChat'
import AddAlipay from '@/components/personal/AddAlipay'



Vue.use(VueRouter)

const routes = [
  // 登陆注册
  { path: '/', name: 'Home', redirect: "/Index" },
  { path: '/Index', name: 'Index', component: Index, },
  { path: '/MessageDetails', name: 'MessageDetails', component: MessageDetails, },
  { path: '/Login', name: 'Login', component: Login, },
  { path: '/Register', name: 'Register', component: Register, },
  { path: '/Forget', name: 'Forget', component: Forget, },

  // 自测
  { path: '/selfTesting', name: 'selfTesting', component: selfTesting },
  { path: '/TestingRecord', name: 'TestingRecord', component: TestingRecord },
  { path: '/DietList', name: 'DietList', component: DietList,},
  { path: '/AddFood', name: 'AddFood', component: AddFood },

  //食谱
  { path: '/cookbook', name: 'cookbook', component: cookbook },

  // 我的
  { path: '/personal', name: 'personal', component: personal },
  { path: '/ServiceCenter', name: 'ServiceCenter', component: ServiceCenter, },
  { path: '/MyProperty', name: 'MyProperty', component: MyProperty, },
  { path: '/MyFans', name: 'MyFans', component: MyFans, },
  { path: '/MyData', name: 'MyData', component: MyData, },
  { path: '/ClubCard', name: 'ClubCard', component: ClubCard, },
  { path: '/Question', name: 'Question', component: Question, },
  { path: '/QuestionList', name: 'QuestionList', component: QuestionList, },
  { path: '/SetUp', name: 'SetUp', component: SetUp, },
  { path: '/AlterEmail', name: 'AlterEmail', component: AlterEmail, },
  { path: '/Withdraw', name: 'Withdraw', component: Withdraw, },
  { path: '/TargetSelection', name: 'TargetSelection', component: TargetSelection, }, // 膳食问卷
  { path: '/TargetSelection2', name: 'TargetSelection2', component: TargetSelection2, },
  { path: '/Nickname', name: 'Nickname', component: Nickname, },
  { path: '/Password', name: 'Password', component: Password, },
  { path: '/CashAccount', name: 'CashAccount', component: CashAccount, },
  { path: '/AddWeChat', name: 'AddWeChat', component: AddWeChat, },
  { path: '/AddAlipay', name: 'AddAlipay', component: AddAlipay, },



]

const router = new VueRouter({
  routes
})

export default router
