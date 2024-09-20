// const {countryData} = require('./countriesGJSON/js')
import countryData from './countriesGJSON.js'

let dataSet = [
    // {
    //     country: 'IN',
    //     color: '#00ff00',
    //     maptext: 'Text ABC, India'
    // }
]
let dataSet2 = [
    // {
    //     country: 'CA',
    //     color:'#0000ff',
    //     maptext: 'Text ABC, Canada'
    // }
]
let dataSet3 = [
    // {
    //     country: 'ZM',
    //     color: '#ff0000',
    //     maptext: 'Text ABC, Zambia'
    // }
]

function getColor(val, dataS) {
    for(const data of dataS)
        if(data.country == val) return data.color
}

function getText(val, dataS) {
    for(const data of dataS)
        if(data.country == val) return data.maptext
}

function GJSONGenerator(dataS) {
    function checker(val) {
        for(const data of dataS) {
            if(data.country == val) return true
        }
        return false
    }

    return {
        "type": "FeatureCollection",
        "features": countryData["features"].filter(e=>{
            return checker(e['properties']['ADMIN'])
        })
    }
}

window.onload = async function() {
    
    let config = {
        center: [0,0],
        zoom:0.5,
        zoomControl: false, 
        dragging: false,    
        scrollWheelZoom: false, 
        doubleClickZoom: false, 
        boxZoom: false,         
        keyboard: false,        
        touchZoom: false 
    }

    var map = L.map('map', config);
    var map2 = L.map('map2', config);
    var map3 = L.map('map3', config);
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 3,
        minZoom:0.5,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 3,
        minZoom:1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map2)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 3,
        minZoom:1,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map3)
    map.attributionControl.setPrefix('NITJ')
    map2.attributionControl.setPrefix('NITJ')
    map3.attributionControl.setPrefix('NITJ')
    function SetColours(mp, CDS) {
        function style(feature) {
            return {
                'fillColor': getColor(feature.properties.ADMIN, CDS),
                'color': getColor(feature.properties.ADMIN, CDS),
                'weight': 0.2,
                'opacity': 0.8
            };
        }
        L.geoJSON(GJSONGenerator(CDS), {
            style: style,
            onEachFeature: function(feature, layer) {
                layer.on({
                    mouseover: function(e) {
                        var layer0 = e.target;
                        layer0.bindTooltip(getText(feature.properties.ADMIN, CDS), {permanent:false, direction: 'top'}).openTooltip()
                    },
                    mouseout: function (e) {
                        e.target.closeTooltip();
                    }
                })
            }
        }).addTo(mp)
    }

    try {
        const response = await fetch(`https://nitjfinal.onrender.com/api/diia/maps`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if(response) {
            const data = await response.json()
            if(data) console.log(data)

            dataSet = data.filter(e=>e.type=='student')
            dataSet2 = data.filter(e=>e.type=='research')
            dataSet3 = data.filter(e=>e.type=='alumni')
            SetColours(map, dataSet)
            SetColours(map2, dataSet2)
            SetColours(map3, dataSet3)
        }
    }
    catch(e) {
        console.log(e)
    }

    // SetColours(map, dataSet)
    // SetColours(map2, dataSet2)
    // SetColours(map3, dataSet3)
}