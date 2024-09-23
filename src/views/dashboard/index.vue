<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myfangwenliang" style="color: #40c9c6" />
          </div>
          <div class="card-desc">
            <div class="card-title">访问量</div>
            <div class="card-count">{{ viewsCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-myuser" style="color: #34bfa3" />
          </div>
          <div class="card-desc">
            <div class="card-title">用户量</div>
            <div class="card-count">{{ userCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="iconfont el-icon-mywenzhang-copy" style="color: #f4516c" />
          </div>
          <div class="card-desc">
            <div class="card-title">文章量</div>
            <div class="card-count">{{ articleCount }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="card-icon-container">
            <i class="el-icon-s-comment" style="color: #36a3f7" />
          </div>
          <div class="card-desc">
            <div class="card-title">评论量</div>
            <div class="card-count">{{ commentCount }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 1.25rem">
<!--      <el-col :span="16">-->
<!--        <el-card>-->
<!--          <div class="e-title">文章浏览量排行</div>-->
<!--          <div style="height: 350px">-->
<!--            <v-chart :options="ariticleRank" v-loading="loading" />-->
<!--          </div>-->
<!--        </el-card>-->
<!--      </el-col>-->
      <el-col :span="8">
        <el-card>
          <div class="e-title">文章分类统计</div>
          <div style="height: 350px">
            <v-chart :options="category" v-loading="loading" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHomepageInfo } from '@/api/homepage'

export default {
  created() {
    // this.listUserArea()
    // this.getData()
    this.getHomepageInfo()
  },
  data: function() {
    return {
      loading: true,
      type: 1,
      viewsCount: 0,
      commentCount: 0,
      userCount: 0,
      articleCount: 0,
      ariticleRank: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        color: ['#58AFFF'],
        grid: {
          left: '0%',
          right: '0%',
          bottom: '0%',
          top: '10%',
          containLabel: true
        },
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [
          {
            name: ['浏览量'],
            type: 'bar',
            data: []
          }
        ]
      },
      category: {
        color: ['#7EC0EE', '#FF9F7F', '#FFD700', '#C9C9C9', '#E066FF', '#36dc59', '#C0FF3E'],
        legend: {
          data: [],
          bottom: 'bottom'
        },
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: '文章分类',
            type: 'pie',
            roseType: 'radius',
            data: []
          }
        ]
      },

    }
  },
  methods: {
    async getHomepageInfo() {
      const result = await getHomepageInfo()
      // TODO 访问量
      this.userCount = result.userCount
      this.articleCount = result.articleCount
      this.commentCount = result.commentCount
      if (result.articleCountResDTOList) {
        result.articleCountResDTOList.forEach(item => {
          this.category.series[0].data.push({
            value: item.articleCount,
            name: item.categoryName
          })
          this.category.legend.data.push(item.categoryName)
        })
      }
      this.loading = false

      //     if (data.data.categoryDTOs != null) {
      //       data.data.categoryDTOs.forEach((item) => {
      //         this.category.series[0].data.push({
      //           value: item.articleCount,
      //           name: item.categoryName
      //         })
    }
    // getData() {
    //   this.axios.get('/api/admin').then(({ data }) => {
    //     this.viewsCount = data.data.viewsCount
    //     this.messageCount = data.data.messageCount
    //     this.userCount = data.data.userCount
    //     this.articleCount = data.data.articleCount
    //
    //     if (data.data.categoryDTOs != null) {
    //       data.data.categoryDTOs.forEach((item) => {
    //         this.category.series[0].data.push({
    //           value: item.articleCount,
    //           name: item.categoryName
    //         })
    //         this.category.legend.data.push(item.categoryName)
    //       })
    //     }
    //
    //     if (data.data.articleRankDTOs != null) {
    //       data.data.articleRankDTOs.forEach((item) => {
    //         this.ariticleRank.series[0].data.push(item.viewsCount)
    //         this.ariticleRank.xAxis.data.push(item.articleTitle)
    //       })
    //     }
    //
    //     this.loading = false
    //   })
    // }
  },
  watch: {
    type() {
      this.listUserArea()
    }
  }
}
</script>

<style scoped>
.card-icon-container {
  display: inline-block;
  font-size: 3rem;
}
.area-wrapper {
  display: flex;
  justify-content: center;
}
.card-desc {
  font-weight: bold;
  float: right;
}
.card-title {
  margin-top: 0.3rem;
  line-height: 18px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 1rem;
}
.card-count {
  margin-top: 0.75rem;
  color: #666;
  font-size: 1.25rem;
}
.echarts {
  width: 100%;
  height: 100%;
}
.e-title {
  font-size: 13px;
  color: #202a34;
  font-weight: 700;
}
</style>
