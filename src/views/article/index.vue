<template>
  <!-- 放置表格和分页 -->
  <el-card>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="goToWrite()"> 编写文章 </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.articleIdList.length == 0"
        @click="deleteFlag = true">
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入文章名称"
          style="width: 200px"
          @keyup.enter.native="searchArticle" />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchArticle">
          搜索
        </el-button>
      </div>
    </div>
    <el-table border :data="articleList"  @selection-change="selectionChange" >
      <el-table-column type="selection" width="55" />
      <el-table-column label="序号" type="index"/>
      <el-table-column label="标题" prop="articleTitle"/>
      <el-table-column label="分类" prop="categoryId" :formatter="formatArticleCategory"/>
      <el-table-column label="缩略图" prop="articleCover"/>
      <el-table-column label="文章摘要" prop="articleAbstract"/>
      <el-table-column label="文章类型" prop="articleType" :formatter="formatArticleType" />
      <el-table-column label="文章状态" prop="articleStatus" :formatter="formatArticleStatus"/>
      <el-table-column label="创作时间" prop="createTime">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" sortable="" fixed="right" width="280">
        <template v-slot="{row}">
          <el-button type="text" size="small" @click="editArticle(row.id)">编辑</el-button>
          <el-button type="text" size="small" @click="delArticle(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper" />
    <el-dialog :visible.sync="deleteFlag" width="30%">
      <div class="dialog-title-container" slot="title"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="deleteFlag = false">取 消</el-button>
        <el-button type="primary" @click="delArticle()"> 确 定 </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAllPageArticleList, delArticle, delArticleBatch } from '@/api/article'
import { getCategoryByID, getAllCategoryList } from '@/api/category'
import ArticleEnum from '@/api/constant/article'

export default {
  created() {
    this.getAllPageArticleList()
    this.getAllCategoryList()
  },
  data: function() {
    return {
      keywords: null,
      articleIdList: [],
      deleteFlag: false,
      loading: false,
      articleList: [],
      categoryList: [],
      current: 1,
      size: 10,
      count: 0
    }
  },
  rules: {},
  methods: {
    currentChange(current) {
      this.current = current
      this.getAllPageArticleList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageArticleList()
    },
    async getAllPageArticleList() {
      const result = await getAllPageArticleList(this.keywords, this.current, this.size)
      this.articleList = result.list
      this.count = result.total
      this.loading = false
    },
    selectionChange(articles) {
      this.articleIdList = []
      articles.forEach((item) => {
        this.articleIdList.push(item.id)
      })
    },
    searchArticle() {
      this.current = 1
      this.getAllPageArticleList()
    },
    editArticle(id) {
      console.log(id)
      this.$router.push(`/article/editArticle/${id}`)
    },
    goToWrite() {
      this.$router.push('/article/addArticle')
    },
    async delArticle(articleID) {
      try {
        if (articleID) {
          await this.$confirm('您确定删除该文章吗？')
          await delArticle(articleID)
        } else {
          await delArticleBatch(this.articleIdList)
        }
        this.deleteFlag = false
        this.getAllPageArticleList()
        this.$message.info('删除文章成功')
      } catch (error) {
        console.log(error)
      }
    },
    async getCategoryByID() {
      const result = await getCategoryByID()
      this.categoryInfo = result
    },
    async getAllCategoryList() {
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
      const articleCategory = this.categoryList.find(item => item.id === cellValue)
      return articleCategory ? articleCategory.categoryName : '未知'
    },
    formatArticleType(row, column, cellValue, index) {
      const articleType = ArticleEnum.articleTypeList.find(item => item.type === cellValue)
      return articleType ? articleType.value : '未知'
    }
  },
  watch: {},
  computed: {}
}
</script>

