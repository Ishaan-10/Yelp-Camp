campground = JSON.parse(campground)

mapboxgl.accessToken = 'pk.eyJ1IjoiaXNoYWFuMTAiLCJhIjoiY2txa3BwNXdyMHB6eTJubmRmZHMybTVidSJ9.ofba9n9j9TvvwK8uYcO1aA';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campground.geometry.coordinates, // starting position [lng, lat]
    zoom: 5 // starting zoom
});

var marker1 = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.addTo(map);
var nav = new mapboxgl.NavigationControl();
map.addControl(nav, 'top-left');