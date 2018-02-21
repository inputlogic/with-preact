import {path, filter} from 'wasmuth'
import withState from '/util/withState'
import {getState, dispatch, set} from '/store'
import Base from './base'

/**
 * Mimic html input element but use redux
 * For performance, the default is to only update state
 * onChange (when element looses focus)
 * required:
 *   - formName
 *   - name
 *
 * some options:
 *   - trackOnInput: boolean, update state when a key is pressed
 *   - trackFocus: Store blur / focus of element in state under formState
 */
export const Input = withState(
  ({forms = {}}, {formName, name}) => ({stateValue: path([formName, name], forms)})
)(({
  name,
  formName,
  type = 'text',
  trackFocus = false,
  trackOnInput = false,
  value,
  stateValue,
  ...props
}) =>
  (!formName && console.warn('Formname not set for Input', name)) ||
  (type === 'checkbox' && !value && console.warn('Value not set for checkbox', name)) ||
  (type === 'radio' && !value && console.warn('Value not set for radio', name)) ||
  Base({
    onChange: ev => {
      ev.preventDefault()
      if (type === 'checkbox') {
        dispatch(set(
          ['forms', formName, name],
          addOrRemove(formName, name, value)
        ))
      } else if (type === 'radio' || !trackOnInput) {
        dispatch(set(['forms', formName, name], ev.target.value))
      }
    },
    onInput: ev => {
      if (trackOnInput) {
        dispatch(set(['forms', formName, name], ev.target.value))
      }
    },
    onFocus: ev => {
      trackFocus && dispatch(set(['formState', formName, 'focus', name], true))
    },
    onBlur: ev => {
      trackFocus && dispatch(set(['formState', formName, 'focus', name], false))
    },
    type,
    name,
    value: ['checkbox', 'radio'].indexOf(type) > -1 ? value : stateValue,
    checked: isChecked(type, value, stateValue),
    ...props
  })
)

export default Input

const addOrRemove = (formName, name, value) => {
  const currentValues = path(['forms', formName, name], getState()) || []
  return currentValues.indexOf(value) > -1
    ? filter(x => x !== value, currentValues)
    : [...currentValues, value]
}

const isChecked = (type, value, stateValue) => {
  if (type === 'checkbox') {
    return stateValue && stateValue.indexOf(value) !== -1
  }
  if (type === 'radio') {
    return stateValue === value
  }
}
