<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control class="tab-control" 
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        v-show="isShowTabControl"
        ref="tabControl1"
      ></tab-control>
    <scroll class="content" 
        ref="scroll" 
        :probe-type="3" 
        :pull-up-load="true" 
        @pullingUp="loadMore" 
        @scroll="contentScroll">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control 
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="goods[currentType].list"></goods-list>
    </scroll>
    <back-top v-show="isShowBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import HomeSwiper from './childComps/HomeSwiper'
  import RecommendView from './childComps/RecommendView'
  import FeatureView from './childComps/FeatureView';

  import NavBar from 'components/common/navbar/NavBar';
  import TabControl from 'components/content/tabControl/TabControl';
  import {getHomeMultidata, getHomeGoods} from "network/home";

  import GoodsList from 'components/content/goodsList/GoodsList';

  import Scroll from 'components/common/scroll/Scroll';

  import BackTop from 'components/content/backTop/BackTop';

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      TabControl,
      GoodsList,
      Scroll,
      BackTop,
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'news': {page: 1, list: []},
          'sell': {page: 2, list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        isShowTabControl: false,
        tabOffsetTop: 0,
        saveY: 0,
      }
    },
    methods: {
      debounce(func, delay) {
        let timer = null;
        let context = this;
        return function(...args){
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            func.apply(context, args);
          }, delay);
        }
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
        this.$refs.scroll.refresh();
      },
      tabClick(index) {
        this.currentType = Object.keys(this.goods)[index];
        console.log(index);
      },
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          // this.result = res;
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        });
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1;
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...(res.slice(30 * this.goods[type].page, 30 * page)))
          this.goods[type].page += 1;
          this.$refs.scroll.finishPullUp();
        })
      },
      backClick() {
        this.$refs.scroll.backTop();
      },
      contentScroll(position) {
        this.isShowBackTop = -position.y > 1000;
        this.isShowTabControl = (-position.y) > this.tabOffsetTop;
        console.log(this.isShowTabControl);
      },
      swiperImageLoad() {
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
      },
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      },
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata();
      this.getHomeGoods('pop');
      this.getHomeGoods('news');
      this.getHomeGoods('sell');

    },
    mounted() {
      const refresh = this.debounce(this.$refs.scroll.refresh, 50)
      this.$bus.$on('itemImageLoad', () => {
        refresh();
      })
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      this.$refs.scroll.refresh();
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY;
    }
  }
</script>

<style scoped>
  
  #home {
    padding-top: 44px;
  }

  .home-nav {
    background-color: var(--color-tint);
    color: #fff;

    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 44px;
    z-index: 999;
  }

  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    height: calc(100vh - 93px);
    overflow: hidden;
  }
</style>
