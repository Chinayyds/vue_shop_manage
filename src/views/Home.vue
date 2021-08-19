<template>
  <div class="home">
    <el-container class="home_cont">
      <el-header>
        <h2>欢 迎 登 录</h2>
        <button @click="tuichu()">退出登录</button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :router="true"
            :unique-opened="true"
          >
            <el-submenu :index="item.id" v-for="item in list" :key="item.id">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ item.authName }}</span>
              </template>
              <el-menu-item
                :index="ite.id"
                v-for="ite in item.children"
                :key="ite.id"
                :route="{ path: '/home/' + ite.path }"
                >{{ ite.authName }}</el-menu-item
              >
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
    };
  },
  methods: {
    tuichu() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  components: {},
  // mounted() {
  //   this.axios.get("http://127.0.0.1:8888/api/private/v1//sliderbar").then((res) => {
  //   //   console.log(res);
  //     this.list = res.data.list;
  //   });
  // },
};
</script>

<style scoped lang="less">
.home {
  height: 100%;
  .home_cont {
    height: 100%;
    .el-header {
      background-color: skyblue;
      margin-bottom: 10px;
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
</style>

