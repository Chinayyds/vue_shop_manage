<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 警告框 区域-->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
            <!-- expand-trigger="hover" -->
          <el-cascader
            :options="cateList"
            v-model="selectedCateKeys"
            :props="cateprops"
            @change="handleChange"
            clearable
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态面板 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDis"
            @click="addDialog = true"
            >添加参数</el-button
          >
          <!-- 动态表格 -->
          <el-table border stripe :data="manyTabData">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示Tag标签 -->
                <el-tag
                  closable
                  v-for="(item, ind) in scope.row.attr_vals"
                  :key="ind"
                  @close="delhand(ind, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDia(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delEditDia(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态面板 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isbtnDis"
            @click="addDialog = true"
            >添加属性</el-button
          >
          <el-table border stripe :data="onlyTabData">
           <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环展示Tag标签 -->
                <el-tag
                  closable
                  v-for="(item, ind) in scope.row.attr_vals"
                  :key="ind"
                  @close="delhand(ind, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDia(scope.row.attr_id)"
                  >编辑</el-button
                >
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="delEditDia(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialog"
      width="50%"
      @close="clearAdd"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText + '：'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addDialogOk">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialog"
      width="50%"
      @close="clearedit"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText + '：'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editDialogOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      //所有分类列表
      cateList: [],
      // 级联选择框配置
      cateprops: {
        expandTrigger:'hover',
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 级联选择框绑定的数组
      selectedCateKeys: [],
      // 激活的页签名称
      activeName: "many",
      // 动态属性数据
      manyTabData: [],
      // 静态属性数据
      onlyTabData: [],
      //控制对话框的显隐
      addDialog: false,
      editDialog: false,
      // 添加表单数据
      addForm: {},
      editForm: {},
      // 添加表单验证的规则
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获取所有的商品分类列表
    getCateList() {
      this.$http.get("categories").then((res) => {
        // console.log(res);
        if (res.data.meta.status != 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        this.cateList = res.data.data;
        // console.log(this.cateList);
      });
    },
    // 获取参数公共函数
    getparamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = [];
        this.manyTabData= [];
        this.onlyTabData= [];
        return;
      }
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName },
        })
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message({
              message: res.data.data.meta.msg,
              type: "error",
              duration: "800",
            });
          }
          res.data.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            //  控制文本框的显隐
            item.inputVisible = false;
            // 文本框的值
            item.inputValue = "";
          });
          console.log(res.data.data);
          if (this.activeName === "many") {
            this.manyTabData = res.data.data;
          } else {
            this.onlyTabData = res.data.data;
          }
        });
    },
    //级联选择框的事件
    handleChange() {
      this.getparamsData();
    },
    // tab页签点击事件
    handleTabClick() {
      // console.log(this.activeName);
      this.getparamsData();
    },

    // 监听对话框关闭事件
    clearAdd() {
      this.$refs.addFormRef.resetFields();
    },
    clearedit() {
      this.$refs.editFormRef.resetFields();
    },
    // 点击确定添加参数
    addDialogOk() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          })
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status == 201) {
              // this.$message({
              //   message: res.data.meta.msg,
              //   type: "success",
              //   duration: "500",
              // });
              this.addDialog = false;
              this.getparamsData();
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
    // 点击编辑显示对话框获取参数
    showEditDia(id) {
      this.$http
        .get(`categories/${this.cateId}/attributes/${id}`, {
          params: {
            attr_sel: this.activeName,
          },
        })
        .then((res) => {
          if (res.data.meta.status != 200) {
            return this.$message({
              message: res.data.data.meta.msg,
              type: "error",
              duration: "800",
            });
          }
          this.editForm = res.data.data;
          this.editDialog = true;
        });
    },
    // 点击提交编辑的参数
    editDialogOk() {
      this.$refs.editFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName,
            }
          )
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              // this.$message({
              //   message: res.data.meta.msg,
              //   type: "success",
              //   duration: "500",
              // });
              this.editDialog = false;
              this.getparamsData();
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
    // 点击删除分类
    delEditDia(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(id);
          this.$http
            .delete(`categories/${this.cateId}/attributes/${id}`)
            .then((res) => {
              if (res.data.meta.status != 200) {
                this.$message({
                  type: "error",
                  message: res.data.meta.msg,
                });
              }
              this.getparamsData();
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
    // 点击文本框触发的函数
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      // 发起请求保存参数
      this.saveAttrVuls(row)
      
    },
    // 保存更改后的数据
    saveAttrVuls(row){
      this.$http
        .put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        })
        .then((res) => {
          if (res.data.meta.status == 200) {
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
    // 点击显示文本框
    showInput(row) {
      row.inputVisible = true;
      //文本框自动获取焦点
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除参数可选项
    delhand(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVuls(row)
    },
  },
  computed: {
    // 是否禁用按钮
    isbtnDis() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级Id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return unll;
    },
    // 动态计算打开哪个对话框
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
};
</script>

<style scoped lang="less">
.cat_opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>
