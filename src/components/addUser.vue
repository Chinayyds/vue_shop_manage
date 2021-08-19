<template>
  <div>
      <h1>{{title}}</h1>
      <ul>
          <li 
          v-for="(item,index) in list" 
          :key="index"
          >
          <!-- <p><img :src="item.cover" alt=""></p> -->
          <p><span class="tit">{{index+1}}.</span>《{{item.title}}》
          <span v-show="item.is_new" class="isnew">
              NEW
          </span>
          
          </p>
          <span class="pf">
              <span class="pft">
                  评分：
              </span>
              {{item.rate}}
              </span>
              </li>
      </ul>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
        title:'',
        list:[]
    };
  },
  methods: {},
  components: {},
    mounted() {
    this.axios.get("http://localhost:3000/movie_now", {}).then((res) => {
      console.log(res);
      this.list=res.data.subjects.list
      this.title=res.data.subjects.title
    });
  },
};
</script>

<style scoped lang="less">
li{
    width: 46%;
    float: left;
    padding: 10px 10px;
    box-sizing: border-box;
    list-style: none;
    background-color: skyblue;
    margin: 10px;
    p{
        color: #555;
    }
    .tit{
        color: rgb(225, 0, 255);
        font-size: 20px;
    }
    .pf{
        margin-left: 25px;
        color: red;
    }
    .isnew{
        color:rgb(247, 87, 12);
    }
}
</style>
