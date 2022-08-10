<template>
  <div id="app">
   <el-container id="menuList" v-if="!LoginShow">
      <el-aside width="200px">
        <div class="logo" >
          <img src="@/assets/logo-new.png" alt="" srcset="">
        </div>
        <el-row class="tac">
          <el-col >
            <el-menu
              :default-active="index"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              :unique-opened = 'true'
              background-color="#000C17"
              text-color="#fff"
              active-text-color="#fff">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-s-management "></i>
                  <span>场次管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1" @click="routerLink('Home','1-1')"><i class="el-icon-s-flag"></i>新增场次</el-menu-item>
                  <el-menu-item :index="item.id" @click="routerLink('menuList',item)" v-for="(item,index) in menuList" :key="index" >
                    <i class="el-icon-s-platform"></i>{{item.pname}}
                  </el-menu-item>
                  
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      
      <el-main>
        <div class="header-box">
            <div class="userImg" ><img @click="loginOut()" src="@/assets/img/h.jpg" alt="" srcset=""></div>
        </div>
        <div class="main-conter">
            <router-view :msg="child"></router-view>
        </div>
         <div class="footer">Copyright &copy;2022 北京乐会科技(天津)有限公司</div>
      </el-main>
    </el-container>

    <!-- 登录 -->
    <div v-if="LoginShow" id="logonPage">
      <Login @getLoginShow='LoginFlag'></Login>
    </div>
 
  </div>
</template>

<script>
import Login from '@/views/login.vue'
export default {
  name: 'app',
  data(){
    return{
      index:'1-1',
      LoginShow:false,
      menuList:[],
      child:{
        pid:'',
        pname:'',
        state:''
      },
    }
  },
  components:{
    Login,
  },
  mounted(){
    let LoginFlag = sessionStorage.getItem('loginShow');
    if(!LoginFlag){
      this.LoginShow = true;
    }else if(LoginFlag || LoginFlag=='true'){
      this.LoginShow = false;
    }
    console.log(sessionStorage.getItem('index'));
    if(sessionStorage.getItem('index')){
      this.index = sessionStorage.getItem('index');
    }else{
      this.index = '1-1';
    }
    this.getMenuList();
  },

  methods: {
    getMenuList(){
      let that = this;
      that.axios.get('msd1223_GetPList')
      .then(function (res) {
        console.log(res);
        console.log(res.status)
        if(res.status == 200){
            if(res.data && res.data.msg=='ok'){
              if(res.data.data.plist && res.data.data.plist.length>0){
                that.menuList = res.data.data.plist;
              }
            }else{
              that.$message.error(res.data.msg);
            }
        }else{
          that.$message({
            message: '服务异常请稍后重试！',
            type: 'warning'
          });
        }
      })
    },

    handleOpen(key, keyPath) {
      console.log(key, keyPath);
     
    },

    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    //路由跳转
    routerLink(data,item){
        sessionStorage.removeItem('index');
        console.log( item.id)
        if(!item.id || item.id =='1-1'){
          sessionStorage.setItem('index','1-1');
        }else{
          sessionStorage.setItem('index',item.id);
        }
        this.child.pid =item.id; 
        this.child.pname = item.pname; 
        this.child.state = item.state;
        this.$router.push({path: '/'+data, query:{pid:item.id,state:item.state,pname:item.pname}});
    },
    LoginFlag(data){
      console.log(data);
      this.LoginShow = data;
    },
    //退出登录
    loginOut(){
      console.log('退出登录');
      let that = this; 
      this.$confirm('退出登录?', '提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(111);
        that.LoginShow = true;
        sessionStorage.setItem('loginShow',false);
        that.$router.push({path:'/login'});
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出登录'
        });
      });
    }
  }
}
</script>

<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-family: PingFangSC-Regular, 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 14px;
  height: 100%;
  overflow: hidden;
}
a{
  color: #fff;
  text-decoration: none;
  outline:none;
}
#menuList {
  height: 100%;
  .logo{
    width: 80px;
    height: 66px;
    background:transparent;
    box-shadow: 2px 0 6px 0 rgba(0,21,41,0.35);
    text-align: center;
    img{
      width: 120px;
      margin: 0 auto;
      vertical-align: middle;
      margin-top: 10px;
    }
  }
}

#menuList {
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  .el-aside {
    background: #002140;
    color: #333;
    text-align: left;
  }
  .el-menu{
    border-right: none !important;
  }
    .el-menu-item{
    opacity: 0.65;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFFFFF;
  }  
  .el-row ,.el-col-12{
    width: 100%;
  }
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    height: 100%;
    padding: 0 !important; 
  }
  .header-top{
    height: 65px;
    background: #fff;
    font-family: PingFangSC-Medium;
    font-size: 20px;
    color: rgba(0,0,0,0.85);
    line-height: 65px;
  }

  .main-conter{
    min-height: 86%;
    margin: 0 auto;
    margin-top: 24px;
    background: #fff;
    width: 96%;
  }
  .footer{
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(0,0,0,0.45);
    line-height: 40px;
  }
  body > .el-container {
    margin-bottom: 40px;
    height: 100%;
  }

  .el-submenu__title{
    background: #000C17;
  }
  .el-menu .is-active{
    background-color: #2F5BEA !important;
    opacity: 1;
  }
  .el-container{
    height: 100%;
  }
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .vioce-speak img,.speak-img-box img{
    width: 48px;
    height: 48px;
  }
  .speak-img-box .voiceprintImg{
      width: 25px;
      height: 25px;
      vertical-align: super;
  }
}
.header-box{
  height: 68px;
  line-height: 50px;
  width: 100%;
  background: #002140;
  .userImg {
    text-align: right;  
    vertical-align: middle;
  }
  .userImg img{
    width: 30px;
    height: 30px;
    margin-right: 40px;
    vertical-align: middle;
    border-radius: 100%;
    cursor: pointer;
    margin-top: 20px;
  }
}
</style>
