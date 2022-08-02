<template>
  <el-dialog :visible="showRoleDialog" title="分配角色" @close="btnCencel">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in list" :key="item.id" :label="item.id">
        {{ item.name }}
      </el-checkbox>
      <!-- 选项 -->
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-button size="small" @click="btnCencel">取消</el-button>
      <el-button size="small" type="primary" @click="btnOK">确认</el-button>
    </el-row>
  </el-dialog>
</template>

<script>
import { assignRoles } from '@/api/employees'
import { getUserDetailById } from '@/api/user'
import { getRoleList } from '@/api/setting'
export default {
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 角色列表
      list: [],
      // 已选角色列表
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    btnCencel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.list = rows
    },
    async getUserDetailById(id) {
      const { roleIds } = await getUserDetailById(id)
      this.roleIds = roleIds
    },
    async btnOK() {
      try {
        await assignRoles({ id: this.userId, roleIds: this.roleIds })
        this.$message.success('角色编辑成功')
      } catch (error) {
        return
      }
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style></style>
