<template>
  <div class="home">
    <el-container class="home_cont">
      <el-header>
        <h2>欢 迎 登 录</h2>
        <button @click="tuichu()">退出登录</button>
      </el-header>
      <el-container>
        <el-aside :width="iszd ? '64px' : '200px'">
          <div class="tog_btn" @click="togbtn()">|||</div>
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
            :unique-opened="true"
            :collapse="iszd"
            :collapse-transition="false"
          >
            <el-submenu
              :index="item.id + ''"
              v-for="item in list"
              :key="item.id"
            >
              <template slot="title">
                <i :class="iconobj[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="ite.id + ''"
                v-for="ite in item.children"
                :key="ite.id"
                :route="{ path: '/home/' + ite.path }"
              >
                <i class="el-icon-menu"></i>
                {{ ite.authName }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
      list: [],
      iconobj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      iszd: false,
    };
  },
  methods: {
    tuichu() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
    // 点击按钮折叠
    togbtn() {
      this.iszd = !this.iszd;
    },
  },
  components: {},
  mounted() {
    this.$http.get("menus").then((res) => {
      console.log(res);
      this.list = res.data.data;
      if (res.data.meta.status != 200)
        return this.$message({
          message: res.data.meta.msg,
          type: "success",
          duration: "500",
        });
    });
  },
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .home_cont {
    height: 100%;
    .el-header {
      background-color: skyblue;
      text-align: center;
      button {
        float: right;
      }
    }
    .el-aside {
      background-color: #545c64;
    }
    .el-main {
      background-color: pink;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
.tog_btn {
  color: #fff;
  background-color: #ccc;
  text-align: center;
  line-height: 24px;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

