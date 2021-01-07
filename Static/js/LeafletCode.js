// Console.log
console.log("working");

// Title layer

// Satellite View
let satellitemap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data &copy <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

let regularmap = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});


// Night Mode Map 
let nightMode = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	accessToken: API_KEY
});

// Create the map object with center, zoom level and default layer.
let map = L.map('mapid', {
	center: [39.5, -95.71],
zoom: 2.5,
	layers: [satellitemap]
})

// Create a base layer that holds both maps.
let baseMaps = {
    "Satellite view": satellitemap,
	"Map view": regularmap,

  "Night Mode": nightMode
  };

// Earthquakes Dots Layer
let earthquakes = new L.LayerGroup();

// Create the tectonic layer for our map.
let tectonic = new L.LayerGroup();

// Overlays
let overlays = {
    "Earthquakes": earthquakes,
    "Tectonic Plates" : tectonic
  };


//Switch map modes
L.control.layers(baseMaps, overlays).addTo(map);


// Radius of earthquakes dots
function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: pickColor(feature.properties.mag),
     color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // This function determines the color of the circle based on the magnitude of the earthquake.
  function pickColor(magnitude) {
        switch (true) {
        case magnitude > 5:
            return "#72134F ";
        case magnitude > 4:
            return "#922B21";
        case magnitude > 3:
            return "#EE251C";
        case magnitude > 2:
            return "#F5B041";
        case magnitude > 1:
            return "#F7DC6F ";
        default:
            return "#c0f7a6";
        }
    }


  // This function determines the radius of the earthquake marker based on its magnitude.
  // Earthquakes with a magnitude of 0 will be plotted with a radius of 1.
  function getRadius(magnitude) {
      if (magnitude === 0) {
          return 1;
        }
        return magnitude * 3;
    }

    // Accessing the Tectonicplates GeoJSON URL.
// Accessing the Tectonicplates GeoJSON URL.
let tectonicData = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

//Create a style for the lines.
let LineLook = {
	color: "#1F618D",
	weight: 2
}

// Retrieve the tectonic GeoJSON data.
d3.json(tectonicData).then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJson(data, {
    style: LineLook
  }).addTo(tectonic);
      
      // Then we add the tectonic layer to our map.
      tectonic.addTo(map);

// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {

// Creating a GeoJSON layer with the retrieved data.
L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
        console.log(data);
        return L.circleMarker(latlng);
      },
    // We set the style for each circleMarker using our styleInfo function.
  style: styleInfo,
    // We create a popup for each circleMarker to display the magnitude and
    //  location of the earthquake after the marker has been created and styled.
    onEachFeature: function(feature, layer) {
    layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
  }
}).addTo(earthquakes);

    // Then we add the earthquake layer to our map.
    earthquakes.addTo(map);
    
    // Create a legend control object.
    var legend = L.control({
        position: 'bottomright'
    });
    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"), 
        magnitudeLevels = [0, 1, 2, 3, 4, 5];

        div.innerHTML += "<h3>Magnitude</h3>"

        for (var i = 0; i < magnitudeLevels.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + pickColor(magnitudeLevels[i] + 1) + '"></i> ' +
                magnitudeLevels[i] + (magnitudeLevels[i + 1] ? '&ndash;' + magnitudeLevels[i + 1] + '<br>' : '+');
        }
        return div;
    };


    legend.addTo(map);
});
});
