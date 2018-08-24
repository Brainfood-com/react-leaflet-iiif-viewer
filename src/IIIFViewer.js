import React from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import IIIFTileLayer from './IIIFTileLayer'
import ExposeScrollMap from './ExposeScrollMap'

export default class IIIFViewer extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onWheel: PropTypes.func,
  }

  static defaultProps = {
    onWheel(event) {},
  }

  constructor(props) {
    super(props)
    this.state = {loading: false}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.setState({loading: false})
    }
  }

  handleOnLoading = event => {
    this.setState({loading: true})
  }

  handleOnLoaded = event => {
    this.setState({loading: false})
  }

  render() {
    const {className, url, onWheel} = this.props
    return <ExposeScrollMap
      className={className}
      crs={L.CRS.Simple}
      onWheel={onWheel}
      onLoading={this.handleOnLoading}
      onLoaded={this.handleOnLoaded}
    >
      <IIIFTileLayer
        url={url}
        tileSize={256}
        fitBounds={true}
        setMaxBounds={true}
      />
    </ExposeScrollMap>
  }
}
