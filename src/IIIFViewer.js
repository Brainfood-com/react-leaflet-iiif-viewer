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
    this.state = {center: [0, 0], zoom: 1, loading: false}
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.url !== nextProps.url) {
      this.setState({loading: false})
    }
  }

  handleOnViewportChange = ({center, zoom}) => {
    this.setState({center, zoom})
  }

  handleOnLoading = event => {
    this.setState({loading: true})
  }

  handleOnLoaded = event => {
    this.setState({loading: false})
  }

  render() {
    const {className, url, onWheel} = this.props
    const {center, zoom, tileLoadCount} = this.state
    return <ExposeScrollMap
      className={className}
      center={center}
      zoom={zoom}
      crs={L.CRS.Simple}
      onWheel={onWheel}
      onViewportChange={this.handleOnViewportChange}
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
