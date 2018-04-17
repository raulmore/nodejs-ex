L.Browser.touch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));
window.mobile = (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) return true; return false;})(navigator.userAgent||navigator.vendor||window.opera);
window.documents = {};
window.tree = null;
window.root = null;
window.dict = {};
window.light = true;
window.LIMIT = 4;
window.KEY = 'public';
if (document.location.href.indexOf('?') > -1) {
	for (var params = document.location.href.split('?')[1].split('&'), i = 0; i < params.length && KEY == 'public'; i++) {
		params[i].indexOf('=') > -1 && (param = params[i].split('=')) && param[0].toLowerCase() == 'key' &&
			(window.KEY = param[1].split('#')[0]);
	}
}
$(document).on('ready', function () {
	window.map = L.map('map', {
		center: [51.50, -0.09],
		zoom: 13,
		timeDimension: true,
		timeDimensionOptions: {
			timeInterval: new Date(new Date().getTime() - 15*365*24*60*60*1000).toISOString()+'/'+new Date().toISOString(),
			period: 'PT1H'
		},
		timeDimensionControl: true,
		timeDimensionControlOptions: {
			minSpeed: 1,
			speedStep: 1,
			limitSliders: true,
			playReverseButton: true,
			loopbutton: true,
			maxSpeed: 100
		}
	});
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			window.map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
		});
	}
	var googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleSatellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}), googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
		maxZoom: 20,
		subdomains:['mt0','mt1','mt2','mt3']
	}).addTo(map), 
		docsFeatures = L.featureGroup().addTo(map), docFeature = L.featureGroup().addTo(map),
		lastBounds = map.getBounds(), lastCategory = '', lastCall = false,
		getDocuments = function (bounds, text, skip4tags, skip4docs, success, notree) {
			if (!bounds) {
				return false;
			}
			bounds = bounds.toBBoxString();
			!text &&
				(text = '');
			!skip4tags &&
				(skip4tags = 0);
			!skip4docs &&
				(skip4docs = 0);
			$.ajax({
				type: 'GET',
				url: '/api/documents/'+bounds+'/'+encodeURIComponent(text)+'?limit='+LIMIT+'&skip4tags='+skip4tags+'&skip4docs='+skip4docs+(notree ? '' : '&tree'),
				dataType: 'json',
				success: function (data) {
					success(data, text, skip4docs, skip4tags);
				}
			});
			return true;
		},
		setList = function (data, text, skip) {
			featureCollection2featureGroup(data, docsFeatures, skip > 0);
			filterByTime({
				time: map.timeDimension.getCurrentTime()
			});
			skip === 0 &&
				$resultLi.parent().children('[id]').remove();
			$skipLi.addClass('hide');
			$skipI.addClass('hide');
			data.features.length == LIMIT && 
				$skipLi.removeClass('hide') && 
				$skipSpan.removeClass('hide');
			data.features.length &&
				$nodocsLi.addClass('hide')
			||
				$nodocsLi.removeClass('hide');
			for (var i = 0, j, doc, tag, li; i < data.features.length; i++) {
				doc = data.features[i];
				!documents[doc._id] &&
					(documents[doc._id] = doc);
				li = $resultLi.clone().on('click', function (ev) {
					$('.result', this.parentNode).removeClass('active').removeClass('light');
					$(this).addClass('active'+(light ? ' light' : ''));
					featureCollection2featureGroup({
						features: [documents[this.id]]
					}, docsFeatures);
				}).appendTo($resultLi.parent()).removeClass('hide')[0];
				li.id = doc._id;
				$('span', li).html(doc.name);
				$('a', li).html(doc.url).attr('href', doc.url.indexOf('http') === 0 ? doc.url : 'http://'+doc.url);
				for (j = 0; j <  doc.categories.length; j++) {
					tag = doc.categories[j].split('/');
					tag.length &&
						(doc.categories[j] = tag[1]);
				}
				$('small', li).html(doc.categories.join(', '));
			}
			$skipLi.remove().appendTo($resultLi.parent());
			setTimeout(function() {
				$('li[id]', $resultLi.parent()).addClass('in');
			});
		},
		setTree = function (data, text, skip4docs, skip4tags) {
			var i, j, n = 0,
				nodes, id, node;
			(skip4tags || skip4docs) &&
				(nodes = tree.selectedNode.childNodes) &&
				(tree.removeNode(nodes[skip4tags + skip4docs]) || true) &&
				(n = nodes.length)
			||
				(nodes = []) &&	
				tree.selectedNode.removeChildNodes();
			featureCollection2featureGroup(data, docsFeatures);
			filterByTime({
				time: map.timeDimension.getCurrentTime()
			});
			for (i = 0; i < data.tags.length; i++) {
				data.tags[i] = data.tags[i]._id.split(text+'/')[1].split('/')[0];
				for (j = 0; j < nodes.length; j++) {
					if (nodes[j].text == data.tags[i]) {
						break;
					}
				}
				j == nodes.length &&
					(node = tree.createNode(data.tags[i], false, 'fa fa-folder', tree.selectedNode, null, 'ctx4folder')) &&
					!skip4tags && !skip4docs &&
						nodes.push(node);
			}
			for (i = 0; i < data.docs.length; i++) {
				node = tree.createNode(data.docs[i].name, false, 'fa fa-file', tree.selectedNode, data.docs[i]._id, 'ctx4file');
				!skip4tags && !skip4docs &&
					nodes.push(node);
			}
			for (i = 0; i < data.features.length; i++) {
				id = data.features[i]._id;
				!documents[id] &&
					(documents[id] = data.features[i])
			}
			for (i = n; i < nodes.length; i++) {
				nodes[i].elementLi.childNodes[1].onclick = function () {
					for (var i = 0, category = ''; i < nodes.length; i++) {
						if (nodes[i].elementLi.childNodes[1] == this && (node = nodes[i])) {
							tree.selectNode(node);
							if (node.tag) {
								featureCollection2featureGroup({
									features: [documents[node.tag]]
								}, docsFeatures);
							}
							else {
								category = '/'+node.text;
								while ((node = node.parent) && node.text && node.parent.text) {
									category = '/'+node.text+category;
								}
								(!lastCall || lastCall[0] != category || !lastCall[1].equals(lastBounds)) &&
									tree.createNode(dict['Loading'] ? dict['Loading'] : 'Loading', false, 'fa fa-spinner fa-spin', nodes[i], null) &&
									(tree.expandNode(nodes[i]) || true) &&
									getDocuments(lastBounds, category, 0, 0, setTree);
								lastCall = [category, lastBounds];
							}
							break;
						}
					}
				}
			}
			for (i = 0, n = 0; i < nodes.length; i++) {
				nodes[i].tag &&
					n++;
			}
			node = tree.selectedNode;
			data.tags.length + data.docs.length >= LIMIT &&
				(node = tree.createNode(dict['More'] ? dict['More'] : 'More', false, 'fa fa-plus fg-green', node, 0)) &&
				(node.elementLi.childNodes[1].onclick = function () {
					for (var i = 0; i < nodes.length; i++) {
						if (nodes[i].elementLi.childNodes[1] == this && (node = nodes[i])) {
							break;
						}
					}
					tree.selectNode(node.parent);
					tree.removeNode(node);
					tree.createNode(dict['Loading'] ? dict['Loading'] : 'Loading', false, 'fa fa-spinner fa-spin', node.parent, null) &&
					getDocuments(lastBounds, text, node.parent.childNodes.length - 1 - n, n, setTree);
				}) &&
				nodes.push(node);
		},
		searchControl, providers = {
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
					app_id: 'oqJ5vQkGwzCLiCusZouy',
					app_code: 'PW2vmIlVy0twOM41Q4KEhw'
				}
			})*/
		},
		flipX = function () {
			$flipperXDiv.hasClass('flip') &&
				setTimeout(function () {
					$('.flipper.Y.flip>.explorer,.flipper.Y:not(.flip)>.searcher').show();
				}, 1200)
			||
				$('.flipper.Y.flip>.explorer,.flipper.Y:not(.flip)>.searcher').hide();
			$flipperXDiv.toggleClass('flip');
		},
		autoSearch = function () {
			var currentBounds = map.getBounds();			
			currentBounds._northEast.lng = currentBounds._southWest.lng + (currentBounds._northEast.lng - currentBounds._southWest.lng)*wF;
			mobile &&
				(currentBounds._southWest.lat = currentBounds._southWest.lat + (currentBounds._northEast.lat - currentBounds._southWest.lat)/2);
			!currentBounds.equals(lastBounds) &&
				(lastBounds = currentBounds) &&
				(tree.selectNode(root) || true) &&
				tree.createNode(dict['Loading'] ? dict['Loading'] : 'Loading', false, 'fa fa-spinner fa-spin', root, null) &&
				(tree.expandNode(root) || true) &&
				getDocuments(lastBounds, null, 0, 0, setTree);
		},
		autoSearchClock = setInterval(autoSearch, 1000),
		light = true, lang, doc_id = null, wF = mobile ? 1 : 0.4,
		filterByTime = function(ev) {
			var layers = docsFeatures.getLayers(),
				i;
			for (i = 0; i < layers.length; i++) {
				layers[i].setStyle &&
					((layers[i].time <= ev.time || !layers[i].time) &&
						(layers[i].options.color = window.light ? 'cyan' : 'blue')
					||
						(layers[i].options.color = window.light ? 'white' : 'black')) &&
					layers[i].setStyle(layers[i].options)
				||
					((layers[i].time <= ev.time || !layers[i].time) &&
						layers[i].setOpacity(1)
					||
						layers[i].setOpacity(0.4));
			}
		};
	map.timeDimension.on('timeload', filterByTime);
	map.timeDimensionControl._toggleDateUTC();
	lastBounds._northEast.lng = lastBounds._southWest.lng + (lastBounds._northEast.lng - lastBounds._southWest.lng)*wF;
	mobile &&
		(lastBounds._southWest.lat = lastBounds._southWest.lat + (lastBounds._northEast.lat - lastBounds._southWest.lat)/2);
	
	if ((lang = (navigator.language ? navigator.language : navigator.userLanguage).split('-')[0]) != 'en') {
		$.ajax({
			type: 'GET',
			url: '/json/'+lang+'.json',
			dataType: 'json',
			success: function (dict) {
				$('.ln-txt').each(function () {
					var txt = this.innerHTML.match(/<span class="ln-txt">[0-9a-zA-Z ]+<\/span>/g),
						props = ['innerHTML', 'value', 'placeholder', 'title'], attrs = ['data-title'], i;
					if (txt) {
						for (i = 0; i < txt.length; i++) {
							txt[i] = [txt[i], txt[i].replace(/<span class="ln-txt">(.*)<\/span>/, '$1').trim()];
							dict[txt[i][1]] &&
								(txt[i][1] = dict[txt[i][1]]);
							this.innerHTML = this.innerHTML.replace(txt[i][0], txt[i][1]);
						}
					}
					for (i in props) {
						dict[this[props[i]]] &&
							(this[props[i]] = dict[this[props[i]]]);
					}
					for (i in attrs) {
						(txt = dict[this.getAttribute(attrs[i])]) &&
							this.setAttribute(attrs[i], txt);
					}
				});
				map.addControl(searchControl = new GeoSearch.GeoSearchControl({
					searchLabel: dict['Enter address'] ? dict['Enter address'] : 'Enter address'
				}));
				map.removeLayer(searchControl.markers);
				$('a:not(.reset)', searchControl.getContainer()).on('click', function () {
					dialog.open();
					$('.leaflet-control-dialog-close', $('.search-selector a').off('click').on('click', function (ev) {
						searchControl.options.provider = providers[ev.target.name];
						$('[type="checkbox"]', ev.target.parentNode.parentNode)[0].checked ?
							($('a', searchControl.getContainer()).off('click') &&
							dialog.destroy())
						:
							dialog.close();
					}).parent().parent().parent()).off('click').on('click', function () {
						searchControl.closeResults();
					});
				});
				var bcrect = searchControl.getContainer().getBoundingClientRect(),
					dialog = L.control.dialog({
						anchor: [bcrect.top - 18, bcrect.left + 12],
						size: [220, 240],
						initOpen: false
					}).setContent($('.search-dialog').html()).addTo(map);
				dialog.freeze();
				dict['All categories'] &&
					root.setText(dict['All categories']);
				window.dict = dict;
			}
		});
	}
	else {		
		map.addControl(searchControl = new GeoSearch.GeoSearchControl({
			searchLabel: 'Enter address'
		}));
		map.removeLayer(searchControl.markers);
		$('a:not(.reset)', searchControl.getContainer()).on('click', function () {
			dialog.open();
			$('.leaflet-control-dialog-close', $('.search-selector a').off('click').on('click', function (ev) {
				searchControl.options.provider = providers[ev.target.name];
				$('[type="checkbox"]', ev.target.parentNode.parentNode)[0].checked ?
					($('a', searchControl.getContainer()).off('click') &&
					dialog.destroy())
				:
					dialog.close();
			}).parent().parent().parent()).off('click').on('click', function () {
				searchControl.closeResults();
			});
		});
		var bcrect = searchControl.getContainer().getBoundingClientRect(),
			dialog = L.control.dialog({
				anchor: [bcrect.top - 18, bcrect.left + 12],
				size: [220, 240],
				initOpen: false
			}).setContent($('.search-dialog').html()).addTo(map);
		dialog.freeze();
	}
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
	map.on('geosearch/showlocation', function () {
		searchControl.markers.getLayers()[0].options.icon.options.iconUrl = 'marker-icon-red.png';
	});
	var $body = $('body'),
		$splitDiv = $('div.split', $body),
		$filesDiv = $('div.files', $body),
		$flipperXDiv = $('div.X.flipper', $filesDiv),
		$flipperYDiv = $('div.Y.flipper', $filesDiv),
		$switchYA = $('a.Y.switch'),
		$searchInput = $('div.searcher form input'),
		$resultLi = $('li.result'),
		$nodocsLi = $('li:not([skip]):not(.result)', $resultLi.parent()),
		$skipLi = $('li[skip]', $resultLi.parent()),
		$skipI = $('i', $skipLi),
		$skipSpan = $('span', $skipLi),
		moreDocuments = function (el) {
			$skipSpan.addClass('hide');
			$skipI.removeClass('hide');
			var skip = parseInt(el.getAttribute('skip')) + LIMIT;
			el.setAttribute('skip', skip);
			getDocuments(lastBounds, $searchInput.val(), 0, skip, setList, true);
		};
	$('.X.switch').on('click', flipX);
	$skipLi.on('click', function () {
		moreDocuments(this);
	});
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
			$filesDiv[0].style.left = ev.clientX + 6 + 'px';
			wF = mobile ? 1 : ev.clientX/$(window).width();
			$body.off('mousemove');
			$body.off('mouseup');
		});
	});
	$('[search]').on('click', function () {
		$skipLi.attr('skip', 0);
		getDocuments(lastBounds, $searchInput.val(), 0, 0, setList, true);
	});
	$('#block-input').on('change', function () {
		var title = this.parentNode.title;
		this.parentNode.title = this.parentNode.getAttribute('data-title');
		this.parentNode.setAttribute('data-title', title);
		!this.checked &&
			(autoSearchClock = setInterval(autoSearch, 1000))
		||
			clearInterval(autoSearchClock);
	});
	$switchYA.on('click', function () {
		$flipperYDiv.toggleClass('flip');
	});
	map.on('baselayerchange', function () {
		light = map.hasLayer(googleSatellite) || map.hasLayer(googleHybrid);
		$('.note').addClass(light ? 'light' : 'dark').removeClass(light ? 'dark' : 'light');
		light ? $splitDiv.removeClass('dark') : $splitDiv.addClass('dark');
		docsFeatures.setStyle({
			color: light ? 'cyan' : 'blue'
		});
		window.light = light;
		filterByTime({
			time: map.timeDimension.getCurrentTime()
		});
	});
	$('.leaflet-control-attribution').hide();		
	window.tree = createTree('tree-container', 'transparent');
	root = tree.createNode('All categories', true, 'fa fa-folder-open', null, null, 'ctx4folder');
	tree.nodeBeforeOpenEvent = function (node) {
		node.setIcon('fa fa-folder-open');
	}
	tree.nodeBeforeCloseEvent = function (node) {
		node.setIcon('fa fa-folder');
	}
	tree.drawTree();
	root.elementLi.childNodes[1].onclick = function () {
		tree.selectNode(root);
		(!lastCall || lastCall[0] != '' || !lastCall[1].equals(lastBounds)) &&
			tree.createNode(dict['Loading'] ? dict['Loading'] : 'Loading', false, 'fa fa-spinner fa-spin', root, null) &&
			(tree.expandNode(root) || true) &&
			getDocuments(lastBounds, null, 0, 0, setTree);
		lastCall = ['', lastBounds];
	}
	tree.selectNode(root);
	getDocuments(lastBounds, null, 0, 0, setTree);
	$('div.searcher ul').on('scroll', function (ev) {
		var li = $('div.searcher ul li[skip]')[0];
		window.pageXOffset + window.innerHeight > li.offsetTop + li.clientHeight - 20 && !$skipSpan.hasClass('hide') &&
			moreDocuments(li);
	});
});

function featureCollection2featureGroup(geoJSON, featureGroup, append) {
	!append &&
		featureGroup.clearLayers();
	for (var feature, coords, options, layer, i = 0; i < geoJSON.features.length; i++) {
		feature = geoJSON.features[i];
		coords = feature.geometry.coordinates;
		options = feature.style;
		layer = false;
		switch (feature.geometry.type) {
			case 'Point':
				options.icon.options.iconUrl = '/lib/leaflet/images/marker-icon.png';
				options.icon = L.icon(options.icon.options);
				layer = new L.marker(L.latLng(coords[1], coords[0]), options);
				break;
			case 'Polygon':
				coords = coords[0];
				options.color = window.light ? 'cyan' : 'blue';		
				if (typeof options.radius !== 'undefined') {
					layer = new L.circle(L.latLng(coords[0][1] + (coords[2][1] - coords[0][1])/2, coords[0][0] + (coords[2][0] - coords[0][0])/2), options.radius, options);
				}
				else {
					var j, latlngs= [];
					for (j = 0; j < coords.length; j++) {
						latlngs.push(L.latLng(coords[j][1], coords[j][0]));
					}
					layer = new L.polygon(latlngs, options);
				}
				break;
			default:
				break;
		}
		layer &&
			(layer.id = feature._id) &&
			layer.on('click', function (ev) {
				var doc = documents[ev.target.id],
					cat = doc.categories[0].split('/'), 
					node = root, i, j, n, nodes = [], onclick;
				for (i = 1; i < cat.length; i++) {
					n = node.childNodes.length;
					for (j = 0; j < n; j++) {
						if (node.childNodes[j].text == cat[i]) {
							nodes.push(node = node.childNodes[j]);
							break;
						}
					}
					j == n &&
						(false && n > 0 && node.childNodes[n - 1].tag === 0 &&
							(tree.removeNode(node.childNodes[n - 1]) || true) &&
							(node = tree.createNode(cat[i], false, 'fa fa-folder', node, null, 'ctx4folder'))
						||
							(node = tree.createNode(cat[i], false, 'fa fa-folder', node, null, 'ctx4folder')));
						nodes.push(node);
				}
				n = node.childNodes.length;
				for (i = 0; i < n; i++) {
					if (node.childNodes[i].tag == doc._id) {
						node = node.childNodes[i];
						break;
					}
				}
				i == n &&
					(n > 0 && node.childNodes[n - 1].tag === 0 &&
						(tree.removeNode(node.childNodes[n - 1]) || true) &&
						(node = tree.createNode(doc.name, false, 'fa fa-file', node, doc._id, 'ctx4file'))
					||
						(node = tree.createNode(doc.name, false, 'fa fa-file', node, doc._id, 'ctx4file')));
				for (i = 0; i < nodes.length; i++) {
					tree.expandNode(nodes[i]);
				}
				tree.selectNode(node);
			}) &&
			(feature.properties && feature.properties.time &&
				(layer.time = feature.properties.time)
			||
				true) &&
			featureGroup.addLayer(layer);
	}
	return featureGroup;
}
