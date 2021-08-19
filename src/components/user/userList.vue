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
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
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
    <!-- 搜索框 -->
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      // 提交的数据
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userlist: [],
      total: 0,
    };
  },
  methods: {
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
    changeSize(nsize) {
      console.log(nsize);
      this.queryInfo.pagesize = nsize;
      this.queryAxios();
    },
    changePage(npage) {
      console.log(npage);
      this.queryInfo.pagenum = npage;
      this.queryAxios();
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
</style>
