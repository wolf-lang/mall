<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" :pull-up-load="true" @pullingUp="loadMore" @scroll="contentScroll">
      <home-swiper :banners="banners"/>
      <recommend-view :recommends="recommends"/>
      <feature-view></feature-view>
      <tab-control class="tab-control" 
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
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
      }
    },
    methods: {
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
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    created() {
      // 1.请求多个数据
      this.getHomeMultidata();
      this.getHomeGoods('pop');
      this.getHomeGoods('news');
      this.getHomeGoods('sell');
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
    position: sticky;
    top: 44px;
  }
  .content {
    height: calc(100vh - 93px);
    overflow: hidden;
  }
</style>
