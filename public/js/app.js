L.Browser.touch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

var geoJSON = '{"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-0.18402099609375,51.512161535325006],[-0.16754150390625,51.512161535325006],[-0.16754150390625,51.52241636823807],[-0.18402099609375,51.52241636823807],[-0.18402099609375,51.512161535325006]]]},"properties":{"radius":567.3004397774977},"style":{"stroke":true,"color":"#00a","weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"radius":567.3004397774977}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-0.13286590576171878,51.51718219598446],[-0.12531280517578128,51.51718219598446],[-0.12531280517578128,51.52188209627082],[-0.13286590576171878,51.52188209627082],[-0.13286590576171878,51.51718219598446]]]},"properties":{"radius":265.58770200933964},"style":{"stroke":true,"color":"#00a","weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true,"radius":265.58770200933964}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-0.153122,51.502118],[-0.150375,51.518144],[-0.153809,51.511307],[-0.144539,51.508315],[-0.144539,51.500622],[-0.160675,51.507888],[-0.153122,51.502118]]]},"style":{"stroke":true,"color":"#00a","weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-0.16119,51.495065],[-0.152607,51.49795],[-0.15089,51.49624],[-0.156898,51.493248],[-0.16119,51.495065]]]},"style":{"stroke":true,"color":"#00a","weight":4,"opacity":0.5,"fill":true,"fillColor":null,"fillOpacity":0.2,"clickable":true}}]}';

$(document).on('ready', function() {
	window.map = L.map('map', {
		center: [51.50, -0.09],
		zoom: 13
	});
	var googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}).addTo(map), docsFeatures = featureCollection2featureGroup(JSON.parse(geoJSON), L.featureGroup()).addTo(map);

	var lastBounds = map.getBounds();
	setInterval(function () {
		var currentBounds = map.getBounds();
		!currentBounds.equals(lastBounds) &&
			(lastBounds = currentBounds) &&
			console.log('Send request');
	}, 2000);
	var providers = {
		'openstreetmap': new GeoSearch.OpenStreetMapProvider(),
		'esri': new GeoSearch.EsriProvider(),
		'google': new GeoSearch.GoogleProvider(),
		'bing': new GeoSearch.BingProvider({
			params: {
				key: 'AmeeAthoEYDDHfKuGnlyA7Dj3QNQ29sJKVhvs6VdThS_Pncx6QLzxNFIxjX-5iHS'
			}
		})/*,
		'here': new GeoSearch.HEREProvider({
			params: {
				app_id: 'akTstJgjVI1xVhTWhIe9',
				app_code: 'bApmqgyXq4AnGZPips-b2A'
			}
		})*/
	};
	map.addControl(searchControl = new GeoSearch.GeoSearchControl());
	L.control.layers({
		'Terrain': googleTerrain,
		'Roadmap': googleStreets,
		'Satellite': googleSatellite,
		'Hybrid': googleHybrid
	}, {
		'Documents': docsFeatures
	}, {
		'position': 'topleft'
	}).addTo(map);
	//L.control.sidebar('sidebar').addTo(map);
	var shape = {
		shapeOptions: {
			color: '#f50'
		}
	};
	var bcrect = searchControl.getContainer().getBoundingClientRect();
	dialog = L.control.dialog({
		anchor: [bcrect.top - 18, bcrect.left + 12],
		size: [220, 240],
		initOpen: false
	}).setContent($('.search-dialog').remove().html()).addTo(map);
	dialog.freeze();
	var $splitDiv = $('div.split'),
		$body = $('body'),
		$filesDiv = $('div.files'),
		$switchA = $('a.switch');
	$splitDiv.on('mousedown', function () {
		$splitDiv.addClass('resizing');
		$filesDiv.addClass('resizing');
		$body.on('mousemove', function (ev) {
			$splitDiv[0].style.left = ev.clientX + 'px';
		});
		$body.on('mouseup', function (ev) {
			$splitDiv.removeClass('resizing');
			$filesDiv.removeClass('resizing');
			$splitDiv[0].style.left = ev.clientX + 'px';
			$filesDiv[0].style.left = ev.clientX + 4 + 'px';
			$body.off('mousemove');
			$body.off('mouseup');
		});
	});
	$('.leaflet-control-dialog-close', $('.search-selector a').on('click', function (ev) {
		searchControl.options.provider = providers[ev.target.name];
		$('[type="checkbox"]', ev.target.parentNode.parentNode)[0].checked ?
			($('a', searchControl.getContainer()).off('click') &&
			dialog.destroy())
		:
			dialog.close();
	}).parent().parent().parent()).on('click', function () {
		searchControl.closeResults();
	});
	$('a:not(.reset)', searchControl.getContainer()).on('click', function () {
		dialog.open();
	});
	$switchA.on('click', function (ev) {
		$('.files').toggleClass('flip');
	});
	$('.leaflet-control-attribution').hide();
});

function featureGroup2featureCollection(featureGroup) {
	var geoJSON = {
		type: 'FeatureCollection',
		features: []
	};
	featureGroup.eachLayer(function (layer) {
		var feature;
		if (layer.getRadius) {
			var bounds = layer.getBounds(),
				north = bounds.getNorth(),
				south = bounds.getSouth(),
				west = bounds.getWest(),
				east = bounds.getEast();
			feature = {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
				},
				properties: {
					radius: layer.getRadius()
				}
			};
		}
		else {
			feature = layer.toGeoJSON();
		}
		feature.style = layer.options;
		geoJSON.features.push(feature);
	});
	return geoJSON;
}

function featureCollection2featureGroup(geoJSON, featureGroup) {
	if (!geoJSON.features) {
		return false;
	}
	for (var feature, coords, style, i = 0; i < geoJSON.features.length; i++) {
		feature = geoJSON.features[i];
		coords = feature.geometry.coordinates;
		style = feature.style;
		switch (feature.geometry.type) {
			case 'Point':
				if (!style.icon.options.iconUrl) {
					style.icon.options.iconUrl = 'img/marker-icon.png';
				}
				style.icon = L.icon(style.icon.options); 
				featureGroup.addLayer(new L.marker(L.latLng(coords[1], coords[0]), style));
				break;
			case 'Polygon':
				coords = coords[0];				
				if (typeof feature.properties.radius !== 'undefined') {
					featureGroup.addLayer(new L.circle(L.latLng(coords[0][1] + (coords[2][1]  - coords[0][1])/2, coords[0][0] + (coords[2][0]  - coords[0][0])/2), feature.properties.radius, style));
				}
				else {
					var J, latlngs= [];
					for (j = 0; j < coords.length; j++) {
						latlngs.push(L.latLng(coords[j][1], coords[j][0]));
					}
					featureGroup.addLayer(new L.polygon(latlngs, style));
				}
				break;
			default:
				break;
		}
	}
	return featureGroup;
}
