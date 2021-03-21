<template>
  <el-card>
    <el-row>
      <el-col :span="16">
        <h2>国家/地区</h2>
      </el-col>
      <el-col :span="8">
        <el-button type="primary">添加国家/地区</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%">
      <el-table-column
        prop="country"
        label="国家/地区"
        width="180">
      </el-table-column>
      <el-table-column
        prop="lang"
        label="语种"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createdate"
        label="标签添加时间">
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [{
        country: '中国',
        lang: '中文',
        createdate: '2021-03-24'
      },{
        country: '中国',
        lang: '中文',
        createdate: '2021-03-24'
      },{
        country: '中国',
        lang: '中文',
        createdate: '2021-03-24'
      },]
    }
  },
}
</script>