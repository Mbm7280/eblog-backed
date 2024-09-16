<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.title }}</div>
    <el-input v-model="article.articleTitle" size="medium" placeholder="输入文章标题" />
    <el-button type="danger" size="medium" @click="openModel">发布文章</el-button>
    <div>
      <mavon-editor ref="md" v-model="article.articleContent" style="height: calc(100vh - 260px)" />
    </div>
    <!-- 弹框 -->
    <el-dialog :visible.sync="addOrEdit" width="40%" top="3vh">
      <div class="dialog-title-container" slot="title">发布文章1</div>
      <el-form label-width="80px" size="medium" :model="article">
        <el-form-item label="文章分类">
          <el-tag
            type="success"
            v-show="article.categoryName"
            style="margin: 0 1rem 0 0"
            :closable="true"
            @close="removeCategory"
          >
            {{ article.categoryName }}
          </el-tag>
          <!-- 文章分类列表 -->
          <el-popover placement="bottom-start" width="460" trigger="click" v-if="!article.categoryName">
            <div class="popover-title">分类</div>
            <el-autocomplete
              style="width: 100%"
              v-model="categoryName"
              :fetch-suggestions="getAllCategoryListByCateName"
              placeholder="请输入分类名搜索，enter可添加自定义分类"
              :trigger-on-focus="false"
              @keyup.enter.native="saveCategory"
              @select="handleSelectCategories">
              <template slot-scope="{ item }">
                <div>{{ item.categoryName }}</div>
              </template>
            </el-autocomplete>
            <div class="popover-container">
              <div v-for="item of categorys" :key="item.id" class="category-item" @click="addCategory(item)">
                {{ item.categoryName }}
              </div>
            </div>
            <el-button type="success" plain slot="reference" size="small"> 添加分类 </el-button>
          </el-popover>
        </el-form-item>
        <!-- 文章类型 -->
        <el-form-item label="文章类型">
          <el-select v-model="article.articleType" placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.type" :label="item.desc" :value="item.type" />
          </el-select>
        </el-form-item>
        <el-form-item label="原文地址" v-if="article.articleType !== 'ORIGINAL'">
          <el-input v-model="article.originalUrl" placeholder="请填写原文链接" />
        </el-form-item>
        <!-- 文章封面 -->
        <el-form-item label="上传封面">
          <el-upload
            class="upload-cover"
            drag
            action="/api/admin/articles/images"
            multiple
            :headers="headers"
            :before-upload="beforeUpload"
            :on-success="uploadCover">
            <i class="el-icon-upload" v-if="article.articleCover == ''" />
            <div class="el-upload__text" v-if="article.articleCover == ''">将文件拖到此处，或<em>点击上传</em></div>
            <img v-else :src="article.articleCover" width="360px" height="180px" />
          </el-upload>
        </el-form-item>
        <el-form-item label="文章摘要">
          <el-input type="textarea" autosize="true" v-model="article.articleAbstract" placeholder="默认取文章前500个字符" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="danger" @click="saveOrUpdateArticle"> 发 表 </el-button>
      </div>
    </el-dialog>
  </el-card>

</template>

<script>
import { getAllCategoryListByCateName, getAllCategoryList } from '@/api/category'
import { addOrEditArticle, getArticleByArticleID } from '@/api/article'

export default {
  created() {
    const path = this.$route.path
    const arr = path.split('/')
    const articleID = arr[3]
    if (articleID !== '' && articleID !== undefined) {
      // 根据 articleId 获取对应的文章信息
      this.getArticleByArticleID(articleID)
    }
  },
  data: function() {
    return {
      categorys: [],
      addOrEdit: false,
      categoryName: '',
      categoryId: '',
      typeList: [
        {
          type: 'ORIGINAL',
          desc: '原创'
        },
        {
          type: 'REPRINT',
          desc: '转载'
        },
        {
          type: 'TRANSLATION',
          desc: '翻译'
        }
      ],
      article: {
        articleTitle: '',
        articleContent: '',
        categoryId: '',
        categoryName: '',
        articleType: 'ORIGINAL',
        originalUrl: '',
        articleCover: '',
        articleAbstract: ''
      }
    }
  },
  methods: {
    async getAllCategoryList() {
      const result = await getAllCategoryList()
      this.categorys = result
    },
    async getArticleByArticleID(articleID) {
      const result = await getArticleByArticleID(articleID)
      this.article = result
    },
    openModel() {
      if (this.article.articleTitle.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.articleContent.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      this.getAllCategoryList()
      this.addOrEdit = true
    },
    // 获取所有文章分类信息
    async getAllCategoryListByCateName(keywords, cb) {
      const result = await getAllCategoryListByCateName(keywords)
      cb(result)
    },
    // 分类选择
    handleSelectCategories(item) {
      console.log(111)
      console.log(item)
      this.addCategory({
        categoryName: item.categoryName,
        categoryId: item.id
      })
    },
    saveCategory() {
      if (this.categoryName.trim() !== '') {
        this.addCategory({
          categoryName: this.categoryName,
          categoryId: this.categoryId
        })
        this.categoryName = ''
      }
    },
    // 新增文章分类信息
    addCategory(item) {
      console.log(222)
      console.log(item)
      this.article.categoryName = item.categoryName
      this.article.categoryId = item.id
    },
    // 去除文章分类信息
    removeCategory() {
      this.article.categoryName = null
      this.article.categoryId = null
    },
    // 编辑或者修改文章
    async saveOrUpdateArticle() {
      if (this.article.articleTitle.trim() === '') {
        this.$message.error('文章标题不能为空')
        return false
      }
      if (this.article.articleContent.trim() === '') {
        this.$message.error('文章内容不能为空')
        return false
      }
      if (this.article.categoryName === null) {
        this.$message.error('文章分类不能为空')
        return false
      }
      if (this.article.articleType.trim() === '') {
        this.$message.error('文章类型不能为空')
        return false
      }
      // if (this.article.articleCover.trim() === '') {
      //   this.$message.error('文章封面不能为空')
      //   return false
      // }
      // 调用后端方法
      const result = await addOrEditArticle(this.article)
      if (!result) {
        if (this.article.id) {
          this.$message.success('修改文章成功')
        } else {
          this.$message.success('发布文章成功')
        }
        this.$router.push('/article')
      } else {
        this.$message.error('发布文章失败')
      }
      this.addOrEdit = false
    }
  }
}
</script>
