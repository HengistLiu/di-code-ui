const SUCCESS = '#3bc688'
const SUCCESS_LIGHT = '#5acf9b'
const SUCCESS_DARK = '#31ac75'
const SUCCESS_LUCENCY = 'rgba(52, 182, 123, .1)'

const WARNING = '#fd9233'
const WARNING_LIGHT = '#fda351'
const WARNING_DARK = '#fd800f'
const WARNING_LUCENCY = 'rgba(253, 134, 26, .1)'

const DANGER = '#f25555'
const DANGER_LIGHT = '#f47575'
const DANGER_DARK = '#ef2e2e'
const DANGER_LUCENCY = 'rgba(240, 57, 57, .1)'

const BEHAVE = '#6699ff'
const BEHAVE_LIGHT = '#84acff'
const BEHAVE_DARK = '#3979ff'
const BEHAVE_LUCENCY = 'rgba(74, 133, 255, .1))'

const INFO = '#838383'
const INFO_LIGHT = '#919191'
const INFO_DARK = '#6d6d6d'
const INFO_LUCENCY = 'rgba(117, 117, 117, .1))'

export default {
  primaryColor: '#3bc688',

  successColor: '#3bc688',
  warningColor: '#fd9233',
  dangerColor: '#f25555',
  behaveColor: '#6699ff',
  infoColor: '#838383',
  banColor: '#e8e9ea',

  types: ['success', 'behave', 'warning', 'danger', 'info'],
  colors: [SUCCESS, BEHAVE, WARNING, DANGER, INFO],
  lightColors: [SUCCESS_LIGHT, BEHAVE_LIGHT, WARNING_LIGHT, DANGER_LIGHT, INFO_LIGHT],
  darkColors: [SUCCESS_DARK, BEHAVE_DARK, WARNING_DARK, DANGER_DARK, INFO_DARK],
  lucencyColors: [SUCCESS_LUCENCY, BEHAVE_LUCENCY, WARNING_LUCENCY, DANGER_LUCENCY, INFO_LUCENCY],

  textColor: '#606164',
  textPlaceholder: '#c0c4cc',

  borderColor: '#dcdfe6',
  bgColor: '#eaeaea',
  darkBgColor: '#505050',

  shadowColor: `
    0 0 4px 0 rgba(28,31,33,.06),
    0 0 8px 0 rgba(28,31,33,.05),
    0 0 16px 0 rgba(28,31,33,.04),
    0 0 24px 0 rgba(28,31,33,.03),
    0 0 32px 0 rgba(28,31,33,0.02)
  `,
  shadowLightColor: `
    0 0 4px 0 rgba(28,31,33,.05),
    0 0 8px 0 rgba(28,31,33,.04),
    0 0 16px 0 rgba(28,31,33,.03),
    0 0 24px 0 rgba(28,31,33,.02),
    0 0 32px 0 rgba(28,31,33,0.01)
  `,
  shadowDarkColor: `
    0 0 4px 0 rgba(28,31,33,.1),
    0 0 8px 0 rgba(28,31,33,.09),
    0 0 16px 0 rgba(28,31,33,.08),
    0 0 24px 0 rgba(28,31,33,.07),
    0 0 32px 0 rgba(28,31,33,0.06)
  `
}
