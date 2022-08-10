<template>
  <div id="addMenu-Page">
      <div class="menu-name">
        <div class="left">
          <span>场次名</span>
        </div>
        <div class="right">
          <el-input
            placeholder="请输入内容"
            v-model="menuName"
            :maxlength="10"
            clearable>
          </el-input>
          <span>{{menuName.length}}/10</span>
        </div>
      </div>
      <div class="menu-submit">
          <el-button type="primary" @click="addMenuChange()">提交</el-button>
      </div>
  </div>
</template>

<script>
import qs from 'qs'
  export default {
    data() {
      return {
        menuName:'',
      }
    },
    mounted(){
      
    },
    methods: {
      addMenuChange(){
        let that = this;
        if(that.menuName == ''){
          that.$message.error('请输入场次名');
        }else{
          let promise = {
            pname:that.menuName
          }
          that.axios.post('/msd1223_AddP', qs.stringify(promise))
          .then(function (res) {
            console.log(res);
            console.log(res.status)
            if(res.status == 200){
                if(res.data && res.data.msg=='ok'){
                  if(res.data.data && res.data.data.pid){
                    sessionStorage.setItem('index',res.data.data.pid);
                    that.$router.push({path: '/menuList', query:{pid:res.data.data.pid,state:0,pname:that.menuName}});
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                   
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
        }

      },

    },
  }
</script>
<style lang="scss" scoped>
  #addMenu-Page{
    width: 100%;
    .menu-name{
      width: 40%;
      padding: 40px;
      line-height: 1.5;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 50% 50%;
      .left{
        line-height: 2.5;
      }
      .right{
        position: relative;
        span{
          position: absolute;
          top: 10px;
          right: -40px;
        }
      }

    }
    .menu-submit{
      width: 30%;
      margin-top: 30px;
      padding-left: 40px;
      box-sizing: border-box;
    }
  }
</style>
