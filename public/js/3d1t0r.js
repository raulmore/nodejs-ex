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
					var $input = $('[type=checkbox]', this),
						$buttons = $('.searcher .edit,.searcher .remove'),
						checked = $input.prop('checked');
					$('.result', this.parentNode).removeClass('active').removeClass('light');
					$(this).addClass('active'+(light ? ' light' : ''));
					$('[type=checkbox]', this.parentNode).prop('checked', false);
					$input.prop('checked', !checked) &&
					$buttons.prop('disabled', checked);
					!checked &&
						$buttons.removeClass('disabled')
					||
						$buttons.addClass('disabled');
					featureCollection2featureGroup({
						features: [documents[this.id]]
					}, docsFeatures);
				}).appendTo($resultLi.parent()).removeClass('hide')[0];
				li.id = doc._id;
				li.oncontextmenu = function (ev) {
					var node;
					ev.preventDefault();
					ev.stopPropagation();
					tree.nodeContextMenu(ev, node = tree.createNode('', false, '', null, this.id, 'ctx4file'));
					tree.removeNode(node);
				}
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
								$('.edit,.remove').prop('disabled', false).removeClass('disabled');
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
								$('.edit,.remove').prop('disabled', true).addClass('disabled');
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
		shape = {
			shapeOptions: {
				color: '#f50'
			}
		},
		draw = new L.Control.Draw({
			draw: {
				polyline: false,
				rectangle: false,
				marker: false,
				polygon: shape,
				circle: shape
			},
			edit: {
				featureGroup: docFeature,
				remove: false
			}
		}),
		$draw = $(draw.getContainer()),
		flipX = function () {
			$flipperXDiv.hasClass('flip') &&
				setTimeout(function () {
					$('.flipper.Y.flip>.explorer,.flipper.Y:not(.flip)>.searcher').show();
				}, 1200)
			||
				$('.flipper.Y.flip>.explorer,.flipper.Y:not(.flip)>.searcher').hide();
			$flipperXDiv.toggleClass('flip');
		},
		setForm = function (doc) {
			var choices4tags,
				choices4subtags;
			tagsChoices.clearStore();
			subtagsChoices.clearStore();
			if (doc) {
				var i, j, k, tag, subtag,
					tags = [], subtags = [];
				titleInput.value = doc.name;
				urlInput.value = doc.url;
				dateInput.value = new Date(doc.properties.time).toDateString();
				for (i = 0; i < doc.categories.length; i++) {
					tag = doc.categories[i].split('/');
					tag.length > 1 && tags.indexOf(tag[1]) < 0 &&
						tags.push(tag[1]);
					for (j = 2; j < tag.length; j++) {
						subtag = tag[1];
						for (k = 2; k <= j; k++) {
							subtag+= '/'+tag[k];
						}
						subtags.indexOf(subtag) < 0 &&
							subtags.push(subtag);
					}
				}
				choices4tags = [];
				choices4subtags = [];
				for (i = 0; i < choices.length; i++) {
					tags.indexOf(choices[i]._id) < 0 &&
						choices4tags.push(choices[i]);
					subtags.indexOf(choices[i]._id) < 0 &&
						choices4subtags.push(choices[i]);
				}
				tagsChoices.setValue(tags);
				subtagsChoices.setValue(subtags);
				doc_id = doc._id;
			}
			else {
				doc_id = titleInput.value = urlInput.value = dateInput.value = null;
				choices4tags = choices;
				choices4subtags = choices;
			}
			tagsChoices.setChoices(choices4tags, '_id', '_id');
			subtagsChoices.setChoices(choices4subtags, '_id', '_id');
			updateParentTagChoices();
			return true;
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
		removeDocument = function (node) {
			tiModal.create($('.confirm-dialog').html().replace('{name}', documents[node.tag].name), {
				events: {
					'click .cancel': tiModal.fadeOut,
					'click .ok': function () {
						$.ajax({
							type: 'DELETE',
							url: '/api/documents/'+node.tag+'?key='+KEY,
							dataType: 'json',
							success: function () {
								node.removeNode();
							}
						});
						tiModal.fadeOut();
					}
				}
			}).show();
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
		},
		urlInput = $('[name=url]')[0],
		titleInput = $('[name=title]')[0],
		dateInput = $('[name=date]')[0],
		typeoflinkInput = $('[name=typeoflink]').on('change', function () {
			this.value == '1' &&
				(urlInput.disabled = true) &&
				explorer.choose()
			||
				(urlInput.disabled = false);
		}),
		checkTyping = function () {
			this.value == "0" &&
				(this.checked = true);
		},
		$subtags = $('[name=tags][choices-child]'),
		$tagsParent = $('[name=parentTags]').on('choice', function () {
			subtagsChoices.enable();
		}).on('choice', function (ev) {
			var regex = new RegExp('(^|/)'+ev.detail.choice.value+'/'),
				values = subtagsChoices.getValue(),
				i;
			for (i = 0; i < values.length; i++) {
				values[i].value.match(regex) &&
					subtagsChoices.highlightItem(values[i]);
			}
		}),
		tagsChoices, subtagsChoices, parentTagsChoices;
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
				L.drawLocal.draw.handlers.simpleshape.tooltip.end = dict['Release mouse to finish drawing'] ? dict['Release mouse to finish drawing'] : 'Release mouse to finish drawing';
				L.drawLocal.draw.handlers.circle.radius = dict['Radius'] ? dict['Radius'] : 'Radius';
				L.drawLocal.draw.handlers.circle.tooltip.start = dict['Click and drag to draw circle'] ? dict['Click and drag to draw circle'] : 'Click and drag to draw circle';
				L.drawLocal.draw.handlers.polygon.tooltip.start = dict['Click to start drawing shape'] ? dict['Click to start drawing shape'] : 'Click to start drawing shape';
				L.drawLocal.draw.handlers.polygon.tooltip.end = dict['Click first point to close this shape'] ? dict['Click first point to close this shape'] : 'Click first point to close this shape';
				L.drawLocal.draw.handlers.polygon.tooltip.cont = dict['Click to continue drawing shape'] ? dict['Click to continue drawing shape'] : 'Click to continue drawing shape';
				L.drawLocal.draw.toolbar.buttons.circle = dict['Draw a circular area'] ? dict['Draw a circular area'] : 'Draw a circular area';
				L.drawLocal.draw.toolbar.buttons.polygon = dict['Draw a polygonal area'] ? dict['Draw a polygonal area'] : 'Draw a polygonal area';
				L.drawLocal.draw.toolbar.finish.text = dict['Finish'] ? dict['Finish'] : 'Finish';
				L.drawLocal.draw.toolbar.finish.title = dict['Finish drawing'] ? dict['Finish drawing'] : 'Finish drawing';
				L.drawLocal.draw.toolbar.undo.text = dict['Delete last point'] ? dict['Delete last point'] : 'Delete last point';
				L.drawLocal.draw.toolbar.undo.title = dict['Delete last point drawn'] ? dict['Delete last point drawn'] : 'Delete last point drawn';
				L.drawLocal.draw.toolbar.actions.text = dict['Cancel'] ? dict['Cancel'] : 'Cancel';
				L.drawLocal.draw.toolbar.actions.title = dict['Cancel drawing'] ? dict['Cancel drawing'] : 'Cancel drawing';
				L.drawLocal.edit.toolbar.buttons.edit = dict['Edit geometry'] ? dict['Edit geometry'] : 'Edit geometry';
				L.drawLocal.edit.toolbar.buttons.editDisabled = dict['No geometries to edit'] ? dict['No geometries to edit'] : 'No geometries to edit';
				L.drawLocal.edit.toolbar.actions.save.text = dict['Accept'] ? dict['Accept'] : 'Accept';
				L.drawLocal.edit.toolbar.actions.save.title = dict['Keep changes'] ? dict['Keep changes'] : 'Keep changes';
				L.drawLocal.edit.toolbar.actions.cancel.text = dict['Cancel'] ? dict['Cancel'] : 'Cancel';
				L.drawLocal.edit.toolbar.actions.cancel.title = dict['Discard changes'] ? dict['Discard changes'] : 'Discard changes';
				L.drawLocal.edit.handlers.edit.tooltip.text = dict['Drag handles or marker to edit shape'] ? dict['Drag handles or marker to edit shape'] : 'Drag handles or marker to edit shape';
				L.drawLocal.edit.handlers.edit.tooltip.subtext = dict['Click cancel to undo changes'] ? dict['Click cancel to undo changes'] : 'Click cancel to undo changes';
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
				datepicker(dateInput, {
					customMonths: dict['_months'] ? dict['_months'] : null,
					customDays: dict['_days'] ? dict['_days'] : null,
					overlayPlaceholder: dict['Enter a 4-digit year'] ? dict['Enter a 4-digit year'] : 'Enter a 4-digit year',
					overlayButton: dict['Accept'] ? dict['Accept'] : 'Accept'
				});
				var options = {
					loadingText: dict['Loading'] ? dict['Loading'] : 'Loading',
					noResultsText: dict['No results found'] ? dict['No results found'] : 'No results found',
					noChoicesText: dict['No categories to choose from'] ? dict['No categories to choose from'] : 'No categories to choose from',
					itemSelectText: dict['Press to select'] ? dict['Press to select'] : 'Press to select'
				};
				parentTagsChoices = new Choices($tagsParent[0], Object.assign({
					searchResultLimit: 100
				}, options));
				tagsChoices = new Choices('[name=tags]:not([choices-child])', Object.assign(options, {
					editItems: true,
					maxItemCount: 50,
					searchResultLimit: 11,
					removeItemButton: true
				}));
				subtagsChoices = new Choices('[name=tags][choices-child]', options).disable();
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
		datepicker(dateInput);
		var options = {
			loadingText: 'Loading',
			noChoicesText: 'No categories to choose from'
		};
		parentTagsChoices = new Choices($tagsParent[0], Object.assign({
			searchResultLimit: 100
		}, options));
		tagsChoices = new Choices('[name=tags]:not([choices-child])', Object.assign(options, {
			editItems: true,
			maxItemCount: 50,
			searchResultLimit: 11,
			removeItemButton: true
		}));
		subtagsChoices = new Choices('[name=tags][choices-child]', options).disable();
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
	map.on('draw:created', function (ev) {
		ev.layer.options.color = '#ff0';
		docFeature.addLayer(ev.layer);
		$save.show();
	}).on('draw:drawstart', function () {
		docFeature.clearLayers();
		$save.hide();
	}).on('geosearch/showlocation', function () {
		var layer = searchControl.markers.getLayers()[0];
		layer.options.icon.options.iconUrl = 'marker-icon-red.png';
		docFeature.clearLayers();
		docFeature.addLayer(layer);
		$save.show();
	});
	var $body = $('body'),
		$splitDiv = $('div.split', $body),
		$filesDiv = $('div.files', $body),
		$flipperXDiv = $('div.X.flipper', $filesDiv),
		$flipperYDiv = $('div.Y.flipper', $filesDiv),
		$switchYA = $('a.Y.switch'),
		$switchX = $('.X.switch'),
		$steps = $('[step]'),
		$form = $('form', $steps.parent()),
		$save = $('[save]', $steps.parent()).hide(),
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
	$switchX.on('click', function () {
		this.className.indexOf('edit') > -1 &&
			(this.parentNode.className.indexOf('searcher') > -1 &&
				setForm(documents[$(':checked', $resultLi.parent()).parent()[0].id])
			||
				setForm(documents[tree.selectedNode.tag]))
		||
			this.className.indexOf('new') > -1 &&
				setForm(null);
		flipX();
	});
	$('.remove').on('click', function () {
		if (this.parentNode.className.indexOf('searcher') > -1) {
			var $li = $(':checked', $resultLi.parent()).parent();
			removeDocument({
				tag: $li[0].id,
				removeNode: function () {
					$li.remove();
				}
			});
		}
		else {
			removeDocument(tree.selectedNode);
		}
	});
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
	$('.new').on('click', function () {
		doc_id = null;
	});
	$('.edit').on('click', function () {
		doc_id = tree.selectedNode.tag;
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
	$steps.on('click', function () {
		var $inputs = $('[required]:invalid', $form);
		if ($inputs.length > 0) {
			$inputs.addClass('highlight');
			setTimeout(function () {
				$inputs.removeClass('highlight');
			}, 900);
			return;
		}
		$filesDiv[0].style.left = $splitDiv[0].style.left = '';
		$filesDiv.toggleClass('inmap');
		$splitDiv.toggleClass('inmap');
		this.getAttribute('step') == 'map' &&
			$form.hide() &&
			$switchX.hide() &&
			map.addControl(draw) &&
			map.removeLayer(docsFeatures) &&
			$('.note').addClass('visible') &&
			$('[aria-haspopup]').on('mouseover', function () {
				$('div.note').hide();
			}).on('mouseleave', function () {
				$('div.note').show();
			}) &&
			(doc_id &&
				$save.show() &&
				featureCollection2featureGroup({
					features: [documents[doc_id]]
				}, docFeature)
			||
				true)
		||
			$save.hide() &&
			$form.show() &&
			$switchX.show() &&
			map.removeControl(draw) &&
			map.addLayer(docsFeatures) &&
			$('.note').remove() && 
			$('[aria-haspopup]').off('mouseover').off('mouseleave') &&
			docFeature.clearLayers();
		$steps.toggleClass('hide');
	});
	$save.on('click', function () {
		var feature = featureGroup2feature(docFeature),
			tags = tagsChoices.getValue(true).concat(subtagsChoices.getValue(true)),
			categories = [],
			regex, i, j;
		for (i = 0; i < tags.length; i++) {
			regex = new RegExp('(^|/)'+tags[i]+'/');
			for (j = 0; j < tags.length; j++) {
				if (i != j && tags[j].match(regex)) {
					break;
				}
			}
			j == tags.length &&
				categories.push('/'+tags[i]);
		}
		!categories.length &&
			categories.push('');
		feature.name = titleInput.value;
		feature.key = KEY;
		feature.url = urlInput.value;
		feature.properties = {
			time: new Date(dateInput.value).getTime()
		}
		feature.categories = categories;
		$.ajax({
			type: doc_id ? 'PUT' : 'POST',
			url: 'api/documents/'+(doc_id ? doc_id : '')+'?key='+KEY,
			dataType: 'json',
			contentType: 'application/json; charset=UTF-8', 
			data: JSON.stringify(feature),
			beforeSend: function () {
				$save.addClass('disabled');
			},
			success: function (data) {
				$save.removeClass('disabled');
				docFeature.clearLayers();
				tree.selectNode(root);
				tree.createNode(dict['Loading'] ? dict['Loading'] : 'Loading', false, 'fa fa-spinner fa-spin', root, null);
				tree.expandNode(root);
				documents[data.id] = data;
				getDocuments(lastBounds, null, 0, 0, setTree);
				autoSearchClock = setInterval(autoSearch, 1000);
				map.addLayer(docsFeatures) &&
				map.removeControl(draw) &&
				$('.note').remove() && 
				$('[aria-haspopup]').off('mouseover').off('mouseleave');
				tiModal.create($('.registered-dialog').html().replace('{name}', data.name), {
					events: {
						'click .ok': tiModal.fadeOut
					}
				}).show();
			}
		});
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
	$('span.note.search i').on('click', function () {
		$('.note.search').remove();
	});
	$('span.note.draw i').on('click', function () {
		$('.note.draw').remove();
	});
	$(map.getContainer()).hasClass('leaflet-touch') &&
		$('div.note').addClass('touch');
	$('.leaflet-control-attribution').hide();

	var renameSubtag = function (ev) {
			var values = subtagsChoices.getValue(true), value, i;
			for (i = 0; i < values.length; i++) {
				if (values[i] == ev.detail.value && (value = parentTagsChoices.getValue(true))) {
					values[i] = value+'/'+values[i];
					break;
				}
			}
			i < values.length && 
				setTimeout(function () {
					$subtags.off('addItem', renameSubtag).off('removeItem', removeChildrenTags);
					subtagsChoices.removeItemsByValue(ev.detail.value);
					$subtags.on('removeItem', removeChildrenTags);
					subtagsChoices.setValue([values[i]]);
					$subtags.on('addItem', renameSubtag);
				}, 300);
		},
		updateParentTagChoices = function () {
			var values = tagsChoices.getValue(true).concat(subtagsChoices.getValue(true)),
				value = parentTagsChoices.getValue(true),
				i;
			value != null && values.indexOf(value) < 0 &&
				subtagsChoices.hideDropdown() &&
				resetParentTag();
			for (i = 0; i < values.length; i++) {
				values[i] = {
					_id: values[i]
				};
			}
			parentTagsChoices.setChoices(values, '_id', '_id', true);
		},
		resetParentTag = function () {
			parentTagsChoices.removeItemsByValue(parentTagsChoices.getValue(true)) &&
			subtagsChoices.disable();
		},
		removeChildrenTags = function (ev) {
			var regex = new RegExp('(^|/)'+ev.detail.value+'/'),
				values = subtagsChoices.getValue(true),
				i;
			for (i = 0; i < values.length; i++) {
				values[i].match(regex) &&
					subtagsChoices.removeItemsByValue(values[i]);
			}
		},
		choices;		
	$.ajax({
		type: 'GET',
		url: '/api/categories/',
		dataType: 'json',
		success: function (data) {
			choices = [];
			for (var i = 0; i < data.length; i++) {
				data[i]._id &&
					choices.push({
						_id: data[i]._id.slice(1)
					});
			}
		}
	});
	$('[name=tags][choices-child]').on('addItem', renameSubtag).on('hideDropdown', resetParentTag);
	$('[name=tags]').on('search', function () {
		var $this = $(this),
			text = $this.siblings('input').val();
		$.ajax({
			type: 'GET',
			url: '/api/categories/bbox/'+text,
			dataType: 'json',
			success: function (data) {
				for (var i = 0; i < data.length; i++) {
					data[i]._id = data[i]._id.slice(1);
				}
				data.unshift({
					_id: text
				});
				($this.attr('choices-child') ? subtagsChoices : tagsChoices).setChoices(data, '_id', '_id', true);
			}
		});
	}).on('change', updateParentTagChoices).on('removeItem', removeChildrenTags);
	
	window.tree = createTree('tree-container', 'transparent', {
		'ctx4folder': {
			elements: [{
				text: 'Create document',
				icon: 'lib/aimaraJS/images/add.png',
				action: function (node) {
					var category = node != root ? '/'+node.text : '';
					while ((node = node.parent) && node.text && node.parent.text) {
						category = '/'+node.text+category;
					}
					setForm({
						name: '',
						url: '',
						categories: [category]
					});
					flipX();
				}
			}, {
				text: 'Remove documents',
				icon: 'lib/aimaraJS/images/delete.png',
				action: function (node) {
					node.removeChildNodes();
				}
			}]
		},
		'ctx4file': {
			elements: [{
				text: 'Edit document',
				icon: 'lib/aimaraJS/images/edit.png',
				action: function (node) {
					tree.selectNode(node);
					setForm(documents[node.tag]);
					flipX();
				}
			}, {
				text: 'Remove document',
				icon: 'lib/aimaraJS/images/delete.png',
				action: removeDocument
			}]
		}
	});
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
		$('.edit,.remove').prop('disabled', true).addClass('disabled');
	}
	tree.selectNode(root);
	getDocuments(lastBounds, null, 0, 0, setTree);

	$('div.searcher ul').on('scroll', function (ev) {
		var li = $('div.searcher ul li[skip]')[0];
		window.pageXOffset + window.innerHeight > li.offsetTop + li.clientHeight - 20 && !$skipSpan.hasClass('hide') &&
			moreDocuments(li);
	});

	var explorer = window.Kloudless.explorer({
		app_id: 'iCZ_ICMy43H0NSoz0QbLvmyjzCHf2frAOPaBfWVgh9_vrFIM',
		persist: 'local',
		services: ['all'],
		display_backdrop: true,
		create_folder: true,
		retrieve_token: false,
		tokens: [],
		multiselect: false,
		link: true,
		direct_link: true,
		types: ['all'],
	}).on('success', function (file) {
		file.length &&
			(urlInput.value = file[0].link);
	}).on('cancel', function () {
		typeoflinkInput.each(checkTyping);
		urlInput.disabled = false;
	});
	typeoflinkInput.each(checkTyping);
});

function featureGroup2feature(featureGroup) {
	var layers;
	if ((layers = featureGroup.getLayers()).length) {
		var feature;
		if (layers[0].getRadius) {
			var bounds = layers[0].getBounds(),
				north = bounds.getNorth(),
				south = bounds.getSouth(),
				west = bounds.getWest(),
				east = bounds.getEast();
			feature = {
				type: 'Feature',
				geometry: {
					type: 'Polygon',
					coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
				}
			};
			layers[0].options.radius = layers[0].getRadius();
		}
		else {
			feature = layers[0].toGeoJSON();
		}
		feature.style = layers[0].options;
		return feature;
	}
	return false;
}

function featureCollection2featureGroup(geoJSON, featureGroup, append) {
	!append &&
		featureGroup.clearLayers();
	typeof window.light == 'undefined' &&
		(window.light = true);
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
						(node = tree.createNode(doc.name, false, 'fa fa-file', node, doc._id, 'ctx4file'))/* &&
						(tree.createNode(dict['More'] ? dict['More'] : 'More', false, 'fa fa-plus fg-green', node.parent, 0).elementLi.childNodes[1].onclick = onclick)*/
					||
						(node = tree.createNode(doc.name, false, 'fa fa-file', node, doc._id, 'ctx4file')));
				for (i = 0; i < nodes.length; i++) {
					tree.expandNode(nodes[i]);
				}
				tree.selectNode(node);
				$('.explorer .edit,.explorer .remove').prop('disabled', false).removeClass('disabled');
				$('input', $('div.searcher ul')).prop('checked', false);
				$('input', $('#'+doc._id)).prop('checked', true);
			}) &&
			(feature.properties && feature.properties.time &&
				(layer.time = feature.properties.time)
			||
				true) &&
			featureGroup.addLayer(layer);
	}
	return featureGroup;
}
