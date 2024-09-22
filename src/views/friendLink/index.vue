<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.title }}</div>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增</el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.friLinkIdList.length === 0"
        @click="deleteFlag = true"
      >
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入友链名称"
          style="width: 200px"
          @keyup.enter.native="searchFriLink"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchFriLink"
        >
          搜索
        </el-button>
      </div>
    </div>

    <el-table v-loading="loading" border :data="linkList" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="friLinkAvatar" label="链接头像" align="center" width="180">
        <template slot-scope="scope">
          <img :src="scope.row.linkAvatar" width="40" height="40" alt="友链头像">
        </template>
      </el-table-column>
      <el-table-column prop="firLinkName" label="链接名" align="center" />
      <el-table-column prop="friLinkAddress" label="链接地址" align="center" />
      <el-table-column prop="friLinkIntro" label="链接介绍" align="center" />
      <el-table-column prop="createTime" label="创建时间" width="140" align="center">
        <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteFriLink(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination-container"
      background
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChange"
      @current-change="currentChange"
    />
    <el-dialog :visible.sync="deleteFlag" width="30%">
      <div slot="title" class="dialog-title-container"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="deleteFlag = false">取 消</el-button>
        <el-button type="primary" @click="deleteFriLink(null)"> 确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div slot="title" ref="linkTitle" class="dialog-title-container" />
      <el-form label-width="80px" size="medium" :model="linkForm">
        <el-form-item label="链接名">
          <el-input v-model="linkForm.firLinkName" style="width: 250px" />
        </el-form-item>
        <el-form-item label="链接头像">
          <el-input v-model="linkForm.friLinkAvatar" style="width: 250px" />
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="linkForm.friLinkAddress" style="width: 250px" />
        </el-form-item>
        <el-form-item label="链接介绍">
          <el-input v-model="linkForm.friLinkIntro" style="width: 250px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrEditFriLink"> 确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAllPageFriLinkList, addOrEditFriLink, delFriLink, delFriLinkBatch } from '@/api/friendlink'

export default {
  data: function() {
    return {
      keywords: null,
      friLinkIdList: [],
      friLinks: [],
      linkList: [],
      linkForm: {
        id: null,
        firLinkName: '',
        friLinkAvatar: '',
        friLinkIntro: '',
        friLinkAddress: ''
      },
      loading: true,
      deleteFlag: false,
      addOrEdit: false,
      current: 1,
      size: 10,
      count: 0
    }
  },
  created() {
    this.getAllPageFriLinkList()
  },
  methods: {
    async addOrEditFriLink() {
      if (this.linkForm.firLinkName.trim() === '') {
        this.$message.error('友链名称不能为空')
        return false
      }
      if (this.linkForm.friLinkAvatar.trim() === '') {
        this.$message.error('友链头像不能为空')
        return false
      }
      if (this.linkForm.friLinkIntro.trim() === '') {
        this.$message.error('友链介绍不能为空')
        return false
      }
      if (this.linkForm.friLinkAddress.trim() === '') {
        this.$message.error('友链地址不能为空')
        return false
      }
      const result = await addOrEditFriLink(this.linkForm)
      this.addOrEdit = false
      this.getAllPageFriLinkList()
      if (this.linkForm.id) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('新增成功')
      }
      this.linkForm = {}
    },
    async getAllPageFriLinkList() {
      const result = await getAllPageFriLinkList(this.keywords, this.current, this.size)
      this.linkList = result.list
      this.count = result.total
      this.loading = false
    },
    async deleteFriLink(friLinkID) {
      try {
        if (friLinkID) {
          await this.$confirm('您确定删除该文章吗？')
          await delFriLink(friLinkID)
        } else {
          await delFriLinkBatch(this.friLinkIdList)
        }
        this.deleteFlag = false
        this.getAllPageFriLinkList()
        this.$message.info('删除友链成功')
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.addOrEdit = false
      this.linkForm = {}
    },
    currentChange(current) {
      this.current = current
      this.getAllPageFriLinkList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageFriLinkList()
    },
    selectionChange(friLinks) {
      this.friLinkIdList = []
      friLinks.forEach((item) => {
        this.friLinkIdList.push(item.id)
      })
    },
    searchFriLink() {
      this.current = 1
      this.getAllPageFriLinkList()
    },
    openModel(row) {
      if (row != null) {
        this.linkForm = JSON.parse(JSON.stringify(row))
        this.$refs.linkTitle.innerHTML = '修改友链'
      } else {
        this.linkForm.id = null
        this.linkForm.linkName = ''
        this.linkForm.linkAvatar = ''
        this.linkForm.linkIntro = ''
        this.linkForm.linkAddress = ''
        this.$refs.linkTitle.innerHTML = '添加友链'
      }
      this.addOrEdit = true
    }
  }
}
</script>

<style>

</style>
