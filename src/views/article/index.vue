<template>
  <!-- 放置表格和分页 -->
  <el-card>
    <el-table border :data="articleList">
      <el-table-column label="序号" type="index" />
      <el-table-column label="标题" prop="articleTitle" />
      <el-table-column label="分类" prop="categoryId" :formatter="formatArticleCategory" />
      <el-table-column label="缩略图" prop="articleCover" />
      <el-table-column label="文章摘要" prop="articleAbstract" />
      <el-table-column label="文章类型" prop="articleType" />
      <el-table-column label="文章状态" prop="articleStatus" :formatter="formatArticleStatus" />
      <el-table-column label="创作时间" prop="createTime" >
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" sortable="" fixed="right" width="280">
        <template v-slot="{row}">
          <el-button type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
          <el-button type="text" size="small" @click="delArticle(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-row type="flex" justify="center" align="middle" style="height: 60px">
      <el-pagination
        layout="prev, pager, next"
        :page-size="page.size"
        :current-page="page.page"
        :total="page.total"
        @current-change="changePage"
      />
    </el-row>
  </el-card>
</template>

<script>
import {delArticle, getAllArticleList} from '@/api/article'
import { getCategoryByID,getAllCategoryList } from '@/api/category'
import ArticleEnum from '@/api/constant/article'

export default {
  created() {
    this.getAllArticleList(),
    this.getAllCategoryList()
  },
  data: function () {
    return {
      loading: false,
      articleList: [],
      categoryList: [],
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      }
    }
  },
  rules: {

  },
  methods: {
    async delArticle(articleID) {
      try {
        await this.$confirm('您确定删除该文章吗？')
        await delArticle(articleID)
        this.getAllArticleList()
        this.$message.info('删除文章成功')
      } catch (error) {
        console.log(error)
      }
    },
    async  getAllArticleList() {
      const result = await getAllArticleList()
      this.articleList = result
    },
    async  getCategoryByID() {
      const result = await getCategoryByID()
      this.categoryInfo = result
    },
    async  getAllCategoryList() {
      const result = await getAllCategoryList()
      this.categoryList = result
    },
    // 格式化文章状态
    formatArticleStatus(row, column, cellValue, index) {
      const articleStatus = ArticleEnum.articleStatus.find(item => item.status === cellValue)
      return articleStatus ? articleStatus.value : '未知'
    },
    // 格式化文章分类
    formatArticleCategory(row, column, cellValue, index) {
      console.log(111)
      console.log(row)
      console.log(column)
      console.log(cellValue)
      console.log(index)
      console.log(222)
      console.log(this.categoryList)
      console.log(333)
      const articleCategory = this.categoryList.find(item => item.id === cellValue)
      return articleCategory ? articleCategory.categoryName : '未知'
    },
  },
  watch: {

  },
  computed: {
  }
}
</script>

