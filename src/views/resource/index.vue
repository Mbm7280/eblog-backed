<template>
  <div class="article-title-container">
    <div class="title">{{ this.$route.meta.title }}</div>
    <el-card class="main-card">
      <div class="operation-container">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增资源 </el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          :disabled="this.resourceIdList.length == 0"
          @click="deleteFlag = true">
          批量删除
        </el-button>
        <div style="margin-left: auto">
          <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入友链名"
            style="width: 200px"
            @keyup.enter.native="searchResourceLink" />
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left: 1rem"
            @click="searchResourceLink">
            搜索
          </el-button>
        </div>
      </div>

      <el-table border :data="resourceList" @selection-change="selectionChange" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="resName" label="资源名称" align="center" />
        <el-table-column prop="resDesc" label="资源介绍" align="center" />
        <el-table-column prop="resUrl" label="资源路径" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="140" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="mini" @click="delResource(scope.row.id)">删除</el-button>
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
        layout="total, sizes, prev, pager, next, jumper" />
      <el-dialog :visible.sync="deleteFlag" width="30%">
        <div class="dialog-title-container" slot="title"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
        <div style="font-size: 1rem">是否删除选中项？</div>
        <div slot="footer">
          <el-button @click="deleteFlag = false">取 消</el-button>
          <el-button type="primary" @click="delResource(null)"> 确 定 </el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="addOrEdit" width="30%">
        <div class="dialog-title-container" slot="title" ref="resourceTitle" />
        <el-form label-width="80px" size="medium" :model="resForm">
          <el-form-item label="资源名称">
            <el-input style="width: 250px" v-model="resForm.resName" />
          </el-form-item>
          <el-form-item label="资源介绍">
            <el-input style="width: 250px" v-model="resForm.resDesc" />
          </el-form-item>
          <el-form-item label="资源url">
            <el-input style="width: 250px" v-model="resForm.resUrl" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addOrEditResource"> 确 定 </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getAllPageResourceList, addOrEditResource, delResource, delResourceBatch } from "@/api/resource";

export default {
  created() {
    this.getAllPageResourceList()
  },
  data: function() {
    return {
      loading: true,
      deleteFlag: false,
      keywords: null,
      resources: [],
      resForm: {
        id: null,
        resName: '',
        resDesc: '',
        resUrl: ''
      },
      resourceList: [],
      resourceIdList: [],
      addOrEdit: false,
      current: 1,
      size: 10,
      count: 0
    }
  },
  methods: {
    async addOrEditResource() {
      if (this.resForm.resName.trim() === '') {
        this.$message.error('资源名称不能为空')
        return false
      }
      if (this.resForm.resDesc.trim() === '') {
        this.$message.error('资源介绍不能为空')
        return false
      }
      if (this.resForm.resUrl.trim() === '') {
        this.$message.error('资源路径不能为空')
        return false
      }
      const result = await addOrEditResource(this.resForm)
      this.addOrEdit = false
      this.getAllPageResourceList()
      if (this.resForm.id) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('新增成功')
      }
      this.resForm = {}
    },
    async getAllPageResourceList() {
      const result = await getAllPageResourceList(this.keywords, this.current, this.size)
      this.resourceList = result.list
      this.count = result.total
      this.loading = false
    },
    async delResource(resID) {
      try {
        if (resID) {
          await this.$confirm('您确定删除该资源吗？')
          await delResource(resID)
        } else {
          await delResourceBatch(this.resourceIdList)
        }
        this.deleteFlag = false
        this.getAllPageResourceList()
        this.$message.info('删除资源成功')
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.addOrEdit = false
      this.resForm = {}
    },
    currentChange(current) {
      this.current = current
      this.getAllPageResourceList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageResourceList()
    },
    selectionChange(resources) {
      this.resourceIdList = []
      resources.forEach((item) => {
        this.resourceIdList.push(item.id)
      })
    },
    searchResourceLink() {
      this.current = 1
      this.getAllPageResourceList()
    },
    openModel(row) {
      if (row != null) {
        this.resForm = JSON.parse(JSON.stringify(row))
        this.$refs.resourceTitle.innerHTML = '修改资源'
      } else {
        this.resForm.id = null
        this.resForm.resName = ''
        this.resForm.resDesc = ''
        this.resForm.resUrl = ''
        this.$refs.resourceTitle.innerHTML = '添加资源'
      }
      this.addOrEdit = true
    }
  }
}
</script>

<style>

</style>
