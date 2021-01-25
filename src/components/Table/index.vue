<template>
  <div>
    <!-- 复用表格组件 -->
    <table cellspacing="0"
           :class="{
             'table': true,
             ['table--' + theme]: true,
             'table--fixed': height
           }"
           :style="{
             width: shrink ? 'auto' : '100%',
             borderCollapse: borderCollapse,
             borderSpacing: borderSpacing
           }"
      >
      <colgroup>
        <col v-if="$slots['drawer']" width="40px">
        <col v-if="baseIndex >= 0" width="60px">
        <col v-for="col in columns"
            :key="col.id"
            :width="col.width">
      </colgroup>
      <!-- 首行 -->
      <thead>
        <tr>
          <colgroup v-if="height">
            <col v-if="$slots['drawer']" width="40px">
            <col v-if="baseIndex >= 0" width="60px">
            <col v-for="col in columns"
                :key="col.id"
                :width="col.width">
          </colgroup>
          <th v-if="$slots['drawer']"></th>
          <th v-if="baseIndex >= 0">序号</th>
          <!-- 行列标题 -->
          <th v-for="col in columns"
              :key="col.id"
              onselectstart="return false">
            <!-- 如果有插槽，使用插槽，插槽名必须与标题名相同 -->
            <template v-if="$slots[col.label]">
              <slot :name="col.label"></slot>
            </template>
            <!-- 否则使用默认头部，可附加功能 -->
            <template v-else>
              <!-- 如果添加了排序功能 -->
              <template v-if="col.sorter">
                <span class="sorter" @click.stop="taggleSorter(col)">
                  <!-- 图标 -->
                  <i v-if="col.icon"
                    :class="{
                      'table__th__icon': true,
                      'dc-iconfont': true,
                      [col.icon]: true
                    }"></i>
                  {{col.label}}
                  <!-- 排序标识图标 -->
                  <i :class="{
                       'sorter__icon': true,
                       'sorter__icon--active': sorters[sortersDirt[col.label]] &&
                                               sorters[sortersDirt[col.label]].type === 'up',
                       'sorter__icon__up': true,
                       'dc-iconfont dc-icon-paixu': true,
                       'sorter__icon__up--upper': sorters.length > 1 && sortersDirt[col.label] != null
                     }"></i>
                  <strong class="sorter__level"
                          v-if="sorters.length > 1 && sortersDirt[col.label] != null">
                    {{sortersDirt[col.label] + 1}}
                  </strong>
                  <i :class="{
                       'sorter__icon': true,
                       'sorter__icon--active': sorters[sortersDirt[col.label]] &&
                                               sorters[sortersDirt[col.label]].type === 'down',
                       'sorter__icon__down': true,
                       'dc-iconfont dc-icon-paixu': true,
                       'sorter__icon__down--downer': sorters.length > 1 && sortersDirt[col.label] != null
                     }"></i>
                </span>
              </template>
              <!-- 如果添加了过滤功能 -->
              <template v-else-if="col.filter && col.filter.length && col.filterChangeHandler">
                <dc-select :curVal="col.value"
                           :dataList="col.filter"
                           @changeHandler="(val) => changeFilter(col.filterChangeHandler, val)"/>
              </template>
              <!-- 如果添加了搜索功能 -->
              <template v-else-if="col.input || col.search">
                <div class="searcher">
                  <input v-if="col.isSearching"
                         type="text"
                         v-model="col.value"
                         :placeholder="`输入${col.label}进行搜索`"
                         @input="() => col.input ? col.input(col.value) : null"
                         @keydown.enter="() => col.search ? col.search(col.value) : null"
                         @blur="col.value ? null : col.isSearching = false">
                  <span v-else>
                    <i v-if="col.icon"
                      :class="{
                        'table__th__icon': true,
                        'dc-iconfont': true,
                        [col.icon]: true
                      }"></i>
                    {{col.label}}
                  </span>
                  <i class="searcher__icon dc-iconfont dc-icon-chazhao"
                     @click="col.isSearching
                              ? col.search
                                ? col.search(col.value)
                                : null
                              : col.isSearching = true">
                  </i>
                </div>
              </template>
              <!-- 啥功能都没附加 -->
              <template v-else>
                <span>
                  <i v-if="col.icon"
                    :class="{
                      'table__th__icon': true,
                      'dc-iconfont': true,
                      [col.icon]: true
                    }"></i>
                  {{col.label}}
                </span>
              </template>
            </template>
          </th>
        </tr>
      </thead>
      <!-- 主体 -->
      <tbody class="scrollStyle--public"
             :style="{
                height: height ? height : 'auto'
              }">
        <!-- 主体表格单行 -->
        <dc-table-tr v-for="(item, index) in realList"
                     :key="item[tableKey]"
                     :class="{
                       'table__tr': true,
                       'table__drawer__container': /^drawer-/.test(item[tableKey]),
                       'table__drawer__container--active': openDrawers.indexOf('drawer-' + item[tableKey]) !== -1,
                       'table__tr--odd': item['table-index'] % 2 === 1,
                       'table__tr--even': item['table-index'] % 2 === 0
                     }"
                     :row="getRowData(index)"
                     :index="item['table-index']"
                     :tableKey="tableKey"
                     :taggleDrawer="$slots['drawer'] ? taggleDrawer : () => {}"
                     :style="{
                       cursor: isRowPointer ? 'pointer' : 'default'
                     }"
                     @click.native="isRowPointer && rowClickHandler('Click', item, item['table-index'])"
                     @dblclick.native="isRowPointer && rowClickHandler('Dblclick', item, item['table-index'])"
        >
          <!-- 抽屉 -->
          <template v-if="/^drawer-/.test(item[tableKey])">
            <td :colspan="rowColumnAccount">
              <slot name="drawer"></slot>
            </td>
          </template>
          <!-- 非抽屉 -->
          <template v-else>
            <colgroup v-if="height">
              <col v-if="$slots['drawer']" width="40px">
              <col v-if="baseIndex >= 0" width="60px">
              <col v-for="col in columns"
                  :key="col.id"
                  :width="col.width">
            </colgroup>
            <!-- 如果存在抽屉 -->
            <dc-table-column v-if="$slots['drawer']">
              <span @click.stop="taggleDrawer(item[tableKey], item, index)">
                <i :class="{
                  'table__drawer__icon': true,
                  'table__drawer__icon--active': openDrawers.indexOf('drawer-' + item[tableKey]) !== -1,
                  [drawerIcon]: true
                }"></i>
              </span>
            </dc-table-column>
            <!-- 如果需要添加序号， 每行默认添加序号单元格 -->
            <dc-table-column v-if="baseIndex >= 0">
              {{baseIndex + item['table-index']}}
            </dc-table-column>
            <!-- 插槽放入其余列单元格 -->
            <slot></slot>
          </template>
        </dc-table-tr>
        <!-- 如果行数少于配置最低数量，添加空行 -->
        <template v-if="needBlockRowCount">
          <dc-table-tr v-for="(item, index) in needBlockRowCount"
                       :index="realList.length + index + 1"
                       :key="(new Date()).getTime() +'_' + index"
                       :class="{
                         'table__tr': true,
                         'table__tr--block': true,
                         'table__tr--odd': (index + realList.length - openDrawers.length) % 2 === 0,
                         'table__tr--even': (index + realList.length - openDrawers.length) % 2 === 1
                       }"
          >
            <!-- 合并单行所有单元格 -->
            <dc-table-column :colspan="rowColumnAccount">
              <!-- 如果列表为空，显示提示 -->
              <template v-if="realList.length === 0 && index === 0">
                <span class="table__none__tips" style="user-select: none;">- {{noneTips}} -</span>
              </template>
              <!-- 否则空格占位 -->
              <template v-else><span style="user-select: none;" v-html="'&nbsp;'"></span></template>
            </dc-table-column>
          </dc-table-tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
import DcTableTr from '../TableTr/index.vue'
import DcTableColumn from '../TableColumn/index.vue'

export default {
  name: 'dc-table',
  components: {
    // 用于数据传输
    DcTableTr,
    DcTableColumn
  },
  props: {
    // 表格遍历时标记的key值，很重要
    tableKey: {
      type: String,
      required: true
    },
    shrink: {
      type: Boolean
    },
    // 表格主题，不同主题不同样式 卡片型-card 平面型-flat mix-混合型（头部卡片，主体平面）
    theme: {
      type: String,
      default: 'default',
      validator: (val) => ['card', 'flat', 'mix', 'default'].includes(val)
    },
    drawerIcon: {
      type: String,
      default: 'dc-iconfont dc-icon-arrow-right'
    },
    // 列表数据
    data: {
      type: Array,
      default: () => []
    },
    // 要求基础行数
    baseAmount: {
      type: Number,
      default: 10
    },
    // 是否添加序号
    baseIndex: {
      type: Number,
      default: -1
    },
    // 固定表头后表主体的展示高度
    height: {
      type: String,
      default: ''
    },
    noneTips: {
      type: String,
      default: '无更多数据'
    }
  },
  computed: {
    rowColumnAccount () {
      let sum = this.columns.length
      if (this.baseIndex >= 0) sum++
      if (this.$slots['drawer']) sum++
      return sum
    },
    needBlockRowCount () {
      let newLength = this.realList.length - this.openDrawers.length
      return newLength < this.baseAmount
        ? this.baseAmount - newLength
        : 0
    },
    borderCollapse () {
      // separate:默认值。边框会被分开。不会忽略 border-spacing 和 empty-cells 属性。
      // collapse:如果可能，边框会合并为一个单一的边框。会忽略 border-spacing 和 empty-cells 属性。
      // inherit:规定应该从父元素继承 border-collapse 属性的值。
      return {
        'default': 'unset',
        'card': 'unset',
        'flat': 'unset',
        'mix': 'unset'
      }[this.theme]
    },
    borderSpacing () {
      return {
        'default': 'unset',
        'card': 'unset',
        'flat': this.height ? '0 5px' : '0 13px',
        'mix': '0 10px'
      }[this.theme]
    },
    realList () {
      let newIdx = 0
      const list = this.cloneData
        .filter((i, index) => {
          return index % 2 !== 1 || this.openDrawers.indexOf(i[this.tableKey]) !== -1
        })
        .map((i, index) => {
          if (!/^drawer-/.test(i[this.tableKey])) newIdx++
          i['table-index'] = newIdx
          return i
        })
      return this.$slots['drawer']
        ? list
        : this.cloneData.map((i, index) => {
          i['table-index'] = index
          return i
        })
    },
    isRowPointer () {
      return this._events['rowClickHandler'] != null || this._events['rowDblClickHandler'] != null
    },
    sortersDirt () {
      const obj = {}
      this.sorters.forEach((sorter, index) => {
        obj[sorter.label] = index
      })
      return obj
    }
  },
  data () {
    return {
      isOnlyDrawer: false,
      openDrawers: [],
      cloneData: [],
      columnChangeFlag: -1,
      columns: [],
      sorters: [] // 排序器队列
    }
  },
  methods: {
    getRowData (index) {
      return /^drawer-/.test(this.realList[index][this.tableKey])
        ? this.realList[index - 1]
        : this.realList[index]
    },
    changeFilter (cb, val) {
      cb(val)
      // 重新获取列的状态
      this.columnChangeFlag++
    },
    sortData () {
      const sort = (list, start = 0, end = list.length - 1, level = 0) => {
        if (start >= end || level >= this.sorters.length) return
        const { type, sorter } = this.sorters[level]
        let startItem = null
        for (let i = start; i < end; i++) {
          for (let j = i + 1; j <= end; j++) {
            switch (type) {
              case 'up':
                if (sorter(list[j]) > sorter(list[i])) {
                  let temp = list[i]
                  list[i] = list[j]
                  list[j] = temp
                }
                break
              case 'down':
                if (sorter(list[j]) < sorter(list[i])) {
                  let temp = list[i]
                  list[i] = list[j]
                  list[j] = temp
                }
                break
              default:
                break
            }
            if (j === end) {
              if (startItem == null) {
                startItem = {
                  value: sorter(list[i]),
                  index: i
                }
              } else {
                if (sorter(list[i]) !== startItem.value) {
                  // 下一种排序类型进行排序
                  sort(list, startItem.index, i - 1, level + 1)
                  startItem = {
                    value: sorter(list[i]),
                    index: i
                  }
                }
              }
            }
          }
        }
        // 特殊情况处理
        if (sorter(list[end]) !== startItem.value) {
          sort(list, startItem.index, end - 1, level + 1)
        }
      }
      const list = JSON.parse(JSON.stringify(this.data))
      sort(list)
      this.initData(list)
    },
    taggleSorter (colConfig) {
      const { label, prop, sorter } = colConfig
      if (sorter == null) return
      if (typeof sorter !== 'function' && prop == null) return
      // 设置新的排序器
      let newSorter = null
      // 给排序器排序，当前更换项变成第一项
      const idx = this.sorters.findIndex(i => i.label === label)
      // 如果存在移除转移到最后
      if (idx !== -1) {
        newSorter = this.sorters.splice(idx, 1)[0]
      } else {
        newSorter = {
          label: label,
          type: 'unset',
          sorter: typeof (sorter) === 'function'
            ? sorter
            : (row) => row[prop]
        }
      }
      // 更改排序类型
      switch (newSorter.type) {
        case 'up':
          newSorter.type = 'down'
          break
        case 'down':
          this.sortData()
          return
        default:
          newSorter.type = 'up'
          break
      }
      // 插入排序器队列
      this.sorters.push(newSorter)
      // 开始排序
      this.sortData()
    },
    taggleDrawer (key, item, index) {
      if (/^drawer-/.test(key)) return
      let target = 'drawer-' + key
      let targetIndex = this.openDrawers.indexOf(target)
      if (targetIndex !== -1) {
        this.openDrawers.splice(targetIndex, 1)
      } else {
        // 是否唯一抽屉
        if (this.isOnlyDrawer) {
          this.openDrawers = [target]
        } else {
          this.openDrawers.push(target)
        }
      }
      if (item != null) this.$emit('taggleChange', item, index)
    },
    taggleAllDrawer () {
      this.openDrawers = this.openDrawers.length === this.cloneData.length / 2
        ? []
        : this.cloneData
          .filter((i, index) => {
            return index % 2 === 1
          })
          .map(i => i[this.tableKey])
    },
    rowClickHandler (type, item, index) {
      const methods = {}
      if (this.$slots['drawer']) {
        methods.taggleDrawer = () => this.taggleDrawer(item[this.tableKey], item, index)
        methods.taggleAllDrawer = () => this.taggleAllDrawer()
      }
      this.$emit(`row${type}Handler`, item, index, methods)
    },
    handlerEmits () {
      // 监听列表每一列添加情况
      this.$on('addColumn', () => {
        this.columnChangeFlag++
      })
      this.$on('deleteColumn', () => {
        this.columnChangeFlag++
      })
      this.$on('updateColumn', () => {
        this.columnChangeFlag++
      })
    },
    initData (data) {
      let length = data.length
      let targetIndex = -1
      let preItem = null
      if (this.$slots['drawer']) {
        for (let i = 0; i < length; i++) {
          targetIndex = 2 * (i + 1) - 1
          preItem = data[targetIndex - 1]
          data.splice(targetIndex, 0, {
            [this.tableKey]: 'drawer-' + preItem[this.tableKey]
          })
        }
      }
      this.cloneData = []
      // 确保刷新
      this.$nextTick(() => {
        this.cloneData = data
      })
    },
    getDrawerConfig () {
      if (this.$slots['drawer'] == null) return
      let drawer = this.$slots['drawer'][0]
      if (!drawer['componentOptions']) return false
      let itemData = drawer['componentOptions']['propsData'] || {}
      // 监听抽屉是否只展示一个
      if (itemData.only != null) {
        this.isOnlyDrawer = true
      }
      if (itemData.list) {
        this.openDrawers = itemData.list.length
          ? ['drawer-' + itemData.list[0]]
          : itemData.list.map(i => 'drawer-' + i)
      }
    },
    getColumnConfig () {
      let result = this.$slots['default']
        .filter(i => {
          if (!i['componentOptions']) return false
          let item = i['componentOptions']['propsData']
          return item && /dc-table-column$/.test(i.tag) && item.label
        })
        .map(i => {
          let itemData = i['componentOptions']['propsData'] || {}
          let itemMethods = i['componentOptions']['listeners'] || {}
          return {
            prop: itemData.prop,
            label: itemData.label,
            icon: itemData.icon,
            width: itemData.width == null || itemData.width === -1 ? 'auto' : itemData.width + 'px',
            value: itemData.value != null ? itemData.value : '',
            // 过滤相关
            filter: itemData.filter,
            filterChangeHandler: itemMethods.filterChangeHandler,
            // 搜索相关
            isSearching: false,
            search: itemMethods.search,
            input: itemMethods.input,
            // 排序相关
            sorter: itemData.sorter == null
              ? false
              : typeof (itemData.sorter) === 'function'
                ? itemData.sorter
                : itemData.prop != null
          }
        })
      this.columns = result
    },
    refreshData (list = this.data) {
      let data = JSON.parse(JSON.stringify(list))
      this.initData(data)
    }
  },
  created () {
    this.handlerEmits()
  },
  watch: {
    columnChangeFlag: {
      handler () {
        this.getColumnConfig()
        this.getDrawerConfig()
      },
      deep: true,
      immediate: true
    },
    data: {
      handler (newVal) {
        this.refreshData(newVal)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">

  .table {
    line-height: 3;
    font-size: 14px;
    color: $TEXT-REGULAR;
    position: relative;
    tr {
      cursor: default;
    }
    thead {
      tr {
        position: relative;
        top: 0px;
      }
      th {
        font-size: 18px;
        color: $TEXT-SECONDARY;
        white-space: nowrap;
        user-select: none;
        text-align: center;
      }
    }
    // 固定表头
    &--fixed {
      thead {
        tr {
          display:table;
          width:100%;
          table-layout:fixed;
        }
      }
      tbody {
        display: block;
        overflow-y: auto;
        overflow-x: hidden;
        tr {
          display:table;
          width:100%;
          table-layout:fixed;
        }
      }
    }
    // 默认边框样式
    &--default {
      border: 1px solid $BORDER-LIGHT;
      border-radius: 3px;
      thead {
        background-color: $BG-LIGHTER;
        th {
          font-size: 15px;
          font-weight: 300;
          color: $TEXT-REGULAR;
          line-height: 3;
          border-bottom: 1px solid $BORDER-LIGHT;
        }
      }
      tbody {
        .table__tr {
          &--even {
            background-color: $BG-LIGHTER;
            border-top: 1px solid $BORDER-LIGHT;
            border-bottom: 1px solid $BORDER-LIGHT;
          }
          &:hover {
            background-color: $BG-LIGHT;
            & + .table__drawer__container {
              background-color: $BG-LIGHT;
            }
          }
        }
        .table__drawer__container {
          border-top: 1px solid transparent;
          &--active {
            border-bottom: 1px solid transparent;
          }
        }
      }
    }
    // 卡片式样式
    &--card {
      background-color: $BG-WHITE;
      border-radius: 8px;
      box-shadow: $SHADOW;
      border: 1px solid $BORDER-LIGHT;
      thead {
        th {
          font-weight: 300;
          color: $TEXT-SECONDARY;
          line-height: 2.5;
          border-bottom: 1px solid $BORDER-LIGHT;
        }
      }
      tbody {
        .table__tr {
          &--even {
            background-color: $BG-LIGHTER;
            border-top: 1px solid $BORDER-LIGHT;
            border-bottom: 1px solid $BORDER-LIGHT;
          }
          &:hover {
            background-color: $BG-LIGHT;
            & + .table__drawer__container {
              background-color: $BG-LIGHT;
            }
          }
        }
      }
    }
    // 平面型样式
    &--flat {
      margin-top: -5px;
      thead {
        th {
          border-bottom: 1px solid $BORDER-LIGHT;
        }
      }
      tbody {
        .table__tr {
          background-color: $BG-LIGHTER;
          border-bottom: 1px solid $BORDER-LIGHT;
          &:hover{
            font-weight: 600;
            position: relative;
            background-color: $BG-LIGHT;
            border: none;
          }
        }
      }
    }
    // 混合型样式
    &--mix {
      thead {
        tr {
          line-height: 55px;
          border-bottom: 1px solid $BORDER-LIGHT;
          background-color: $BG-WHITE;
        }
        &:before {
          content: '';
          position: absolute;
          width: 100%;
          height: 68px;
          top: 13px;
          z-index: -1;

          border: none;
          border-radius: 8px;
          box-shadow: $SHADOW;
          background-color: $BG-WHITE;
        }
      }
      tbody {
        .table__tr {
          position: relative;
          &:after {
            content: '';
            display: inline-block;
            position: absolute;
            width: 100%;
            line-height: inherit;
            font-size: inherit;
            height: 4em;
            margin-top: -0.5em;
            left: 0;
            z-index: -2;
            opacity: 0;
            transition: opacity .3s;

            background-color: $BG-WHITE;
            // border: 1px solid rgba(59, 198, 136, .3);
            border-radius: 8px;
            box-shadow: $SHADOW;
          }
          &--block {
            &:after {
              opacity: 0 !important;
            }
          }
          &:hover {
            font-weight: 600;
            position: relative;
            /*background-color: $BG-LIGHT;*/
            border: none;
            &:after {
              opacity: 1;
            }
          }
        }
        .table__drawer__container {
          &::after {
            content: unset;
          }
        }
      }
    }
    // 空行设置
    &__block {
      &:hover {
        &:after {
          content: none;
        }
      }
    }
    // 抽屉设置
    &__drawer {
      &__icon {
        width: 30px;
        height: 30px;
        line-height: 30px;
        display: inline-block;
        color: $TEXT-PLACEHOLDER;
        font-size: 10px;
        transition: all .3s;
        cursor: pointer;
        &--active {
          color: $TEXT-SECONDARY;
          transform: rotateZ(90deg);
        }
      }
    }
  }
  // 排序器
  .sorter {
    line-height: inherit;
    position: relative;
    cursor: pointer;
    user-select: none;
    // background-color: red;
    padding-right: 23px;
    display: inline-block;
    &__level {
      display: inline-block;
      width: 20px;
      color: $TEXT-SECONDARY;
      font-size: 10px !important;
      text-align: center;
      position: absolute;
      top: 50%;
      right: 0;
      transform: translate(0, -50%);
    }
    &__icon {
      width: 20px;
      position: absolute;
      top: 50%;
      right: 0;
      color: $TEXT-PLACEHOLDER;
      transition: all .2s;
      &--active {
        color: $PRIMARY;
      }
      &__up {
        transform: translate(0, -52%);
        &--upper {
          transform: translate(0, -62%);
        }
      }
      &__down {
        transform: translate(0, -48%) rotateZ(180deg);
        &--downer {
          transform: translate(0, -38%) rotateZ(180deg);
        }
      }
    }
  }
  // 搜索器
  .searcher {
    display: inline-block;
    position: relative;
    padding: 0 25px;
    input {
      max-width: 150px;
      text-align: center;
      font-size: 14px;
      line-height: inherit;
      color: inherit;
      background-color: transparent;
      border: none;
      outline: none;
      padding-left: 10px;
    }
    &__icon {
      color:  $TEXT-PLACEHOLDER;
      font-size: 14px;
      position: absolute;
      right: 5px;
      top: 50%;
      transform: translateY(-53%);
      cursor: pointer;
      transition: color .3s;
      &:hover {
        color: $PRIMARY;
      }
    }
  }
</style>
