<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索框 -->
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="geiOrderList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="geiOrderList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"> </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="orderList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200px">
          <template>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox"
            ></el-button>
            <!-- 物流按钮 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showBoxPropres"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="changeSize"
        @current-change="changePage"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="clearAdd"
    >
      <el-form
        :model="addRessForm"
        :rules="addRessFormRules"
        ref="addRessFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="cityData"
            v-model="addRessForm.address1"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addRessForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="propresVisible"
      width="50%"
    >
    <!-- timeline 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in propresInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="propresVisible = false">取 消</el-button>
        <el-button type="primary" @click="propresVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cityData from "./citydata.js";
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
      // 获取的数据
      orderList: [],
      total: 0,
      // 修改地址对话框的显示与隐藏
      addressVisible: false,
      // 物流对话框的显示与隐藏
      propresVisible: false,
      //
      addRessForm: {
        address1: [],
        address2: "",
      },
      addRessFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      // 省市区县
      cityData,
      // 物流信息
      propresInfo: [],
    };
  },
  created() {
    this.geiOrderList();
  },
  methods: {
    // 请求数据列表
    geiOrderList() {
      this.$http.get("orders", { params: this.queryInfo }).then((res) => {
        if (res.data.meta.status !== 200) {
          return this.$message({
            message: res.data.data.meta.msg,
            type: "error",
            duration: "800",
          });
        }
        this.orderList = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 监听页面size
    changeSize(nsize) {
      // console.log(nsize);
      this.queryInfo.pagesize = nsize;
      this.geiOrderList();
    },
    // 监听页面页数
    changePage(npage) {
      // console.log(npage);
      this.queryInfo.pagenum = npage;
      this.geiOrderList();
    },
    // 展示修改地址对话框
    showBox() {
      this.addressVisible = true;
    },
    // 监听对话框关闭事件
    clearAdd() {
      this.$refs.addRessFormRef.resetFields();
    },
    // 物流事件处理函数
    showBoxPropres() {
      // this.$http.get("/kuaidi/1106975712662").then((res) => {
      //   if (res.data.meta.status !== 200) {
      //     return this.$message({
      //       message: res.data.data.meta.msg,
      //       type: "error",
      //       duration: "800",
      //     });
      //   }
      //       console.log(res);
      //   this.propresInfo = res.data.data;
      //   // this.total = res.data.data.total;
      // });
      this.propresVisible = true;
    },
  },
  components: {},
};
</script>

<style scoped lang="less">
.el-breadcrumb {
  margin-bottom: 15px;
  font-size: 13px;
}
.el-cascader {
  width: 100%;
}
</style>
