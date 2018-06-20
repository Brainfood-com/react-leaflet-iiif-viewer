import React from 'react'
import PropTypes from 'prop-types'

import L from 'leaflet'
import 'leaflet-draw'
import 'leaflet-iiif'
import { TileLayer } from 'react-leaflet'
import $ from 'jquery'

window.$ = $

// Fix several race conditions in leaflet-iiif
const FixedIiif = L.TileLayer.Iiif.extend({
  onAdd: function(map) {
    // This fixes the case when the layer has been removed before the
    // remote server has given us the IIIF info.
    $.when(this._infoDeferred).done(() => {
      if (this._map) {
        L.TileLayer.Iiif.prototype.onAdd.call(this, map)
      }
    })
  },

  onRemove: function(map) {
    // This bug happens when the server has returned info, and we've started processing, but
    // no tiles have been rendered yet.
    if (this._container) {
      L.TileLayer.Iiif.prototype.onRemove.call(this, map)
    }
  },
})

// Convert leaflet-iiif to react-leaflet
class IIIFTileLayerImpl extends TileLayer {
  createLeafletElement(props: Props): LeafletElement {
    return new FixedIiif(props.url, this.getOptions(props))
  }
}

export default class IIIFTileLayer extends React.Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    onTileload: PropTypes.func,
  }

  static defaultProps = {
    onTileload(event) {},
	}

  // When the remote url has already been fetched, and is sitting in
  // the browser's cache, then there appears to be a race on the
  // start/load events; this ends up causing the full-sized IIIF tiles
  // to have a size of 0/0.
  handleOnTileLoad = event => {
    const {tile} = event
    const {naturalHeight: height, naturalWidth: width, style} = tile
    if (height && style.height === '0px') {
      style.height = height + 'px'
    }
    if (width && style.width === '0px') {
      style.width = width + 'px'
    }
    const {onTileload} = this.props
    onTileload(event)
  }

  render() {
    const {url, ...props} = this.props
    // leaflet-iiif doesn't handle url updates correctly, so we make use
    // of react's key property to cause react to recreate the entire
    // element.
    return <IIIFTileLayerImpl key={url} {...props} url={url} onTileload={this.handleOnTileLoad}/>
  }
}

