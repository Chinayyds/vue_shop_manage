<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCate(scope.row.cat_id)"
            >编辑</el-button
          >
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deloneCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialog"
      width="50%"
      @close="clearaddCates"
    >
      <!-- 内容主题区 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectedKeys"
            :options="parentsList"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="parentCateChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDialog" width="50%">
      <!-- @close="cleareditRoles" -->
      <!-- 内容主题区 -->
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialog = false">取 消</el-button>
        <el-button type="primary" @click="editCateOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 提交的数据
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      cateList: [],
      //总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          // 当前列的标题
          label: "分类名称",
          prop: "cat_name",
        },
        {
          // 当前列的标题
          label: "是否有效",
          //当前定义模板列
          type: "template",
          // 当前使用的模板名称
          template: "isOk",
        },
        {
          // 当前列的标题
          label: "排序",
          //当前定义模板列
          type: "template",
          // 当前使用的模板名称
          template: "order",
        },
        {
          // 当前列的标题
          label: "操作",
          //当前定义模板列
          type: "template",
          // 当前使用的模板名称
          template: "opt",
        },
      ],
      //控制添加分类对话框的显隐
      addCateDialog: false,
      //控制编辑分类对话框的显隐
      editCateDialog: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 添加分类的名称
        cat_name: "",
        // 父级分类的Id
        cat_pid: 0,
        // 分类等级默认添加一级
        cat_level: 0,
      },
      // 添加分类名称的规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 编辑分类名称的规则
      editCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 即将编辑分类的Id
      cateId:'',
      // 保存编辑的用户信息
      editCateForm: {},
      // 父级分类的列表
      parentsList: [],
      // 指定级联选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的id数组
      selectedKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 请求商品分类列表
    getCateList() {
      this.$http.get("categories", { params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        // 赋值数据类表
        this.cateList = res.data.data.result;
        // 赋值总数据条数
        this.total = res.data.data.total;
      });
    },
    // 监听pagesize的变化
    changeSize(nsize) {
      // console.log(nsize);
      this.queryInfo.pagesize = nsize;
      this.getCateList();
    },
    // 监听页面页数
    changePage(npage) {
      // console.log(npage);
      this.queryInfo.pagenum = npage;
      this.getCateList();
    },
    // 点击展示添加分类对话框
    showAddCateDialog() {
      this.getParentCateList();
      this.addCateDialog = true;
    },
    // 获取父级分类列表
    getParentCateList() {
      this.$http.get("categories", { params: { type: 2 } }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        this.parentsList = res.data.data;
      });
    },
    // 选择项变化触发这个函数
    parentCateChange() {
      console.log(this.selectedKeys);
      if (this.selectedKeys.length > 0) {
        //父级分类的Id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        //父级分类的Id
        this.addCateForm.cat_pid = 0;
        // 当前分类等级赋值
        this.addCateForm.cat_level = 0;
      }
    },
    //点击按钮， 添加分类
    addCate() {
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加分类请求
        this.$http.post("categories", this.addCateForm).then((res) => {
          // console.log(res);
          if (res.data.meta.status == 201) {
            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
            this.addCateDialog = false;
            this.getCateList();
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
    // 监听添加分类对话框关闭事件
    clearaddCates() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 点击删除分类
    deloneCate(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(id);
          this.$http.delete("categories/" + id).then((res) => {
            if (res.data.meta.status != 200) {
              this.$message({
                type: "error",
                message: res.data.meta.msg,
              });
            }
            this.getCateList();
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
    // 点击编辑立即获取要编辑分类Id
    editCate(id) {
console.log(id);
 this.$http.get("categories/" + id).then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.editCateForm = res.data.data;
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
      this.editCateDialog = true;
    },
    // 点击提交编辑的分类
    editCateOk() {
 this.$refs.editCateFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .put("categories/" + this.editCateForm.cat_id, this.editCateForm)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.editCateDialog = false;
              this.getCateList();
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
.treetable {
  margin: 15px 0;
}
.el-cascader {
  width: 100%;
}
</style>
