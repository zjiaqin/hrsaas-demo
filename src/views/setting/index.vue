<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!-- 角色管理页 -->
          <el-tab-pane label="角色管理">
            <!-- 添加按钮栏 -->
            <el-row style="height: 60px">
              <el-button
                type="primary"
                size="small"
                icon="el-icon-plus"
                @click="addRole"
              >
                新增角色
              </el-button>
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column
                label="序号"
                align="center"
                width="80"
                type="index"
              />
              <el-table-column
                label="角色名称"
                width="240"
                prop="name"
                align="center"
              />
              <el-table-column label="描述" prop="description" />
              <el-table-column label="操作" align="center">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success">分配权限</el-button>
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页组件 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <el-pagination
                layout="prev,pager,next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <!-- 公司信息页 -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="FormDate.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="FormDate.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="FormDate.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="FormDate.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <!-- 编辑弹出层 -->
        <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
          <el-form
            ref="roleForm"
            label-width="100px"
            :model="roleForm"
            :rules="rules"
          >
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleForm.name" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="roleForm.description" />
            </el-form-item>
          </el-form>
          <el-row slot="footer" type="flex" justify="center">
            <el-col :span="6">
              <el-button size="small" @click="btnCancel">取消</el-button>
              <el-button type="primary" size="small" @click="btnOK">
                确定
              </el-button>
            </el-col>
          </el-row>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole
} from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      FormDate: {},
      showDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '名称不得为空' }]
      }
    }
  },
  computed: {
    ...mapGetters(['companyId']),
    showTitle() {
      return this.roleForm.id ? '编辑角色' : '新增角色'
    }
  },
  created() {
    this.getRoleList()
    this.getCompanyInfo()
  },
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },
    async getCompanyInfo() {
      this.FormDate = await getCompanyInfo(this.companyId)
    },
    async deleteRole(id) {
      try {
        await this.$confirm('确认删除该角色吗')
        await deleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      } catch (error) {
        return
      }
    },
    async editRole(id) {
      this.roleForm = await getRoleDetail(id)
      this.showDialog = true
    },
    btnCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    addRole() {
      this.showDialog = true
    },
    async btnOK() {
      try {
        await this.$refs.roleForm.validate()

        if (this.roleForm.id) {
          await updateRole(this.roleForm)
          this.$message('角色更新成功')
        } else {
          // 新增业务
          await addRole(this.roleForm)
          this.$message('角色新增成功')
        }
        this.getRoleList()
        this.showDialog = false
      } catch (error) {
        return
      }
    }
  }
}
</script>

<style></style>
