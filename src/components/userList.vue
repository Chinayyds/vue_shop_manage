<template>
  <div>
      <h2>日期：{{date}}</h2>
      <div v-for="(item,index) in list" :key="index">
          <p>
            发布人：{{item.target.author.name}}
          </p>
          <h4>标题：{{item.title}}</h4>
          <!-- <img :src="item.target.cover_url" alt=""> -->
          <hr>
      </div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {
        list:[],
        date:''
    };  
  },
  methods: {},
  components: {},
  mounted() {
    this.axios.get("http://localhost:3000/home", {}).then((res) => {
      console.log(res);
      this.list=res.data.recommend_feeds
      this.date=res.data.date
    });
  },
};
</script>

<style scoped lang="less">
div{
    margin-bottom: 10px;
    h4{
        margin-bottom: 10px;
    }
}
</style>
