/* eslint-disable */
// const valueLoctions = document.getElementById('map').dataset.loctions
// const locations = JSON.parse(valueLoctions)
mapboxgl.accessToken =
  'pk.eyJ1IjoiZHVjZHV5MDIwOSIsImEiOiJjbDY3cjJ3bDgwMG8zM2pwZThveWg3bjU0In0.l5jczL3oXIuEcbk5yojq1A'
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/ducduy0209/cl051wta0000d14moh68wvwyw',
  center: [-118.113419, 34.111745],
  zoom: 10,
  interactive: false
})
