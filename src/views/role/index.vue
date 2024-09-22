<template>
  <div class="article-title-container">
    <div class="title">{{ this.$route.meta.title }}</div>
    <el-card class="main-card">
      <div class="operation-container">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增角色 </el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          :disabled="this.roleIdList.length == 0"
          @click="deleteFlag = true">
          批量删除
        </el-button>
        <div style="margin-left: auto">
          <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            size="small"
            placeholder="请输入角色名称"
            style="width: 200px"
            @keyup.enter.native="searchRole" />
          <el-button
            type="primary"
            size="small"
            icon="el-icon-search"
            style="margin-left: 1rem"
            @click="searchRole">
            搜索
          </el-button>
        </div>
      </div>

      <el-table border :data="roleList" @selection-change="selectionChange" v-loading="loading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="roleName" label="角色名称" align="center" />
        <el-table-column prop="roleDesc" label="角色介绍" align="center" />
        <el-table-column prop="createTime" label="创建时间" width="140" align="center">
          <!-- 作用域插槽 -->
          <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
            <el-button type="danger" size="mini" @click="delRole(scope.row.id)">删除</el-button>
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
          <el-button type="primary" @click="delRole(null)"> 确 定 </el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="addOrEdit" width="30%">
        <div class="dialog-title-container" slot="title" ref="roleTitle" />
        <el-form label-width="80px" size="medium" :model="resForm">
          <el-form-item label="角色名称">
            <el-input style="width: 250px" v-model="roleForm.roleName" />
          </el-form-item>
          <el-form-item label="角色介绍">
            <el-input style="width: 250px" v-model="roleForm.roleDesc" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="addOrEditRole"> 确 定 </el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getAllPageRoleList, addOrEditRole, delRole, delRoleBatch } from "@/api/role";

export default {
  created() {
    this.getAllPageRoleList()
  },
  data: function() {
    return {
      loading: true,
      deleteFlag: false,
      keywords: null,
      resources: [],
      roleForm: {
        id: null,
        roleName: '',
        roleDesc: ''
      },
      roleList: [],
      roleIdList: [],
      addOrEdit: false,
      current: 1,
      size: 10,
      count: 0
    }
  },
  methods: {
    async addOrEditRole() {
      if (this.roleForm.roleName.trim() === '') {
        this.$message.error('角色名称不能为空')
        return false
      }
      if (this.roleForm.roleDesc.trim() === '') {
        this.$message.error('角色介绍不能为空')
        return false
      }
      const result = await addOrEditRole(this.roleForm)
      this.addOrEdit = false
      this.getAllPageRoleList()
      if (this.roleForm.id) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('新增成功')
      }
      this.roleForm = {}
    },
    async getAllPageRoleList() {
      const result = await getAllPageRoleList(this.keywords, this.current, this.size)
      this.roleList = result.list
      this.count = result.total
      this.loading = false
    },
    async delRole(roleID) {
      try {
        if (roleID) {
          await this.$confirm('您确定删除该角色吗？')
          await delRole(roleID)
        } else {
          await delRoleBatch(this.roleIdList)
        }
        this.deleteFlag = false
        this.getAllPageRoleList()
        this.$message.info('删除角色成功')
      } catch (error) {
        console.log(error)
      }
    },
    closeDialog() {
      this.addOrEdit = false
      this.roleForm = {}
    },
    currentChange(current) {
      this.current = current
      this.getAllPageRoleList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageRoleList()
    },
    selectionChange(resources) {
      this.roleIdList = []
      resources.forEach((item) => {
        this.roleIdList.push(item.id)
      })
    },
    searchRole() {
      this.current = 1
      this.getAllPageRoleList()
    },
    openModel(row) {
      if (row != null) {
        this.roleForm = JSON.parse(JSON.stringify(row))
        this.$refs.roleTitle.innerHTML = '修改资源'
      } else {
        this.roleForm.id = null
        this.roleForm.resName = ''
        this.roleForm.resDesc = ''
        this.roleForm.resUrl = ''
        this.$refs.roleTitle.innerHTML = '添加资源'
      }
      this.addOrEdit = true
    }
  }
}
</script>

<style>

</style>
