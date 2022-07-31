/* eslint-disable */
const mapEl = document.getElementById('map')
if (mapEl) {
  const locations = JSON.parse(mapEl.getAttribute('data-locations'))
  mapboxgl.accessToken =
    'pk.eyJ1IjoiZHVjZHV5MDIwOSIsImEiOiJjbDY3cjJ3bDgwMG8zM2pwZThveWg3bjU0In0.l5jczL3oXIuEcbk5yojq1A'
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/ducduy0209/cl051wta0000d14moh68wvwyw',
    scrollZoom: false
    // center: [-118.113419, 34.111745],
    // zoom: 10,
    // interactive: false
  })

  const bounds = new mapboxgl.LngLatBounds()

  locations.forEach(loc => {
    // Add marker
    const el = document.createElement('div')
    el.className = 'marker'

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map)
    // Add popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map)

    bounds.extend(loc.coordinates)
  })

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  })
}
