<template>
    <div class="menuListPage">
        <div class="title">{{pname}}&nbsp;&nbsp;&nbsp;&nbsp;{{title}}</div>
        <div class="operate-list">
            <div class="operate-left">
                <el-select v-model="RoleValue" placeholder="请选择" class="role-options" @change="RoleChange()">
                    <el-option
                    v-for="item in RoleOptions"
                    :key="item.RoleValue"
                    :label="item.RoleLabel"
                    :value="item.RoleValue">
                    </el-option>
                </el-select>
                <el-button type="primary" v-if="RoleValue =='1'" @click="addRoleChange()">{{addRoleTitle}}</el-button>
                <el-button type="primary" @click="lookEqcode()">查看二维码</el-button>
                <el-button type="primary" @click="pageSeting()">页面设置</el-button>
                <el-button type="danger" @click="delChangci()">删除场次</el-button>
            </div>
            <div class="operate-right">
                <el-button type="danger" v-if="isOpenState==='1'" @click="openStateChange()">关闭投票通道</el-button>
                <el-button type="primary" v-else @click="openStateChange()">开启投票通道</el-button>
                <el-button type="primary" @click="exportDataChange()">导出数据报告</el-button>
                <el-button type="danger" @click="clearHis()">清空答题记录</el-button>
                <el-button type="primary" @click="rankingData()">排名数据管理</el-button>
            </div> 
        </div>

        <div class="tableData-box" >
            <el-table
                :data="tableData"
                ref="dragTable"
                id="dragTable"
                style="width: 100%"
                border stripe highlight-current-row
            >
                <el-table-column
                    label="序号"
                    prop="step"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="username"
                    v-if="usernameShow"
                    label="姓名"
                   >
                </el-table-column>
                <el-table-column
                    prop="hospital"
                    v-if="scoreShow"
                    label="医院"
                >
                </el-table-column>
                <el-table-column
                    prop="keguantiscore"
                    v-if="scoreShow"
                    label="客观题分数">
                </el-table-column>
                <el-table-column
                    prop="score"
                    v-if="scoreShow"
                    label="总分">
                    <template slot-scope="scope">
                        <p v-if="scope.row.setscore>0">{{scope.row.setscore}}</p>
                        <p v-else>{{scope.row.score}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="nickname"
                    v-if="!scoreShow"
                    label="微信昵称">
                    <template slot-scope="scope">
                        <p>{{scope.row.nickname}}</p>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="headimgurl"
                    v-if="!scoreShow"
                    label="微信头像">
                    <template slot-scope="scope">
                        <p><img :src="scope.row.headimgurl" alt="" srcset=""></p>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    label="操作"
                    v-if="scoreShow"
                    width="300">
                    <template slot-scope="scope">
                        <el-button
                            @click.native.prevent="editRow(scope.row)"
                            type="text"
                            size="small">
                            修改
                        </el-button>
                        <el-button
                        @click.native.prevent="deleteRow(scope.row)"
                        type="text"
                        size="small">
                            删除
                        </el-button>
                        <el-button
                            @click.native.prevent="keguantiRow(scope.row)"
                            type="text"
                            size="small">
                            编辑客观题分数
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="RoleValue == '1'" style="text-align:left;margin-top:10px;font-size:10px;">
                备注：使用鼠标左键选中参赛选手上下拖拽即可变更选手排序。
            </div>
        </div>

        <!-- 新增 -->
        <el-dialog
            :title="addRoleTitle"
            :visible.sync="addDialogVisible"
            width="40%"
            center>
            <div class="addUserList">
                <!-- <div class="list">
                    <span>★</span>姓名：
                    <el-input v-model="addUserList.username" maxlength="20" placeholder="请输入姓名" class="input-list1"></el-input>
                </div> -->
                <div class="list">
                    <span>★</span>医院：
                    <el-input v-model="addUserList.hospital" maxlength="20" placeholder="请输入医院" class="input-list2"></el-input>
                </div>
                <div class="list">
                    手机号：
                    <el-input v-model="addUserList.mobile" maxlength="11" placeholder="请输入手机号" class="input-list3"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUserChange()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog
            :title="editRoleTitle"
            :visible.sync="editDialogVisible"
            width="40%"
            center>
            <div class="addUserList">
                <!-- <div class="list">
                    <span>★</span>姓名：
                    <el-input v-model="editUserList.username" maxlength="20" placeholder="请输入姓名" class="input-list1"></el-input>
                </div> -->
                <div class="list">
                    <span>★</span>医院：
                    <el-input v-model="editUserList.hospital" placeholder="请输入医院" class="input-list2"></el-input>
                </div>
                <div class="list">
                    手机号：
                    <el-input v-model="editUserList.mobile" placeholder="请输入手机号" class="input-list3"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserChange()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 二维码展示 -->
        <el-dialog
            :visible.sync="eqcodeDialogVisible"
            width="40%"
            center>
            <div class="eqcode-box" ref="qrcode">

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="eqcodeDialogVisible = false">关  闭</el-button>
            </span>
        </el-dialog>

        <!-- 排名数据管理 -->
        <el-dialog
            title="排名数据管理"
            :visible.sync="RankingDialogVisible"
            width="80%"
            center>
            <div class="tableData-box" >
                <el-table
                    :data="rankinTableData"
                    ref="dragTable"
                    id="dragTable"
                    style="width: 80%"
                    border stripe highlight-current-row
                >
                    <el-table-column
                        label="序号"
                        type="index"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        prop="username"
                        v-if="usernameShow"
                        label="姓名"
                       >
                    </el-table-column>
                    <el-table-column
                        prop="hospital"
                        label="医院"
                    >
                    </el-table-column>
                <!-- <el-table-column
                    prop="mobile"
                    v-if="usernameShow"
                    label="手机号">
                </el-table-column> -->
                    <el-table-column
                        prop="score"
                        v-if="scoreShow"
                        label="总分">
                        <template slot-scope="scope">
                           <input style="height:30px; text-align:center" type="number" v-model="scope.row.setscore" />
                        </template>
                    </el-table-column>
                </el-table>
                <p style="color:red;font-size:10px">*所填总分如果小于0,则显示评委正常打分成绩</p>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="RankingDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="RankingChange()">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑客观题分数 -->
        <el-dialog
            title="编辑客观题分数"
            :visible.sync="keguantiVisible"
            width="40%"
            center>
            <div class="addUserList">
                <div class="list">
                   客观题分数：
                    <el-input maxlength="8" v-model="keguantiscore" placeholder="请输入客观题分数" class="input-list3"></el-input>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="keguantiVisible = false">取 消</el-button>
                <el-button type="primary" @click="keguantiChange()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Sortable from 'sortablejs'
import QRCode from 'qrcodejs2'
import qs from 'qs'
export default {
    data(){
        return{
            sortable:null,
            tableData: [],
            rankinTableData:[],
            RoleOptions:[{
                RoleValue: '1',
                RoleLabel: '选手管理'
            }, {
                RoleValue: '2',
                RoleLabel: '评委管理'
            }],
            RoleValue: '1',
            addRoleTitle:'新增选手',
            editRoleTitle:'编辑选手',
            title:'选手管理',
            addDialogVisible:false,
            editDialogVisible:false,
            eqcodeDialogVisible:false,
            RankingDialogVisible:false,
            keguantiVisible:false,
            addUserList:{
                username:'',//姓名
                mobile:'',//手机号
                hospital:'',//医院
                usertype:'xuanshou',//用户类型
                pid:'',//PID
            },
           
            editUserList:{
                username:'',//姓名
                mobile:'',//手机号
                hospital:'',//医院
                usertype:'xuanshou',//用户类型
                id:'',//PID
            },
            openState:false,
            isOpenState:'',
            scoreShow:false,
            usernameShow:false,
            pname:'',
            timer1:null,
            keguantiscore:0,
            keguantiUserid:0
        }
    },
    components: {
        Sortable,
    },
    props: ["msg"],
    watch: {
        msg: {
            handler(newVal, oldVal) {
                console.log(newVal)
                this.openState = newVal.state;
                this.pname = newVal.pname;
                this.addUserList.pid = newVal.pid
                this.getMsgInit(newVal.pid);
                this.getStateByPid(newVal.pid);
            },
            deep: true
        }
    },
    mounted(){
        this.$nextTick(() => {
            if(this.RoleValue == '1'){
                this.initSortTable();
            }
		});
        var query=this.$route.query;
        if(query && query.pid){
            console.log(query.pid);
            this.addUserList.pid = query.pid;
            this.openState = query.state;
            this.pname = query.pname;
            this.getMsgInit(query.pid);
            this.getStateByPid(query.pid);
        }else{
            this.$router.push('/Home');
        };
    },
    created(){
        let index =  sessionStorage.getItem('index');
        console.log(index);
    },
    methods:{

        //获取表格信息
        getMsgInit(pid){
            let that = this;
            let promise = {
                pid:pid,
                usertype: that.addUserList.usertype
            }
            that.axios.post('msd1223_GetUserList',qs.stringify(promise))
            .then(function (res) {
                if(res.status && res.status ==200){
                    if(res.data.msg && res.data.msg =='ok'){
                        if(res.data.data && res.data.data.xuanshoulist && res.data.data.xuanshoulist.length>0){
                            that.tableData = [];
                            res.data.data.xuanshoulist.forEach(element => {
                                if(!element.isdeleted){
                                    that.tableData.push(element);
                                };
                                if(element.usertype == 'xuanshou'){
                                    that.scoreShow = true;
                                    that.usernameShow = false;

                                }else{
                                    that.scoreShow = false;
                                    that.usernameShow = true;
                                }
                            });
                            that.tableData = res.data.data.xuanshoulist;
                        }else{
                            that.tableData = [];
                        }
                        if(that.timer1){
                            clearInterval(that.timer1);
                        }
                        that.timer1 = setTimeout(() => {
                            that.getMsgInit(that.addUserList.pid);
                            //that.getStateByPid(that.addUserList.pid);
                        }, 3000);
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

        //获取投票通道状态
        getStateByPid(id){
            console.log('获取投票通道状态'+id);
            let that  = this;
            let promise ={
                pid:id
            };
            that.axios.post('msd1223_GetStateByPid', qs.stringify(promise))
            .then(function (res) {
                console.log(typeof res.data.data.state)
                if(res.status && res.status ==200){
                    if(res.data.msg == "ok"){
                        if(res.data.data.state === 1){
                            that.isOpenState = '1'
                        }else{
                             that.isOpenState = '0'
                        }
                   }
                }else{
                    that.$message({
                        message: '服务异常请稍后重试！',
                        type: 'warning'
                    });
                }
            })
        },
        //拖拽排序
        initSortTable() {
            var that = this
        	const tableTag = this.$refs['dragTable'].$el;
            console.log(tableTag);
			// 获取 tbody 节点
			const elTbody = tableTag.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];
            // 常用
            new Sortable(elTbody, {
                onEnd: function (evt) {
                // 获取排序之后的data数据
                that.tableData.splice(evt.newIndex, 0, that.tableData.splice(evt.oldIndex, 1)[0])
                var newArray = that.tableData.slice(0)
                that.tableData = []
                that.$nextTick(function () {
                    that.tableData = newArray
                    console.log(that.tableData);
                    let useridstr = '';
                    that.tableData.forEach(element => {
                        useridstr+=element.id+','
                    });
                    useridstr = useridstr.substring(0, useridstr.lastIndexOf(','));  
                    console.log(useridstr);
                    that.axios.get('msd1223_setuserstep?useridstr='+useridstr)
                    .then(function (res) {
                        console.log(res)
                        if(res.status && res.status ==200){
                            if(res.data.msg == "ok"){
                                //that.getMsgInit(that.addUserList.pid);
                                that.$message({
                                    type: 'success',
                                    message: '排序成功!'
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
                })
                }
            })
        },
        
        //角色切换
        RoleChange(){
            console.log(this.RoleValue);
            if(this.RoleValue == 2){
                this.addRoleTitle =  '新增评委';
                this.editRoleTitle = '编辑评委';
                this.title = '评委管理';
                this.addUserList.usertype ='pingwei';
                this.editUserList.usertype ='pingwei';
                this.usernameShow = true;
            }else{
                this.addRoleTitle = '新增选手';
                this.editRoleTitle = '编辑选手';
                this.title = '选手管理';
                this.addUserList.usertype ='xuanshou';
                this.editUserList.usertype ='xuanshou';
                this.usernameShow = false;
            }
            this.getMsgInit(this.addUserList.pid);
        },

        //新增弹窗
        addRoleChange(){
            this.addDialogVisible = true;
            this.addUserList.hospital = '';
            this.addUserList.mobile = '';
        },

        //新增用户
        addUserChange(){
             let that = this;
            // if(that.addUserList.username == ''){
            //      that.$message({
            //         message: '请输入姓名',
            //         type: 'warning'
            //     });
            // }else 
            if(that.addUserList.hospital == ''){
                that.$message({
                    message: '请输入医院',
                    type: 'warning'
                });
            }
            // else if(that.addUserList.mobile == ''){
            //     that.$message({
            //         message: '请输入手机号',
            //         type: 'warning'
            //     });
            // }else if(!that.PhoneVerify(that.addUserList.mobile.trim())){
            //     that.$message({
            //         message: '请输入正确的手机号',
            //         type: 'warning'
            //     });
            // }
            else{
                let promise = that.addUserList;
                that.axios.post('msd1223_adduser', qs.stringify(promise))
                .then(function (res) {
                    console.log(res)
                    if(res.status && res.status ==200){
                        if(res.data.msg == "ok"){
                            that.getMsgInit(that.addUserList.pid);
                            that.addDialogVisible = false;
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

        //删除用户
        deleteRow(row){
            console.log(row)
            let that = this;
             that.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                   that.axios.get('msd1223_deluser?userid='+row.id)
                    .then(function (res) {
                        if(res.status && res.status ==200){
                        if(res.data.msg == "ok"){
                            that.getMsgInit(that.addUserList.pid);
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
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
                }).catch(() => {
                that.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
           
        },

       //显示编辑弹窗
        editRow(row){
            console.log(row)
            this.editUserList = {
                id:row.id,
                username:row.username,
                mobile:row.mobile,
                usertype:row.usertype,
                hospital:row.hospital
            }
            this.editDialogVisible = true;
        },

        //编辑用户
        editUserChange(){
            let that = this;
            if(that.editUserList.username == ''){
                 that.$message({
                    message: '请输入姓名',
                    type: 'warning'
                });
            }else if(that.editUserList.hospital == ''){
                that.$message({
                    message: '请输入医院',
                    type: 'warning'
                });
            }else{
                let promise = that.editUserList;
                that.axios.post('msd1223_updateuser', qs.stringify(promise))
                .then(function (res) {
                    console.log(res)
                    if(res.status && res.status ==200){
                    if(res.data.msg == "ok"){
                        that.getMsgInit(that.addUserList.pid);
                        that.editDialogVisible = false;
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

        //编辑客观题
        keguantiRow(row){
            this.keguantiVisible = true;
            console.log(row)
            this.keguantiscore = row.keguantiscore;
            this.keguantiUserid = row.id;
        },

        //客观题分数修改
        keguantiChange(){
            let that = this;
            if(this.keguantiscore>20){
                that.$message({
                    message: '最大分数值应小于等于20分',
                    type: 'warning'
                });
            }else{
                let promise = {
                    'keguantiscore':this.keguantiscore,
                    'userid':this.keguantiUserid 
                };
                that.axios.post('msd1223_setuserkeguantiscore', qs.stringify(promise))
                .then(function (res) {
                    console.log(res)
                    if(res.status && res.status ==200){
                    if(res.data.msg == "ok"){
                        that.getMsgInit(that.addUserList.pid);
                        that.keguantiVisible = false;
                        that.$message({
                            message: '编辑成功',
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
            }
           
        },

        //页面设置
        pageSeting(row){
            console.log(row)
            this.$router.push({path: '/uploadImg', query:{pid:this.addUserList.pid,state:this.isOpenState,pname:this.pname}});
        },

        //开启/关闭投票通道
        openStateChange(){
            let that = this;
            if(this.isOpenState =='1'){
                this.isOpenState ='0'
            }else{
                this.isOpenState ='1'
            }
            let promise ={
                state:this.isOpenState,
                pid:this.addUserList.pid
            };
            that.axios.post('msd1223_setstate', qs.stringify(promise))
            .then(function (res) {
                console.log(res)
                if(res.status && res.status ==200){
                    if(res.data.msg == "ok"){
                        if(that.isOpenState == '1'){
                            that.$message({
                                type: 'success',
                                message: '开启成功!'
                            });
                        }else{
                            that.$message({
                                type: 'success',
                                message: '关闭成功!'
                            });
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

        //删除场次
        delChangci(){
            let that = this;
            this.$confirm('此操作将永久删除该场次无法恢复, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    let promise = {
                        pid:this.addUserList.pid
                    }
                    that.axios.post('msd1223_delp', qs.stringify(promise))
                    .then(function (res) {
                        console.log(res)
                        if(res.status && res.status ==200){
                            if(res.data.msg == "ok"){
                                that.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                sessionStorage.setItem('index','1-1');
                                that.$router.push({path: '/Home', query:{pid:'1-1'}});   
                                window.location.reload(true);
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
                }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消清空'
                });          
            });
        },

        //导出数据报告
        exportDataChange(){
            window.location.href = "https://api.lehuitech.com.cn/22api/wj/msd1223_GetExcel?pid="+this.addUserList.pid;
        },

        //查看二维码
        lookEqcode(){
            let that = this;
            that.eqcodeDialogVisible = true;
            let key = '6G8X5ZT2';
            this.qrcode = 'https://api.lehuitech.com.cn/WXAuthorization/wxlogin?callkey='+key+'&state='+encodeURIComponent('https://api.lehuitech.com.cn/22/wj/msdscore/#/login?pid='+this.addUserList.pid);
            // this.qrcode = 'https://api.lehuitech.com.cn/22/wj/msdscore/#/login?pid='+this.addUserList.pid
            that.$nextTick(() => {
                that.crateQrcode()
            })
        },

        // 生成二维码
        crateQrcode () {
			this.$refs.qrcode.innerHTML = ''
            this.qr = new QRCode(this.$refs.qrcode, {
            width: 300,
            height: 300, // 高度
            text: this.qrcode // 二维码内容
            // render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
            // background: '#f0f'
            // foreground: '#ff0'
            })
            // console.log(this.qrcode)
        },

         //手机号检验
        PhoneVerify(str){
            var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
            if (reg.test(str)) {
                return  true;
            }else{
                return false;
            }
        },

        //清空答题记录
        clearHis(){
            let that  = this;
            if(this.tableData.length<=0){
                this.$message({
                    message: '暂无数据',
                    type: 'warning'
                });
            }else{
                this.$confirm('此操作将永久删除该答题记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        that.axios.get('msd1223_clearData?pid='+this.addUserList.pid)
                        .then(function (res) {
                            console.log(res)
                            if(res.status && res.status ==200){
                                if(res.data.msg == "ok"){
                                    that.getMsgInit(that.addUserList.pid);
                                    that.$message({
                                        type: 'success',
                                        message: '清除成功!'
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
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消清空'
                    });          
                });
            }
        },

        //排名数据管理
        rankingData(){  
            console.log(this.tableData);
            if(this.RoleValue == '2'){
                this.$message({
                    message: '请选择选手管理',
                    type: 'warning'
                });
            }else{
                if(this.tableData.length<=0){
                    this.$message({
                        message: '暂无数据',
                        type: 'warning'
                    });
                }else{
                    this.rankinTableData = this.tableData;
                    this.RankingDialogVisible = true;
                }
            }
        },

        //排名确认
        RankingChange(){
            console.log(this.rankinTableData);
            var useridstr = '';
            var setscorestr = '';
            this.rankinTableData.forEach(element => {
                useridstr+=element.id+',';
                setscorestr += element.setscore+','
            });
            let promise ={
                useridstr:useridstr,
                setscorestr:setscorestr
            };
            console.log(promise);
            let that = this;
            that.axios.post('msd1223_Setscore', qs.stringify(promise))
            .then(function (res) {
                console.log(res)
                if(res.status && res.status ==200){
                    if(res.data.msg == "ok"){
                        that.$message({
                            type: 'success',
                            message: '操作成功!'
                        });
                        that.RankingDialogVisible = false;
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
    destroyed() {
        if (this.timer1) {
        clearInterval(this.timer1);
        }
    },
}
</script>
<style>
.el-table td, .el-table th{
    text-align: center;
}
.el-button{
    padding: 0.5vw;
}
</style>
<style  scoped  lang="scss">
    .menuListPage{
        width:100%;
        margin:0 auto;
        box-sizing: border-box;
        .title{
            text-align: left;
            padding: 30px;
            font-size: 24px;
            font-weight: 800;
            box-sizing: border-box;
        }
        .operate-list{
            width: 90%;
            margin: 0 auto;
            margin-top: 30px;
            display: grid;
            grid-template-columns: 50% 50%;
            .operate-left{
                text-align: left;
                padding-left: 30px;
                box-sizing: border-box;
            }
            .operate-right{
                text-align: right;
                padding-right: 30px;
                box-sizing: border-box;
            }
        }
        .tableData-box{
            width: 90%;
            margin: 0 auto;
            padding: 30px;
            box-sizing: border-box;
        }
        .role-options{
            margin-right: 30px;
            width: 120px;
        }
        .addUserList{
            width: 100%;
            .list{
                width: 100%;
                margin-top: 30px;
                .input-list1{
                    width: 80%;
                    margin-left: 12px;
                }
                .input-list2{
                    width: 80%;
                    margin-left: 12px;
                }
                .input-list3{
                    width: 80%;
                }
                span{
                    color: red;
                }
            }
        }
        .eqcode-box{
            width: 300px;
            height: 300px;
            margin: 0 auto;
        }
    }
</style>