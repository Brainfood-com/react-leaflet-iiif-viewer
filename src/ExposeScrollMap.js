import React from 'react'
import PropTypes from 'prop-types'
import injectSheet from 'react-jss'
import classnames from 'classnames'

import L from 'leaflet'
import { Map } from 'react-leaflet'

const fixedScrollMapStyles = {
  root: {
    position: 'relative',
  },
	map: {
    position: 'absolute',
    width: '100%',
    height: '100%',
	},
}

// leaflet uses up/down wheel for it's own purposes, but then swallows
// all other variants; this class wraps the real Map object with a div,
// and a separate outer wheel handler, and forwards on wheel events
// only when it's the correct direction.
export default injectSheet(fixedScrollMapStyles)(class ExposeScrollMap extends React.Component {
  static defaultProps = {
    onWheel(event) {},
  }

  constructor(props) {
    super(props)
    this.mapRef = React.createRef()
  }

  handleOnWheel = event => {
    const {deltaX} = event
    if (deltaX === 0) {
      this.scrollWheelZoom._onWheelScroll(event)
    } else {
      const {onWheel} = this.props
      onWheel(event)
    }
  }

  componentDidMount() {
    this.scrollWheelZoom = new L.Map.ScrollWheelZoom(this.mapRef.current.leafletElement)
  }

  render() {
    const {classes, className, children, onWheel, ...props} = this.props
    return <div className={classnames(classes.root, className)} onWheel={this.handleOnWheel}>
      <Map className={classes.map} {...props} scrollWheelZoom={false} ref={this.mapRef}>{children}</Map>
    </div>
  }
})

