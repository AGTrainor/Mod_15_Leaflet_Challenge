// Create the map object
let myMap = L.map("map", {
    center: [39.8, -98.6],
    zoom: 4
});

// Add title layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Load the GeoJosn data
let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Get the data with d3.
d3.json(geoData).then(function(data) {
    
    const features = data.features

    for (let i = 0; i < features.length; i++) {

        //variables for circles
        const coordinates = features[i].geometry.coordinates;
        const base_mag = features[i].properties.mag;
        const mag = base_mag*10000;
        const base_time = features[i].properties.time;
        const eastern_time_prop = new Date(base_time).toLocaleString("en-US", {
            timeZone: "EST"
        });

        //Conitional for creating color scale
        let color = "";
        if (coordinates[2] > 90) {
            color = "red";
        }
        else if (coordinates[2] > 70) {
            color = "darkorange";
        }
        else if (coordinates[2] > 50) {
            color = "orange";
        }
        else if (coordinates[2] > 30) {
            color = "yellow";
        }
        else if (coordinates[2] > 10) {
            color = "#9ACD32";
        }
        else {
            color = "green";
        }

        // add circles to the map
        const circle = L.circle([coordinates[1], coordinates[0]], {
            fillOpacity: 0.5,
            color: "black",
            weight: 1,
            fillColor: color,
            radius: mag

        }).bindPopup(`<h1> Magnitude: ${features[i].properties.mag}</h1> <hr> <h2>Location: ${features[i].properties.place}</h2> <hr> <h3> Time: ${eastern_time_prop}`).addTo(myMap);

        circle.bringToFront();
    };
  
});

let categories = ['-10 to 10', '10 to 30', '30 to 50', '50 to 70', '70 to 90', '90+'];

// Define your getColor function
function getColor(depth) {
    if (depth > 90) return colors[5];
    if (depth > 70) return colors[4];
    if (depth > 50) return colors[3];
    if (depth > 30) return colors[2];
    if (depth > 10) return colors[1];
    if (depth > -10) return colors[0];
    return 'red'
}

// Creating the legend
let legend = L.control({ position: 'bottomright' });
legend.onAdd = function() {

    let div = L.DomUtil.create('div', 'info legend');
    let depth = [-10, 10, 30, 50, 70, 90];
    let colors = ["red", "darkorange", "orange", "yellow", "#9ACD32", "green"];
    let legendInfo = "<h4>Depth of Earthquake</h4>";


    for (let i = 0; i < colors.length; i++) {
        let item = "<div style='background: " + colors[i] + "; display: inline-block; width: 20px; height: 10px;'></div> " +
            depth[i] + (depth[i + 1] ? " to " + depth[i + 1] + "<br>" : "+");
        legendInfo += item;
    }
    
    div.innerHTML = legendInfo;
    return div;
};

legend.addTo(myMap);

