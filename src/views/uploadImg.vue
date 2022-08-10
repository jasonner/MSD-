<template>
    <div id="uploadImg-page">
        <div class="title">{{pname}}</div>
        <div class="upload-box upload-logo">
            <div class="left">LOGO上传</div>
            <div class="right">
                <el-upload
                    class="upload-demo"
                    action=""
                    :limit=1
                    accept="image/*"
                    :http-request="getHealthCode"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </div>
            <div class="shili-box">
                <button @click="lookUrlEG(1)">示例</button>
            </div>
        </div>
        <div class="upload-box upload-logo">
            <div class="left">SLOGAN上传</div>
            <div class="right">
            <el-upload
                class="upload-demo"
                action=""
                :limit=1
                accept="image/*"
                :http-request="getTravelCode"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            </div>
            <div class="shili-box">
                <button @click="lookUrlEG(2)">示例</button>
            </div>
        </div>
        <div class="upload-box upload-logo">
            <div class="left">背景图上传</div>
            <div class="right">
                <el-upload
                    class="upload-demo"
                    action=""
                    :limit=1
                    accept="image/*"
                    :http-request="getNuclein"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </div>
            <div class="shili-box">
            <button @click="lookUrlEG(3)">示例</button>
            </div>
        </div>
        <el-dialog title="示例图片" :visible.sync="dialogFormVisible">
        <div>
          <img :src="lookImg" alt="" srcset="">
          <p style="color:red;font-size:10px;text-align:left;margin-left:6vw;margin-top:2vw">*尺寸:高度自适应*宽度为750px(设计图的宽度),可以鼠标右键点击此图片下载作为参考</p>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" slot="" @click="dialogFormVisible = false">关闭</el-button>
        </div>
      </el-dialog>
      <div class="back-page">
        <el-button size="small" type="primary" @click="backPage()">返回</el-button>
      </div>
    </div>
</template>
<script>
import qs from 'qs'
import OSS from 'ali-oss';
export default {
    name:'',
    data(){
        return{
            menuName:'',
            logourl:'',
            sologonurl:'',
            basemapurl:'' ,
            lookImg:require('../assets/img/logo20220328.png'),
            dialogFormVisible:false, 
            pid:null,
            pname:null,
            openState:null
        }
    },
    mounted(){
        var query=this.$route.query;
        if(query && query.pid){
            console.log(query.pid);
            this.pid = query.pid;
            this.openState = query.state;
            this.pname = query.pname;
        }else{
            this.$router.push('/Home');
        };
    },
    methods:{
        //上传LOGO
        getHealthCode(file){
            console.log('上传健康码')
            this.Upload(file,'A');
        },
        
        //上传SLOGAN
        getTravelCode(file){
            this.Upload(file,'B');
        },

        //上传背景图
        getNuclein(file){
            this.Upload(file,'C');
        },
      
        //自定义上传方法..
        Upload(file,UpType) {
            console.log(file)
            var name = 'MSD'
            let fileName = name+'/'+file.file.uid + file.file.name;
            console.log(fileName);
            const _this = this;
            _this.axios.get('https://commapi.forhoo.cn/forhoo/GetOSSSTS?dir=MSD').then((result) => {
                console.log(result.data);
                _this.client =  new OSS({
                region: result.data.region,
                accessKeyId: result.data.data.accessKeyId,
                accessKeySecret: result.data.data.accessKeySecret,
                stsToken: result.data.data.securityToken,
                bucket: result.data.bucketName
                });
                this.getBase64(file.file).then(resBase64 => {
                const base64 = resBase64.split(",").pop();
                const fileType = resBase64.split(";").shift().split(":").pop();
                // base64转blob
                const blob = _this.dataURLtoBlob(base64, fileType);
                console.log(blob);
                // blob转arrayBuffer
                const reader = new FileReader();
                reader.readAsArrayBuffer(blob);
                reader.onload = event => {
                    //arrayBuffer转Buffer
                    const buffer = OSS.Buffer(event.target.result);
                    // 上传
                    _this.client.put(fileName, buffer)
                    .then( result=> {
                        console.log(result);
                    let httpUrl = 'https://merckoss.wfbweb.com/'
                    _this.fileurl = httpUrl+fileName;
                    switch (UpType) {
                        case 'A':
                            _this.logourl =  httpUrl+fileName;
                            _this.logoUrlSetting();
                            break;
                        case 'B':
                            _this.sologonurl =  httpUrl+fileName;
                            _this.sologonurlSetting();
                            break;
                        case 'C':
                            _this.basemapurl =  httpUrl+fileName;
                            _this.backImgSetting();
                            break;
                        default:
                            break;
                    };
                    console.log(_this.logourl);
                    console.log(_this.sologonurl);
                    console.log(_this.basemapurl);
                    })
                    .catch( err=> {
                        console.log("错误", err);
                    });
                };
                })
            })
        },

        //file文件转base64
        getBase64(file) {
            return new Promise((resolve, reject) => {
                let reader = new FileReader();
                let fileResult = "";
                reader.readAsDataURL(file);
        　　　　　//开始转
                reader.onload = function() {
                fileResult = reader.result;
                };
        　　　　　//转 失败
                reader.onerror = function(error) {
                reject(error);
                };
        　　　　　//转 结束 
                reader.onloadend = function() {
                resolve(fileResult);
                };
            });
        },
            
        // base64转blob
        dataURLtoBlob(urlData, fileType) {
            let bytes = window.atob(urlData);
            let n = bytes.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bytes.charCodeAt(n);
            }
            return new Blob([u8arr], {
                type: fileType
            });
        },


        //查看示例
        lookUrlEG(type){
            let that = this;
            switch (type) {
            case 1:
                that.lookImg = require('../assets/img/logo20220328.png');
                break;
            case 2:
                that.lookImg = require('../assets/img/slogan20220328.png');
            break;
            case 3:
                that.lookImg = require('../assets/img/bg.png');
            break;
            default:
                break;
            }
            this.dialogFormVisible = true;
        },

        //上传logo
        logoUrlSetting(){
            let that  = this;
            let promise = {
                pid:that.pid,
                type:'logourl',
                url:that.logourl,
            }
            that.axios.post('/msd1223_SetImgUrl', qs.stringify(promise))
            .then(function (res) {
                console.log(res);
                console.log(res.status)
                if(res.status == 200){
                    if(res.data && res.data.msg=='ok'){
                        that.$message({
                            message: '上传成功！',
                            type: 'success'
                        });  
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

        //上传sologon
        sologonurlSetting(){
            let that  = this;
            let promise = {
                pid:that.pid,
                type:'sologonurl',
                url:that.sologonurl,
            }
            that.axios.post('/msd1223_SetImgUrl', qs.stringify(promise))
            .then(function (res) {
                console.log(res);
                console.log(res.status)
                if(res.status == 200){
                    if(res.data && res.data.msg=='ok'){
                        that.$message({
                            message: '上传成功！',
                            type: 'success'
                        }); 
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

        //上传背景图
        backImgSetting(){
            let that  = this;
            let promise = {
                pid:that.pid,
                type:'basemapurl',
                url:that.basemapurl,
            }
            that.axios.post('/msd1223_SetImgUrl', qs.stringify(promise))
            .then(function (res) {
                console.log(res);
                console.log(res.status)
                if(res.status == 200){
                    if(res.data && res.data.msg=='ok'){
                        that.$message({
                            message: '上传成功！',
                            type: 'success'
                        }); 
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

        //返回
        backPage(){
            this.$router.push({path:'/menuList', query:{pid:this.pid,state:this.isOpenState,pname:this.pname}});
        }
    }
}
</script>
<style lang="scss"  scoped>
    #uploadImg-page{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        .title{
            text-align: left;
            padding: 30px;
            font-size: 24px;
            font-weight: 800;
            box-sizing: border-box;
        }
        .back-page{
            margin-top: -2vw;
        }
    }
    .upload-box{
      width: 40%;
      height: 12vw;
      display: grid;
      grid-template-columns: 50% 40% 10%;
      box-sizing: border-box;
      text-align: left;
      .left{
        text-align: right;
        margin-right: 5.4vw;
      }
      .shili-box{
        padding-left: 1vw;
        box-sizing: border-box;
        button{
          cursor: pointer;
        }
      }
    }
</style>
<style>
.upload-demo,.el-upload{
  width: 100%;
}
.el-upload-dragger{
  width: 100% !important;
}
.el-dialog__footer{
  text-align: center !important;
}
</style>
