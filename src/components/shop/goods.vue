<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goaddgoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="170px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoods(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deloneGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20, 40, 70, 100]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
   

    <!-- 修改商品的对话框 -->
    <el-dialog title="修改商品信息" :visible.sync="editgoods" width="50%">
      <!-- 内容主题区 -->
      <el-form
        :model="editGoodsFrom"
        :rules="editGoodsFormRules"
        ref="editGoodsFormRef"
        label-width="70px"
      >
        <!-- @close="cleareditForm()" -->
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsFrom.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="goods_cat">
          <el-input v-model="editGoodsFrom.goods_cat"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input v-model="editGoodsFrom.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsFrom.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsFrom.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goods_introduce">
          <el-input v-model="editGoodsFrom.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="pics">
          <el-input v-model="editGoodsFrom.pics"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="attrs">
          <el-input v-model="editGoodsFrom.attrs"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editgoods = false">取 消</el-button>
        <el-button type="primary" @click="editGoodssInfo">确 定</el-button>
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
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 获取的数据列表
      goodslist: [],
      // 数据总数
      total: 0,
      // 添加商品对话框的显示与隐藏
      addgoods: false,
      // 修改商品信息对话框的显示与隐藏
      editgoods: false,
      // 保存查询的用户信息
      editGoodsFrom: {},
      
     
      // 修改商品的表单验证规则
      editGoodsFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_cat: [{ required: true, message: "请输入密码", trigger: "blur" }],
        goods_price: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取所有的商品列表
    getGoodsList() {
      this.$http.get("goods", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        console.log(res);
        this.goodslist = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 监听页面size
    changeSize(nsize) {
      // console.log(nsize);
      this.queryInfo.pagesize = nsize;
      this.getGoodsList();
    },
    // 监听页面页数
    changePage(npage) {
      // console.log(npage);
      this.queryInfo.pagenum = npage;
      this.getGoodsList();
    },
    // 点击添加商品跳转页面
    goaddgoods() {
      this.$router.push('/home/addGoods')
    },
    // 获取需要修改用户的信息
    editGoods(id) {
      this.$http.get("goods/" + id).then((res) => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          this.editGoodsFrom = res.data.data;
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
    // 确定修改用户信息时进行表单预验证
    editGoodssInfo() {
      this.$refs.editGoodsFormRef.validate((vaild) => {
        if (!vaild) return;
        // 如果成功发起添加用户请求
        this.$http
          .put("goods/" + this.editGoodsFrom.id, this.editGoodsFrom)
          .then((res) => {
            console.log(res);
            if (res.data.meta.status == 200) {
              this.editgoods = false;
              this.getGoodsList();
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
    // 删除单个商品
    deloneGoods(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // console.log(id);
          this.$http.delete("goods/" + id).then((res) => {
            this.getGoodsList();
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
  },
  components: {},
};
</script>

<style scoped lang="less">
</style>
