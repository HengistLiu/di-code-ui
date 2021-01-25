<template>
  <transition :name="openAnimation ? 'fade' : ''">
  <div class="input"
       :style="{
         lineHeight: lineHeight
       }">
    <label :for="id"
           v-if="label"
           :style="{
             width: labelWidth}"
    >{{label}}</label>
    <!-- 如果是输入文本域 -->
    <template v-if="isTextarea">
      <div class="input__textarea__container">
        <textarea ref="input"
                  v-model="inputValue"
                  :id="id"
                  :type="type"
                  :class="{
                    'input__textarea': true,
                    'input__textarea--wrong': isValidate && !readOnly && validateMsg
                  }"
                  :style="getInputStyle({
                    height: row ? (row * 3) + 'em' : 'auto',
                    resize: row ? 'none' : 'vertical',
                    cursor: readOnly ? 'default' : 'text',
                    color: readOnly ? 'rgb(89, 91, 93)' : 'inherit'
                  })"
                  @input="handleInput">
        </textarea>
        <span class="input__textarea__tips"
              v-if="!inputValue"
              onselectstart="return false"
              @click="$refs.input.focus()"
              v-html="placeholder"
              ></span>
      </div>
    </template>
    <!-- 如果是选择框 -->
    <template v-else-if="chooser">
      <div class="input__chooser input__chooser__container"
           :style="getInputStyle()">
        <template v-if="readOnly">
          <ul class="input__chooser__single">
            <li v-for="item in chooserList.filter(i => i.value === value)"
                :key="item.value"
                class="input__chooser--disabled">
              {{item.label}}
            </li>
          </ul>
        </template>
        <template v-else>
          <ul class="input__chooser__single" v-if="singleChooser.length">
            <li v-for="item in singleChooser"
                :key="item.value"
                :class="{
                  'input__chooser--actived': !readOnly && value === item.value
                }"
                :style="{
                  cursor: readOnly ? 'default' : 'pointer',
                  color: readOnly ? 'rgb(89, 91, 93)' : 'inherit'
                }"
                @click="changeHandler(item.value)">
              {{item.label}}
            </li>
          </ul>
          <dc-select v-if="choosers.length"
                    :curVal="value"
                    :dataList="choosers"
                    :active-style="singleChooser.findIndex(i => i.value === value) !== -1
                      ? {}
                      : {
                        fontWeight: 600,
                        color: '#3bc688'
                      }"
                    @changeHandler="changeHandler"/>
        </template>
      </div>
    </template>
    <!-- 否则都是输入框 -->
    <template v-else>
      <input ref="input"
             :id="id"
             v-model="inputValue"
             :type="getInputType"
             :class="{
               'input__input': true,
               'input__input--wrong': isValidate && !readOnly && validateMsg
             }"
             :style="getInputStyle({
               cursor: readOnly ? 'default' : 'text',
               color: readOnly ? 'rgb(89, 91, 93)' : 'inherit'
             })"
             :placeholder="placeholder"
             autocomplete="new-password"
             @input="handleInput"
             @blur="handleBlur"
             @focus="handleFocus"
             @keydown.enter="handleEnter"
             @keydown.up="handleKeyUp"
             @keydown.down="handleKeyDown"/>
    </template>
    <div class="input__validate__message" v-if="isValidate">
      {{validateMsg}}
    </div>
  </div>
  </transition>
</template>

<script>
export default {
  name: 'dc-input',
  props: {
    readOnly: Boolean,
    label: {
      type: String,
      default: ''
    },
    value: {},
    labelWidth: {
      type: String,
      default: 'auto'
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    chooser: Boolean,
    // 文字域设置
    textarea: Boolean,
    row: {
      type: Number
    },
    // 数字类型设置
    range: { // type为number存在，为数值范围
      type: Array
    },
    // 输入框前后缀
    pre: {
      type: String
    },
    next: {
      type: String
    },
    // 选择列表
    chooserList: {
      type: Array,
      default: () => []
    },
    // 验证
    validate: {
      type: Function
    },
    // 动画
    openAnimation: {
      type: Boolean,
      default: false
    },
    lineHeight: {
      type: String,
      default: '3'
    },
    inputStyle: {
      type: Object
    }
  },
  computed: {
    // 手动设置number类型为type类型
    getInputType () {
      return this.type === 'number' ? 'text' : this.type
    },
    // 判断是否是文字域
    isTextarea () {
      return this.textarea !== false
    },
    // 验证信息
    validateMsg () {
      return this.validate
        ? this.validate(this.inputValue)
        : ''
    },
    singleChooser () {
      const list = this.chooserList.filter(i => !i.isSingle)
      if (list.length <= 1) return this.chooserList
      return this.chooserList.filter(i => i.isSingle)
    },
    choosers () {
      const list = this.chooserList.filter(i => !i.isSingle)
      if (list.length <= 1) return []
      const idx = list.findIndex(i => i.value === this.value)
      return [
        ...(idx === -1 ? [{ label: '其他', value: this.value }] : []),
        ...list.splice(idx, 1),
        ...list
      ]
    }
  },
  data () {
    return {
      // 随机不重复id
      id: (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5),
      oldPre: this.pre || '',
      oldNext: this.next || '',
      inputValue: this.value,
      self: null,
      isValidate: false
    }
  },
  methods: {
    getInputStyle (defaultStyle = {}) {
      const customStyle = this.inputStyle || {}
      return Object.assign(
        // 先组合UI组件库默认样式
        Object.assign(defaultStyle, {
          borderRadius: '8px',
          outline: 'none',
          border: 'none',
          fontSize: '14px',
          backgroundColor: '#f3f3f3',
          width: '100%'
        }),
        // 再组合用户自定义样式
        customStyle
      )
    },
    changeHandler (val) {
      if (this.readOnly) return
      this.$emit('changeHandler', val)
    },
    // 判断是否为空
    isSimple (str) {
      return !str || str.length === 0 || str === ''
    },
    emitInputHandler (e) {
      let oldValue = this.inputValue
      // 限制输入
      this.inputValue = this.limitInput(this.type, e, e.data, e.target.value, oldValue)
      // 通知父元素修改props，输出结果经过处理
      this.$emit('input', this.limitOutput(this.inputValue))
    },
    // 实现input的双向绑定，v-model
    handleInput (e) {
      // 开启验证
      this.isValidate = true
      if (this.timer) clearTimeout(this.timer)
      this.timer = setTimeout(() => this.emitInputHandler(e), 100)
    },
    // 处理数值增减
    handleKeyUp (e) {
      let oldValue = this.inputValue
      if (this.type !== 'number' || oldValue === '') return
      this.inputValue = this.limitInput(this.type, e, 'UP', e.target.value, oldValue)
      // 通知父元素修改props
      this.$emit('input', this.limitOutput(this.inputValue))
    },
    handleKeyDown (e) {
      let oldValue = this.inputValue
      if (this.type !== 'number' || oldValue === '') return
      this.inputValue = this.limitInput(this.type, e, 'DOWN', e.target.value, oldValue)
      // 通知父元素修改props
      this.$emit('input', this.limitOutput(this.inputValue))
    },
    // 数据添加前后缀
    addDecorate (str, pre, next) {
      if (!str.length) {
        return ''
      }
      if (!this.isSimple(pre)) {
        str = str.indexOf(pre) !== 0 ? pre + str : str
      }
      if (!this.isSimple(next)) {
        let nextLength = next.length
        str = str.indexOf(next) < 0 || (str.indexOf(next) >= 0 && str.indexOf(next) + nextLength === str.length) ? str + next : ''
      }
      return str
    },
    clearDecorate (str, pre, next) {
      if (!this.isSimple(pre)) {
        let preLength = pre.length
        str = str.indexOf(pre) === 0 ? str.slice(preLength) : str
      }
      if (!this.isSimple(next)) {
        let nextLength = next.length
        str = str.length >= nextLength && str.indexOf(next) === str.length - nextLength ? str.slice(0, -nextLength) : str
      }
      return str
    },
    handleEnter (e) {
      let value = this.limitOutput(e.target.value)
      this.$emit('enter', value)
      this.handleBlur(e)
    },
    handleBlur (e) {
      this.inputValue = this.addDecorate(this.limitOutput(e.target.value), this.pre, this.next)
    },
    handleFocus (e) {
      this.inputValue = this.clearDecorate(e.target.value, this.pre, this.next)
    },
    limitOutput (valueStr) {
      if (this.type !== 'number') return valueStr
      let val = (+valueStr)
      if (!this.range) return val.toString()
      if (this.range.length > 0) {
        // 限制范围
        if (val < this.range[0]) return this.range[0].toString()
      }
      if (this.range.length > 1) {
        if (val > this.range[1]) return this.range[1].toString()
      }
      return val.toString()
    },
    limitInput (type, e, input, newValue, oldValue) {
      const _this = this
      let limitInputFuns = {
        'number': function () {
          if (input == null) return newValue.replace(/^\.+/, '')
          // 上键++
          if (input === 'UP') return parseFloat(oldValue) + 1
          // 下键--
          if (input === 'DOWN') return parseFloat(oldValue) - 1
          // 限制输入内容为数字和小数点
          let reg = new RegExp(`[0-9${_this.floatLen > 0 ? '.' : ''}]`)
          if (!reg.test(input)) return oldValue
          // 限制小数点位置
          if (input === '.') {
            if (oldValue === '' || oldValue.indexOf('.') > 0) return oldValue
          } else {
            if (oldValue.indexOf('.') > 0 && oldValue.indexOf('.') === oldValue.length - _this.floatLen - 1) return oldValue
          }
          return newValue
        }
      }
      if (limitInputFuns[type]) {
        e.target.value = limitInputFuns[type]()
      }
      return e.target.value
    },
    // 设置只读属性
    configReadonly () {
      if (!this.self) return
      if (this.readOnly) {
        this.self.setAttribute('readonly', 'readonly')
      } else {
        this.self.removeAttribute('readonly')
      }
    }
  },
  mounted () {
    this.self = this.$refs.input
    // 设置只读
    this.configReadonly()
  },
  created () {
    this.oldPre = this.pre || ''
    this.oldNext = this.next || ''
    let temp = this.inputValue == null
      ? ''
      : this.inputValue
    this.inputValue = this.addDecorate(temp.toString(), this.pre, this.next)
  },
  watch: {
    readOnly () {
      this.configReadonly()
    },
    pre () {
      this.inputValue = this.clearDecorate(this.inputValue.toString(), this.oldPre, this.next)
      this.inputValue = this.addDecorate(this.inputValue.toString(), this.pre, this.next)
      this.oldPre = this.pre
    },
    next () {
      this.inputValue = this.clearDecorate(this.inputValue.toString(), this.pre, this.oldNext)
      this.inputValue = this.addDecorate(this.inputValue.toString(), this.pre, this.next)
      this.oldNext = this.next
    }
  }
}
</script>

<style lang="scss" scoped>
  .fade {
    @include setTransition('fade', .5s);
  }
  .input {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    label {
      font-size: 14px;
      color: $TEXT-PRIMARY;
      flex: 0 0 auto;
      white-space: nowrap;
      margin-left: 15px;
    }
    &__input,
    &__textarea,
    &__chooser {
      line-height: inherit;
    }
    &__input {
      margin: 0 15px;
      padding: 0 10px;
      text-align: center;
      &:-moz-placeholder，
      &::-moz-placeholder，
      &:-ms-input-placeholder，
      &::-webkit-input-placeholder {
        color: $TEXT-PLACEHOLDER;
      }
    }
    &__textarea {
      box-sizing: border-box;
      min-height: 7.5em;
      max-height: 12.5em;
      padding: 0 20px;
      resize: vertical;
      &__container {
        flex: 1 0 auto;
        margin: 0 15px;
        position: relative;
      }
    }
    &__textarea__tips {
      position: absolute;
      display: inline-block;
      white-space: nowrap;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 14px;
      text-align: center;
      color: $TEXT-PLACEHOLDER;
    }
    &__chooser {
      margin: 0 15px;
      padding: 0 10px;
      &__container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        ul {
          list-style: none;
        }
      }
      &__single {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
        flex: 1 0 auto;
      }
      &__group {
        list-style: none;
      }
      &--actived {
        font-weight: 600;
        color: $PRIMARY !important;
      }
      &--disabled {
        cursor: default;
        color: rgb(89, 91, 93);
      }
    }

    &__input,
    &__textarea {
      transition: all .3s;
      border: 1px solid transparent;
      &--wrong {
        border: 1px solid $DANGER;
      }
    }
    &__validate__message {
      white-space: nowrap;
      font-size: 10px;
      line-height: 16px;
      border-radius: 8px;
      padding: 0 5px;
      position: absolute;
      top: -20px;
      right: 15px;
      cursor: default;
      color: $TEXT-WHITE;
      background-color: $DANGER;
      opacity: .6;
    }
  }
</style>
