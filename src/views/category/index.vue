<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.meta.title }}</div>
    <div class="operation-container">
      <el-button type="primary" size="small" icon="el-icon-plus" @click="openModel(null)"> 新增 </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.categoryIds.length == 0"
        @click="isDelete = true">
        批量删除
      </el-button>
      <div style="margin-left: auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入分类名"
          style="width: 200px"
          @keyup.enter.native="searchCategories" />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left: 1rem"
          @click="searchCategories">
          搜索
        </el-button>
      </div>
    </div>
    <el-table border :data="categories" @selection-change="selectionChange" v-loading="loading">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="categoryName" label="分类名" align="center" />
<!--      <el-table-column prop="articleCount" label="文章量" align="center" />-->
      <el-table-column prop="createTime" label="创建时间" align="center">
        <!-- 作用域插槽 -->
        <template slot-scope="{ row }">{{ row.createTime | formatDate }}</template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="center">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="openModel(scope.row)"> 编辑 </el-button>
          <el-button type="danger" size="mini" @click="deleteCategoryByCateID(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="isDelete" width="30%">
      <div class="dialog-title-container" slot="title"><i class="el-icon-warning" style="color: #ff9900" />提示</div>
      <div style="font-size: 1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteCategoryByCateID(null)"> 确 定 </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addOrEdit" width="30%">
      <div class="dialog-title-container" slot="title" ref="categoryTitle" />
      <el-form label-width="80px" size="medium" :model="categoryForm">
        <el-form-item label="分类名">
          <el-input v-model="categoryForm.categoryName" style="width: 220px" />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addOrEdit = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCategory"> 确 定 </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { getAllPageCategoryList, addOrEditCategory, deleteCategoryByCateID, delCateBatchByCateID } from '@/api/category'
export default {
  created() {
    // this.current = this.$store.state.pageState.category
    // this.listCategories()
    this.getAllPageCategoryList()
  },
  data: function () {
    return {
      isDelete: false,
      loading: true,
      addOrEdit: false,
      keywords: null,
      categoryIds: [],
      categories: [],
      categoryForm: {
        id: null,
        categoryName: ''
      },
      current: 1,
      size: 10,
      count: 0
    }
  },
  methods: {
    async getAllPageCategoryList() {
      const result = await getAllPageCategoryList(this.keywords, this.current, this.size)
      this.categories = result.list
      this.count = result.total
      this.loading = false
    },
    async addOrEditCategory() {
      if (this.categoryForm.categoryName.trim() === '') {
        this.$message.error('分类名不能为空')
        return false
      }
      const result = await addOrEditCategory(this.categoryForm)
      console.log(result)
      this.addOrEdit = false
      this.getAllPageCategoryList()
      if (this.categoryForm.id) {
        this.$message.success('修改成功')
      } else {
        this.$message.success('新增成功')
      }
    },
    async deleteCategoryByCateID(cateID) {
      try {
        if (cateID) {
          await this.$confirm('您确定删除该文章吗？')
          await deleteCategoryByCateID(cateID)
        } else {
          await delCateBatchByCateID(this.categoryIds)
        }
        this.isDelete = false
        this.getAllPageCategoryList()
        this.$message.info('删除分类成功')
      } catch (error) {
        console.log(error)
      }
    },
    selectionChange(categories) {
      this.categoryIds = []
      categories.forEach((item) => {
        this.categoryIds.push(item.id)
      })
    },
    searchCategories() {
      console.log(this.keywords)
      this.current = 1
      this.getAllPageCategoryList()
    },
    sizeChange(size) {
      this.size = size
      this.getAllPageCategoryList()
    },
    currentChange(current) {
      this.current = current
      this.$store.commit('updateCategoryPageState', current)
      this.listCategories()
    },
    openModel(category) {
      if (category != null) {
        this.categoryForm = JSON.parse(JSON.stringify(category))
        this.$refs.categoryTitle.innerHTML = '修改分类'
      } else {
        this.categoryForm.id = null
        this.categoryForm.categoryName = ''
        this.$refs.categoryTitle.innerHTML = '添加分类'
      }
      this.addOrEdit = true
    },
    deleteCategory(id) {
      let param = {}
      if (id == null) {
        param = { data: this.categoryIds }
      } else {
        param = { data: [id] }
      }
      this.axios.delete('/api/admin/categories', param).then(({ data }) => {
        if (data.flag) {
          this.$notify.success({
            title: '成功',
            message: data.message
          })
          this.listCategories()
        } else {
          this.$notify.error({
            title: '失败',
            message: data.message
          })
        }
        this.isDelete = false
      })
    }
    // listCategories() {
    //   this.axios
    //     .get('/api/admin/categories', {
    //       params: {
    //         current: this.current,
    //         size: this.size,
    //         keywords: this.keywords
    //       }
    //     })
    //     .then(({ data }) => {
    //       this.categories = data.data.records
    //       this.count = data.data.count
    //       this.loading = false
    //     })
    // },
    // addOrEditCategory() {
    //   console.log(123)
    //   console.log(this.categoryForm)
    //   if (this.categoryForm.categoryName.trim() === '') {
    //     this.$message.error('分类名不能为空')
    //     return false
    //   }
    //   this.axios.post('/api/admin/categories', this.categoryForm).then(({ data }) => {
    //     if (data.flag) {
    //       this.$notify.success({
    //         title: '成功',
    //         message: data.message
    //       })
    //       this.listCategories()
    //     } else {
    //       this.$notify.error({
    //         title: '失败',
    //         message: data.message
    //       })
    //     }
    //     this.addOrEdit = false
    //   })
    // }
  }
}
</script>
