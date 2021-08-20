<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addroless = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', ind === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, ind) in scope.row.children"
              :key="item.id"
            >
              <!-- 一级菜单一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRolesId(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级菜单二级三级权限 -->
              <el-col :span="19">
                <!-- 通过for渲染二级权限 -->
                <el-row
                  :class="[ind1 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item1, ind1) in item.children"
                  :key="item1.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRolesId(scope.row, item1.id)"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      @close="removeRolesId(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="level" label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editRoles(scope.row.id)"
            >
              编辑</el-button
            >
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRoles(scope.row.id)"
            >
              删除</el-button
            >
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
                @click="showSetRightDialog(scope.row)"
                >分配角色</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="clearRightsDefkeys"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addroless"
      width="50%"
      @close="clearaddRoles"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addRoles"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="70px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addroless = false">取 消</el-button>
        <el-button type="primary" @click="addoneRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色的对话框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editroless"
      width="50%"
      @close="cleareditRoles"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editRolesxx"
        :rules="editRolesRules"
        ref="editRolesRef"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesxx.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesxx.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editroless = false">取 消</el-button>
        <el-button type="primary" @click="editoneRoles">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      rolesList: [],
      // 控制分配权限对话框的显隐
      setRightDialogVisible: false,
      //所有权限列表
      rightsList: [],
      //树形控件
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中节点的Id数组
      defKeys: [],
      // 即将分配权限的Id
      roleId: "",
      // 添加的角色信息
      addRoles: {
        roleName: "",
        roleDesc: "",
      },
      // 添加角色验证
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 添加角色验证
      editRolesRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      // 控制添加角色对话框的显隐
      addroless: false,
      // 控制编辑角色对话框的显隐
      editroless: false,
      // 保存编辑的用户信息
      editRolesxx: {},
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    getRolesList() {
      this.$http.get("roles").then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.rolesList = res.data.data;
          // this.$message({
          //   message: res.data.meta.msg,
          //   type: "success",
          //   duration: "300",
          // });
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: "500",
          });
        }
      });
    },
    // 删除权限
    removeRolesId(role, id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http.delete(`roles/${role.id}/rights/${id}`).then((res) => {
            console.log(res);
            if (res.data.meta.status == 200) {
              role.children = res.data.data;
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 分配角色的对话框
    showSetRightDialog(role) {
      this.$http.get("rights/tree").then((res) => {
        this.roleId = role.id;
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.rightsList = res.data.data;
          this.getLeafKeys(role, this.defKeys);
          this.setRightDialogVisible = true;
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
    // 通过递归的形式，获取角色权限中的三级权限的id，并保存到defKeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 监听对话框关闭时清空defkeys数组
    clearRightsDefkeys() {
      this.defKeys = [];
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      }

      this.$message.success("分配权限成功！");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
    // 关闭添加用户的对话框时清除表单
    clearaddRoles() {
      this.$refs.addRolesRef.resetFields();
    },
    // 关闭添加用户的对话框时清除表单
    cleareditRoles() {
      this.$refs.editRolesRef.resetFields();
    },
    //点击提交添加角色请求
    addoneRoles() {
      this.$refs.addRolesRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加角色请求
        this.$http.post("roles", this.addRoles).then((res) => {
          // console.log(res);
          if (res.data.meta.status == 201) {
            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
            this.addroless = false;
            this.getRolesList();
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
    // 删除角色信息
    delRoles(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(id);
          this.$http.delete("roles/" + id).then((res) => {
            // console.log(res);
            this.getRolesList();
            this.$message({
              message: res.data.meta.msg,
              type: "success",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //点击编辑显示对话框并获取信息
    editRoles(id) {
      this.$http.get("roles/" + id).then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.editRolesxx = res.data.data;
          // this.$message({
          //   message: res.data.meta.msg,
          //   type: "success",
          //   duration: "500",
          // });
        } else {
          this.$message({
            message: res.data.meta.msg,
            type: "error",
            duration: "500",
          });
        }
      });
      this.editroless = true;
    },
    // 点击确定提交编辑的角色信息
    editoneRoles() {
      this.$refs.editRolesRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .put("roles/" + this.editRolesxx.roleId, this.editRolesxx)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.editroless = false;
              this.getRolesList();
              // this.$message({
              //   message: res.data.meta.msg,
              //   type: "success",
              //   duration: "500",
              // });
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
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
