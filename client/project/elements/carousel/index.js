import {guid} from 'wasmuth'

import {compose, setNodeName} from '/util/compose'
import {dispatch, set, watchPath} from '/store'

import render from './base'

function init () {
  this._uid = this.props.uid || guid()
  this.state = {active: this.props.active || 0, width: 0}
  dispatch(set(['Carousel', this._uid], this.props.active || 0))
  watchPath(['Carousel', this._uid], (active) =>
    active !== this.state.active && this.setState({active})
  )
}

function next (ev) {
  ev.preventDefault()
  const active = this.state.active + this.state.numFit
  const n = active >= this.props.children.length - 1
    ? 0
    : this.state.active + 1
  dispatch(set(['Carousel', this._uid], n))
}

function prev (ev) {
  ev.preventDefault()
  const n = this.state.active <= 0
    ? this.props.children.length - (this.state.numFit + 1)
    : this.state.active - 1
  dispatch(set(['Carousel', this._uid], n))
}

function setActive (idx) {
  return ev => {
    ev.preventDefault()
    dispatch(set(['Carousel', this._uid], idx))
  }
}

function getRef (ref) {
  if (!ref || this.ref) return
  this.ref = ref
  window.requestAnimationFrame(() => {
    const width = this.ref.offsetWidth
    const parent = this.ref.parentNode
    const parentWidth = parent.offsetWidth
    const numFit = parent != null
      ? Math.max(0, Math.floor(parent.offsetWidth / width) - 1)
      : 0
    this.setState({...this.state, width, parentWidth, numFit})
  })
}

function getStyle (idx, active) {
  const {parentWidth, width} = this.state
  const style = parentWidth != null
    ? `width: ${parentWidth}px;`
    : ''
  if (active === 0 || idx >= active) {
    return style
  }
  return `${style} margin-left: -${width}px;`
}

function getSlidesStyle () {
  return `width: ${this.state.parentWidth * this.props.children.length}px;`
}

export default compose(setNodeName('Carousel'), {
  init,
  next,
  prev,
  setActive,
  getRef,
  getStyle,
  getSlidesStyle,
  render
})
