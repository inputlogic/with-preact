import {map} from 'wasmuth'

import Link from '/project/elements/link'

export default function render ({
  active,
  prev,
  next,
  className = 'carousel-slide',
  getRef,
  getStyle,
  wrapperClass,
  children
}) {
  return <div className={`carousel-block carousel ${wrapperClass}`}>
    <div className='card-carousel-content row'>
      <nav className='nav prev'>
        <Link to={prev} />
      </nav>
      <div className='slides'>
        {map((c, idx) =>
          <div
            ref={(ref) => idx === 0 && getRef(ref)}
            style={getStyle(idx, active)}
            class={`${className}${idx === active ? ' active' : ''}`}
          >{c}</div>
        , children)}
      </div>
      <nav className='nav next'>
        <Link to={next} />
      </nav>
    </div>
  </div>
}