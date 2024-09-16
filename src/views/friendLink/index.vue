<template>
  <div class="article-title-container">
    <div class="title">{{ this.$route.meta.title }}</div>
    <el-input v-model="article.articleTitle" size="medium" placeholder="输入文章标题" />
    <el-button
      type="danger"
      size="medium"
      class="save-btn">
      保存草稿
    </el-button>
    <el-button type="danger" size="medium" @click="openModel" style="margin-left: 10px"> 发布文章 </el-button>
    <el-card class="main-card">
      <mavon-editor ref="md"  style="height: calc(100vh - 260px)" />
    </el-card>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      article: {
        id: null,
        articleTitle: new Date(),
        articleContent: '',
        articleAbstract: '',
        articleCover: '',
        categoryName: null
      }
    }
  }
}
</script>

<style>

</style>
