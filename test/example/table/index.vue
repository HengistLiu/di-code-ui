<template>
  <div class="main">
    <dc-table
      table-key="value"
      :data="list"
      :baseAmount="8"
      none-tips="没有更多的数据了">
      <dc-table-column label="名称" #default="{ row }">
        <span>{{row.label}}</span>
      </dc-table-column>
      <dc-table-column label="数值" prop="value"></dc-table-column>
    </dc-table>
    <dc-table table-key="value" :data="list" :baseAmount="5" theme="card">
      <dc-table-column label="名称" #default="{ row }">
        <span>{{row.label}}</span>
      </dc-table-column>
      <dc-table-column label="数值" prop="value"></dc-table-column>
    </dc-table>
    <dc-table table-key="value" :data="list" :baseAmount="5" theme="flat">
      <dc-table-column label="名称" #default="{ row }">
        <span>{{row.label}}</span>
      </dc-table-column>
      <dc-table-column label="数值" prop="value"></dc-table-column>
    </dc-table>
    <dc-table table-key="value" :data="list" :baseAmount="5" theme="mix">
      <dc-table-column label="名称" #default="{ row }">
        <span>{{row.label}}</span>
      </dc-table-column>
      <dc-table-column label="数值" prop="value"></dc-table-column>
    </dc-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      list: [
        { label: '这是测试一', value: 1 },
        { label: '测试二', value: 2 },
        { label: '三阿萨德话分开', value: 3 },
        { label: '四按时', value: 4 }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    padding: 20px;
    & > * {
      margin-bottom: 10px;
    }
  }
</style>
