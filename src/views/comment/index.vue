<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.title }}</div>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增评论</el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.commentIdList.length === 0"
        @click="deleteFlag = true">
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入评论内容"
          style="width: 200px"
          @keyup.enter.native="searchComment"/>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchComment">
          搜索
        </el-button>
      </div>
    </div>
    <el-table border :data="commentList" @selection-change="selectionChange" v-loading="loading">
      <el-table-column type="selection" width="55"/>
      <el-table-column prop="userId" label="评论用户Id" align="center"/>
      <el-table-column prop="articleId" label="文章ID" align="center"/>
      <el-table-column prop="commentContent" label="评论内容" align="center"/>
      <el-table-column prop="replyUserId" label="回复用户ID" align="center"/>
      <el-table-column prop="parentId" label="父评论id" align="center"/>
      <el-table-column prop="createTime" label="创建时间" width="140" align="center">
        <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑</el-button>
          <el-button type="danger" size="mini" @click="delComment(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"/>
    <el-dialog :visible.sync="deleteFlag" width="30%">
      <div class="dialog-title-container" slot="title"><i class="el-icon-warning" style="color: #ff9900"/>提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="deleteFlag = false">取 消</el-button>
        <el-button type="primary" @click="delComment(null)"> 确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div class="dialog-title-container" slot="title" ref="commentTitle"/>
      <el-form label-width="80px" size="medium" :model="commentForm">
        <el-form-item label="评论用户">
          <el-input style="width: 250px" v-model="commentForm.userId"/>
        </el-form-item>
        <el-form-item label="文章">
          <el-input style="width: 250px" v-model="commentForm.articleId"/>
        </el-form-item>
        <el-form-item label="评论内容">
          <el-input style="width: 250px" v-model="commentForm.commentContent"/>
        </el-form-item>
        <el-form-item label="回复用户">
          <el-input style="width: 250px" v-model="commentForm.replyUserId"/>
        </el-form-item>
        <el-form-item label="父评论">
          <el-input style="width: 250px" v-model="commentForm.parentId"/>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrEditComment"> 确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAllPageCommentList, addOrEditComment, delComment, delCommentBatch } from "@/api/comment";

export default {
  created() {
    this.getAllPageCommentList()
  },
  data: function() {
    return {
      keywords: null,
      commentList: [],
      commentIdList: [],
      commentForm: {
        id: null,
        userId: '',
        articleId: '',
        commentContent: '',
        replyUserId: '',
        parentId: ''
      },
      loading: true,
      deleteFlag: false,
      addOrEdit: false,
      current: 1,
      size: 10,
      count: 0
    }
  },
  methods: {
    async addOrEditComment() {
      if (this.commentForm.userId.trim() === '') {
        this.$message.error('用户ID不能为空')
        return false
      }
      if (this.commentForm.articleId.trim() === '') {
        this.$message.error('文章ID不能为空')
        return false
      }
      if (this.commentForm.commentContent.trim() === '') {
        this.$message.error('评论内容不能为空')
        return false
      }
      const result = await addOrEditComment(this.commentForm)
      this.addOrEdit = false
      this.getAllPageCommentList()
      if (this.commentForm.id) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('新增成功')
      }
      this.commentForm = {}
    },
    async getAllPageCommentList() {
      const result = await getAllPageCommentList(this.keywords, this.current, this.size)
      this.commentList = result.list
      this.count = result.total
      this.loading = false
    },
    async delComment(commentID) {
      try {
        if (commentID) {
          await this.$confirm('您确定删除该评论吗？')
          await delComment(commentID)
        } else {
          await delCommentBatch(this.commentIdList)
        }
        this.deleteFlag = false
        this.getAllPageCommentList()
        this.$message.info('删除评论成功')
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.addOrEdit = false
      this.commentForm = {}
    },
    currentChange(current) {
      this.current = current
      this.getAllPageCommentList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageCommentList()
    },
    selectionChange(comments) {
      this.commentIdList = []
      comments.forEach((item) => {
        this.commentIdList.push(item.id)
      })
    },
    searchComment() {
      this.current = 1
      this.getAllPageCommentList()
    },
    openModel(row) {
      if (row != null) {
        this.commentForm = JSON.parse(JSON.stringify(row))
        this.$refs.commentTitle.innerHTML = '修改评论'
      } else {
        this.commentForm.id = null
        this.commentForm.userId = ''
        this.commentForm.commentContent = ''
        this.commentForm.replyUserId = ''
        this.commentForm.parentId = ''
        this.$refs.commentTitle.innerHTML = '添加评论'
      }
      this.addOrEdit = true
    }
  }
}
</script>

<style>

</style>
