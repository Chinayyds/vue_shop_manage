<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="queryAxios"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryAxios"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addusers = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userstatechange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="edituser(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deloneuser(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRoles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addusers"
      width="50%"
      @close="clearaddForm"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addusers = false">取 消</el-button>
        <el-button type="primary" @click="addoneuser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editusers" width="50%">
      <!-- 内容主题区 -->
      <el-form
        :model="editFromuser"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
        @close="cleareditForm()"
      >
        <el-form-item label="用户名">
          <el-input v-model="editFromuser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editFromuser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editFromuser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editusers = false">取 消</el-button>
        <el-button type="primary" @click="editUsersInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配用户角色的对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="setRolesuser"
      width="50%"
      @close="addrolesuser"
    >
      <!-- 内容主题区 -->
      <div>
        <p>当前的用户：{{ setRolesData.username }}</p>
        <p>当前的角色：{{ setRolesData.role_name }}</p>
        <p>
          分配的新角色：
          <el-select v-model="seleRolesId" placeholder="请选择">
            <el-option
              v-for="item in getRolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRolesuser = false">取 消</el-button>
        <el-button type="primary" @click="setUsersRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    // 自定义邮箱验证
    let checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 自定义手机验证
    let checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      // 提交的数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 用户列表
      userlist: [],
      // 用户总数
      total: 0,
      // 添加用户对话框的显示与隐藏
      addusers: false,
      // 添加用户的信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 修改用户信息对话框的显示与隐藏
      editusers: false,
      // 保存查询的用户信息
      editFromuser: {},
      // 修改用户的验证规则
      editFormRules: {
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
      },
      // 分配用户角色信息对话框的显示与隐藏
      setRolesuser: false,
      // 分配角色获取的数据
      setRolesData: {},
      // 获取所有的角色信息
      getRolesList: [],
      // 选中的角色信息的Id值
      seleRolesId: "",
    };
  },
  methods: {
    // 用户数据展示请求
    queryAxios() {
      this.$http.get("users", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        this.userlist = res.data.data.users;
        this.total = res.data.data.total;
      });
    },
    // 监听页面size
    changeSize(nsize) {
      // console.log(nsize);
      this.queryInfo.pagesize = nsize;
      this.queryAxios();
    },
    // 监听页面页数
    changePage(npage) {
      // console.log(npage);
      this.queryInfo.pagenum = npage;
      this.queryAxios();
    },
    // 监听switch开关状态
    userstatechange(userinfo) {
      // console.log(userinfo);
      this.$http
        .put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
        .then((res) => {
          // console.log(res);
          if (res.data.meta.status == 200) {
            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
          } else {
            userinfo.mg_state == !userinfo.mg_state;
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: "500",
            });
          }
        });
    },
    // 关闭添加用户的对话框时清除表单
    clearaddForm() {
      this.$refs.addFormRef.resetFields();
    },
    // 确定添加用户信息时进行表单预验证
    addoneuser() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http.post("users", this.addForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status == 201) {
            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
            this.addusers = false;
            this.queryAxios();
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: "500",
            });
          }
        });
      });
    },
    // 获取需要修改用户的信息
    edituser(id) {
      this.$http.get("users/" + id).then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.editFromuser = res.data.data;
          this.$message({
            message: res.data.meta.msg,
            type: "success",
            duration: "500",
          });
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: "500",
          });
        }
      });
      this.editusers = true;
    },
    // 关闭修改用户的对话框时清除表单
    cleareditForm() {
      this.$refs.editFormRef.resetFields();
    },
    // 确定修改用户信息时进行表单预验证
    editUsersInfo() {
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .put("users/" + this.editFromuser.id, this.editFromuser)
          .then((res) => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.editusers = false;
              this.queryAxios();
              this.$message({
                message: res.data.meta.msg,
                type: "success",
                duration: "500",
              });
            } else {
              this.$message({
                message: res.data.meta.msg,
                type: "error",
                duration: "500",
              });
            }
          });
      });
    },
    // 删除单个用户
    deloneuser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(id);
          this.$http.delete("users/" + id).then((res) => {
            this.queryAxios();
            this.$message({
              type: "error",
              message:res.data.meta.msg,
            });
            // console.log(res);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色按钮点击获取信息展示对话框
    setRoles(userInfo) {
      this.setRolesData = userInfo;
      this.$http.get("roles").then((res) => {
        // console.log(res);
        this.getRolesList = res.data.data;
      });
      this.setRolesuser = true;
    },
    // 分配角色按钮点击提交
    setUsersRoles() {
      if (!this.seleRolesId) {
        return this.$message({
          message: "请选择分配的角色",
          type: "error",
          duration: "500",
        });
      }
      this.$http
        .put(`users/${this.setRolesData.id}/role`, {
          rid: this.seleRolesId,
        })
        .then((res) => {
          console.log(res);
          if (res.data.meta.status == 200) {
            this.setRolesuser = false;
            this.queryAxios();
            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
          } else {
            this.$message({
              message: res.data.meta.msg,
              type: "error",
              duration: "500",
            });
          }
        });
    },
    // 监听分配对话框关闭事件
    addrolesuser() {
      this.seleRolesId = "";
      this.setRolesData = {};
    },
  },
  components: {},
  created() {
    this.queryAxios();
  },
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 13px;
}
.box-card {
  width: 100%;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
p {
  line-height: 34px;
}
</style>
