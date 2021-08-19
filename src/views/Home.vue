<template>
  <div class="home">
    <el-container class="home_cont">
      <el-header>
        <div>
          <img src="@/assets/img/timg.jpg" alt="" />
          <span>德 玛 西 亚 酒 店 后 台 管 理 系 统</span>
        </div>
        <el-button type="info" @click="tuichu()">退出登录</el-button>
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
                <!-- 图标 -->
                <i :class="iconobj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>

              <!-- 二级菜单 -->
              <el-menu-item
                :index="ite.id + ''"
                v-for="ite in item.children"
                :key="ite.id"
                :route="{ path: '/home/' + ite.path }"
              >
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
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
      ztm: "",
    };
  },
  // 方法
  methods: {
    // 退出按钮
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
  created(){
    this.ztm = window.sessionStorage.getItem("ztm");

  },
  mounted() {
    this.$http.get("menus").then((res) => {
      // console.log(res);
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
      background-color: #373d41;
      padding-left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      font-size: 20px;
      > div {
        display: flex;
        align-items: center;
        span {
          padding-left: 20px;
        }
      }
      img {
        height: 60px;
      }
    }
    .el-aside {
      background-color: #545c64;
      .el-menu{
        border: none;
      }
    }
    .el-main {
      background-color: #eee;
    }
  }
}
.iconfont {
  margin-right: 10px;
}
.tog_btn {
  color: #fff;
  background-color: #475163;
  text-align: center;
  line-height: 24px;
  font-size: 10px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>

