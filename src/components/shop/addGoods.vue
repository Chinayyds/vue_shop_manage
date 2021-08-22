<template>
  <div>
    <!--面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 提示区 -->
      <el-alert
        title="添加商品信息"
        center
        type="info"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 步骤条区 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 侧边栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTalLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择框 -->
              <el-cascader
                expand-trigger="hover"
                :options="cateList"
                v-model="addForm.goods_cat"
                :props="cateprops"
                @change="handleChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTabData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="ite"
                  v-for="(ite, ind) in item.attr_vals"
                  :key="ind"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTabData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 上传图片 -->
            <el-upload
              :action="upLoadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" class="btnAdd" @click="addGoods"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="PreviewVisible" width="60%">
      <img :src="previewPath" class="preImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  props: {},
  data() {
    return {
      // 激活的步骤项
      activeIndex: "0",
      // 添加用户的信息
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 添加商品参数的表单验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_cat: [{ required: true, message: "请输入密码", trigger: "blur" }],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      //   商品列表
      cateList: [],
      // 级联选择框配置
      cateprops: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   动态参数数组
      manyTabData: [],
      //   静态参数数组
      onlyTabData: [],
      //   上传图片地址
      upLoadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      //   图片上传添加请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      //   图片路径
      previewPath: "",
      //   对话框显隐
      PreviewVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 请求商品分类列表
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
        // 赋值数据类表
        this.cateList = res.data.data;
        // console.log(this.cateList);
      });
    },
    //级联选择框的事件
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 标签页切换事件
    beforeTalLeave(newsN, oldN) {
      if (oldN === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message({
          message: "请先选择商品分类",
          type: "error",
          duration: "800",
        });
        return false;
      }
    },
    // 标签页切换点击事件
    tabClicked() {
      if (this.activeIndex === "1") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" },
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
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
              //   //  控制文本框的显隐
              //   item.inputVisible = false;
              //   // 文本框的值
              //   item.inputValue = "";
            });
            console.log(res.data.data);
            this.manyTabData = res.data.data;
          });
      } else if (this.activeIndex === "2") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" },
          })
          .then((res) => {
            if (res.data.meta.status != 200) {
              return this.$message({
                message: res.data.data.meta.msg,
                type: "error",
                duration: "800",
              });
            }
            // res.data.data.forEach((item) => {
            //   item.attr_vals =
            //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            //   //   //  控制文本框的显隐
            //   //   item.inputVisible = false;
            //   //   // 文本框的值
            //   //   item.inputValue = "";
            // });
            console.log(res.data.data);
            this.onlyTabData = res.data.data;
          });
      }
    },
    // 触发预览图片事件
    handlePreview(file) {
      this.previewPath = file.response.data.url;
      this.PreviewVisible = true;
    },
    // 移除图片操作
    handleRemove(file) {
      const filePath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === filePath;
      });
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功事件
    handleSuccess(response) {
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },
    //
    addGoods() {
      this.$refs.addFormRef.validate((vaild) => {
        if (!vaild)
          return this.$message({
            message: "请填写表单的必填项",
            type: "error",
          });

        let from = _.cloneDeep(this.addForm);
        from.goods_cat = from.goods_cat.join(",");
        // 处理动态参数
        this.manyTabData.forEach((item) => {
            const newinfo = {
                attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newinfo);
        });
        // 处理静态属性
        this.onlyTabData.forEach((item) => {
          const newinfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newinfo);
        });
        from.attrs= this.addForm.attrs
            // 如果成功发起添加分类请求
        this.$http.post("goods",from).then((res) => {
          // console.log(res);
          if (res.data.meta.status == 201) {

            this.$message({
              message: res.data.meta.msg,
              type: "success",
              duration: "500",
            });
            this.$router.push('/home/goods')
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
  computed: {
    // 当前选中的三级Id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return unll;
    },
  },
};
</script>

<style scoped lang="less">
.el-checkbox {
  margin: 0 7px 0 0 !important;
}
.preImg {
  width: 100%;
}
.btnAdd {
  margin: 15px;
}
</style>
