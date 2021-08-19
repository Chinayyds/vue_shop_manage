<template>
  <div class="login">
    <el-form
      :model="formLabelAlign"
      class="login_form"
      :rules="rules"
      ref="ruleForm"
    >
      <el-form-item prop="name">
        <el-input
          v-model="formLabelAlign.name"
          placeholder="请输入用户名"
          prefix-icon="el-icon-user-solid"
        ></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input
          v-model="formLabelAlign.pwd"
          placeholder="请输入密码"
          prefix-icon="el-icon-lock"
          show-password
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="submitForm('ruleForm')"
        >登 录</el-button
      >
      <el-button type="primary" class="btn" @click="submitForm1('ruleForm')"
        >重 置</el-button
      >
    </el-form>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      formLabelAlign: {
        name: "admin",
        pwd: "123456",
      },
      ruleForm: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      rules: {
        name: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        pwd: [
          { required: true, message: "请输入正确的密码", trigger: "blur" },
          {
            min: 6,
            max: 18,
            message: "长度在 6 到 18 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http
            .post("login", {
              username: this.formLabelAlign.name,
              password: this.formLabelAlign.pwd,
            })
            .then((res) => {
              console.log(res);
              if (res.data.meta.status == 200) {
                this.$message({
                  message: res.data.meta.msg,
                  type: "success",
                  duration: "800",
                  onClose: () => {
                    this.$router.push("/home");
                  },
                });
              window.sessionStorage.setItem("token", res.data.data.token);
              }else{
                this.$message({
                  message: res.data.meta.msg,
                  type: "error",
                  duration: "800",
                });
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitForm1(formName) {
      this.$refs[formName].resetFields();
    },
    // submitForm1(formName) {
    //   this.$refs[formName].validate((valid) => {
    //     if (valid) {
    //       this.axios
    //         .post("http://127.0.0.1:8888/api/private/v1//register", {
    //           username: this.formLabelAlign.name,
    //           password: this.formLabelAlign.pwd,
    //         })
    //         .then((res) => {
    //           // console.log(res);
    //           this.$message({
    //             message: res.data.message,
    //             type: "success",
    //             duration: "800",
    //           });
    //         });
    //     } else {
    //       console.log("error submit!!");
    //       return false;
    //     }
    //   });
    // },
  },
  components: {},
};
</script>

<style scoped lang="less">
.login {
  height: 100%;
  background-color: rgb(48, 105, 91);
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_form {
  width: 35%;
  padding: 30px;
  background-color: #fff;
  border-radius: 10px;
}
.btn {
  width: 48%;
  background-color: pink;
  border: none;
}
</style>
