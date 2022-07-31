<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCencel">
    <el-form
      ref="addEmployee"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-input
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择聘用形式"
        >
          <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-cascader
          v-model="formData.departmentName"
          v-loading="loading"
          :options="treeData"
          :props="{ label: 'name', value: 'name', emitPath: false }"
          :show-all-levels="false"
          style="width: 50%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-button size="small" @click="btnCencel">取消</el-button>
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import EmployeeEnum from '@/api/constant/employees'
import { tranListToTreeData } from '@/utils'
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      EmployeeEnum,
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { required: true, trigger: 'blur', message: '姓名不得为空' },
          { min: 1, max: 4, trigger: 'blur', message: '长度为1~4个字符' }
        ],
        mobile: [
          { required: true, trigger: 'blur', message: '手机不得为空' },
          {
            pattern: /^1[3-9]\d{9}$/,
            trigger: 'blur',
            message: '手机号码不合规'
          }
        ],
        formOfEmployment: [
          {
            required: true,
            trigger: 'blur',
            message: '聘用形势不得为空'
          }
        ],
        workNumber: [
          {
            required: true,
            trigger: 'blur',
            message: '工号不得为空'
          }
        ],
        departmentName: [
          {
            required: true,
            trigger: 'blur',
            message: '部门不得为空'
          }
        ],
        timeOfEntry: [
          {
            required: true,
            trigger: 'blur',
            message: '入职时间不得为空'
          }
        ]
      },
      treeData: [],
      loading: false
    }
  },
  methods: {
    btnCencel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.addEmployee.resetFields()
    },
    async getDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.loading = false
    },
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate()
        await addEmployee(this.formData)
        this.$message.success('新增成功')
        this.$emit('addEmployee')
        this.$emit('update:showDialog', false)
      } catch (error) {
        return
      }
    }
  }
}
</script>

<style></style>
