<template>
    <div id="loginPage">
        <div class="login-box">
            <div class="logo">
                <img src="@/assets/logo-new.png" alt="" srcset="">
                <p></p>
            </div>
           <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="账号" prop="username">
                    <el-input v-model.number="ruleForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button  type="primary" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
  import qs from 'qs'
  export default {
    data() {
      var checkUsername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('账号不能为空'));
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          password: ''
        },
        name:'admin',
        password:'123456',
        rules: {
          username: [
            { validator: validatePass, trigger: 'blur' }
          ],
          password: [
            { validator: checkUsername, trigger: 'blur' }
          ]
        }
      };
    },
    mounted(){
        let LoginFlag = sessionStorage.getItem('loginShow');
        if(!LoginFlag){
          this.LoginShow = true;
        }else if(LoginFlag || LoginFlag=='true'){
          this.LoginShow = false;
          this.$router.push({path:'/Home'});
        }
    },
    methods: {
      submitForm(formName) {
        var LoginFlag = true;
        let that  = this;
        that.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return  LoginFlag = false;
          }
        });
        if(LoginFlag){
          if(that.ruleForm.username == that.name && that.ruleForm.password == that.password){
            sessionStorage.setItem('loginShow',true);
            sessionStorage.setItem('index','1-1');
            that.$router.push({path: '/Home', query:{pid:'1-1'}});
            that.$emit('getLoginShow',false);
          }else{
            that.$message.error('账号或密码错误，请重试！');
          }
        }
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>
<style lang="scss" scoped>
    #loginPage{
        text-align: center;
        background: #002140;
        width: 35%;
        margin: auto;
        margin-top: 8%;
        padding: 5% 0;
        padding-right: 5%;
        box-sizing: border-box;
        .logo img{
          width: 150px;
        }
    }
</style>