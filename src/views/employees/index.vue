<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <span slot="before">共{{ page.total }}条记录</span>
        <template slot="after">
          <el-button
            type="success"
            size="small"
            @click="$router.push('/import?type=user')"
          >
            excel导入
          </el-button>
          <el-button type="danger" size="small" @click="exportData">
            excel导出
          </el-button>
          <el-button type="primary" size="small" @click="btnAdd">
            新增员工
          </el-button>
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column
            label="序号"
            type="index"
            sortable=""
            align="center"
          />
          <el-table-column
            label="姓名"
            prop="username"
            sortable=""
            align="center"
          />
          <el-table-column label="头像" align="center">
            <template slot-scope="{ row }">
              <img
                slot="reference"
                v-imageerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
                @click="showQrCode(row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="工号"
            prop="workNumber"
            sortable=""
            align="center"
          />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            sortable=""
            align="center"
            :formatter="formatEmployment"
          />
          <el-table-column
            label="部门"
            prop="departmentName"
            sortable=""
            align="center"
          />
          <el-table-column
            label="入职时间"
            prop="timeOfEntry"
            sortable=""
            align="center"
          >
            <template v-slot="{ row }">
              {{ row.createTime | formatDate }}
            </template>
          </el-table-column>
          <el-table-column
            label="账户状态"
            prop="enableState"
            sortable=""
            align="center"
          >
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            sortable=""
            fixed="right"
            width="280"
            align="center"
          >
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`employees/detail/${row.id}`)"
              >
                查看
              </el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">
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
            :page-size="page.size"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
      <!-- 员工弹窗编辑组件 -->
      <add-employee
        :show-dialog.sync="showDialog"
        @addEmployee="getEmployeeList"
      />
      <el-dialog :visible.sync="showCodeDialog" title="二维码">
        <el-row type="flex" justify="center">
          <canvas ref="myCanvas"></canvas>
        </el-row>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import QrCode from 'qrcode'
import AddEmployee from './components/AddEmployee.vue'
import EmployeeEnum from '@/api/constant/employees'
import { getEmployeeList, delEmployee } from '@/api/employees'
import { formatDate } from '@/filters'
export default {
  components: {
    AddEmployee
  },
  data() {
    return {
      list: [],
      page: {
        // 当前页
        page: 1,
        // 每页几条数据
        size: 10,
        // 总数据
        total: 0
      },
      loading: false,
      showDialog: false,
      showCodeDialog: false
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    showQrCode(url) {
      if (url) {
        this.showCodeDialog = true
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url)
        })
      } else {
        this.$message.warning('该用户未上传头像')
      }
    },
    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    changePage(page) {
      this.page.page = page
      this.getEmployeeList()
    },
    formatEmployment(row, column, cellValue, index) {
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    async delEmployee(id) {
      try {
        await this.$confirm('确认删除该员工吗？')
        await delEmployee(id)
        this.$message.success('员工删除成功')
        this.getEmployeeList()
      } catch (error) {
        return
      }
    },
    btnAdd() {
      this.showDialog = true
    },
    exportData() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async (excel) => {
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total
        })
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const data = this.formatJson(headers, rows)
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      // 首先遍历数组
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]]) // 返回格式化之前的时间
          } else if (headers[key] === 'formOfEmployment') {
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            )
            return en ? en.value : '未知'
          }
          return item[headers[key]]
        })
      })
    }
  }
}
</script>

<style></style>
