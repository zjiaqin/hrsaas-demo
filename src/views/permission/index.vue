<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <el-button
          slot="after"
          type="primary"
          size="small"
          @click="addPermission('0', 1)"
        >
          添加权限
        </el-button>
      </page-tools>
      <el-table border :data="list" row-key="id">
        <el-table-column align="center" label="名称" prop="name" />
        <el-table-column align="center" label="标识" prop="code" />
        <el-table-column align="center" label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type === 1"
              type="text"
              @click="addPermission(row.id, 2)"
            >
              添加
            </el-button>
            <el-button type="text" @click="updatePermission(row.id)">
              编辑
            </el-button>
            <el-button type="text" @click="delPermission(row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹出编辑页 -->
      <el-dialog :visible="showDialog" :title="showTitle" @close="btnCencel">
        <el-form
          ref="perForm"
          :model="formData"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item prop="name" label="权限名称">
            <el-input v-model="formData.name" style="width: 90%" />
          </el-form-item>
          <el-form-item prop="code" label="权限标识">
            <el-input v-model="formData.code" style="width: 90%" />
          </el-form-item>
          <el-form-item label="权限描述">
            <el-input v-model="formData.description" style="width: 90%" />
          </el-form-item>
          <el-form-item label="开启">
            <el-switch
              v-model="formData.enVisible"
              active-value="1"
              inactive-value="0"
            />
          </el-form-item>
        </el-form>
        <el-row slot="footer" type="flex" justify="center">
          <el-button size="small" @click="btnCencel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { tranListToTreeData } from '@/utils'
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList
} from '@/api/permission'
export default {
  data() {
    return {
      list: [],
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      },
      rules: {
        name: [
          { required: true, message: '权限名称不能为空', trigger: 'blur' }
        ],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      },
      showDialog: false
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    addPermission(pid, type) {
      this.formData.pid = pid
      this.formData.type = type
      this.showDialog = true
    },
    async updatePermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    async delPermission(id) {
      try {
        await this.$confirm('确定删除该数据吗？')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        return
      }
    },
    btnCencel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 开启
      }
      this.showDialog = false
      this.$refs.perForm.resetFields()
    },
    btnOK() {
      this.$refs.perForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        })
        .then(() => {
          // 提示消息
          this.$message.success('新增成功')
          this.getPermissionList()
          this.showDialog = false
        })
    }
  }
}
</script>

<style></style>
