
/*const URL = 'mongodb://localhost:27017/geodocuments';
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;*/

var URL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL;
if (URL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    URL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      URL += mongoUser + ':' + mongoPassword + '@';
    }
    URL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;
  }
}
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


module.exports = {
	create: (req, res, collname) => {
		var body = '';
		req.on('data', (chunk) => {
			body+= chunk;
		});
		req.on('end', () => {
			var obj;
			try {
				obj = JSON.parse(body);
			}
			catch (ex) {
				obj = null;
			}
			obj &&
				(MongoClient.connect(URL, (err, db) => {
					db.collection(collname).insertOne(obj);
					db.close();
				}) || true) &&
				res.write(body)
			||
				res.write(JSON.stringify({
					error: 'BAD OBJECT IN BODY'
				}));
			res.end();
		})
	},
	read: (req, res, collname, bbox, tree, text, limit, skip4docs, skip4tags) => {
		switch (collname) {
			case 'documents':
				if (bbox && (bbox = bbox.split(',')).length == 4) {
					var i, j;
					for (i = 0; i < 4; i++) {
						bbox[i] = parseFloat(bbox[i]);
						if (isNaN(bbox[i])) {					
							res.write(JSON.stringify({
								error: 'NO VALID COORD IN BBOX'
							})) &&
							res.end();
							return;
						}
					}
					MongoClient.connect(URL, (err, db) => {
						tree && 
							(db.collection(collname).aggregate([{
								$match: {
									geometry: {
										$geoIntersects: {
											$geometry: {
												type: 'Polygon',
												coordinates: [[
													[bbox[0], bbox[1]],
													[bbox[0], bbox[3]],
													[bbox[2], bbox[3]],
													[bbox[2], bbox[1]],
													[bbox[0], bbox[1]]
												]]
											}
										}
									}
								}
							}, {
								$unwind: '$categories'
							}, {
								$match: {
									categories: new RegExp('^'+text+'/')
								}
							}, {
								$group: {
									_id: '$categories',
									count: {
										$sum: 1
									}
								}
							}, {
								$skip: skip4tags
							}, {
								$limit: limit
							}]).toArray((err, documents) => {
								var geoJSON = {
									type: 'FeatureCollection',
									features: [],
									tags: [],
									docs: []
								}
								for (i = 0; documents && i < documents.length; i++) {
									for (j = 0; j < documents.length; j++) {
										if (i != j && documents[j]._id.match(new RegExp('^'+documents[i]._id+'/'))) {
											break;
										}
									}
									j == documents.length &&
										geoJSON.tags.push(documents[i]);
								}
								if (limit - geoJSON.tags.length > 0) {
									db.collection(collname).find({
										categories: new RegExp('^'+text+'$'),
										geometry: {
											$geoIntersects: {
												$geometry: {
													type: 'Polygon',
													coordinates: [[
														[bbox[0], bbox[1]],
														[bbox[0], bbox[3]],
														[bbox[2], bbox[3]],
														[bbox[2], bbox[1]],
														[bbox[0], bbox[1]]
													]]
												}
											}
										}
									}, {
										name: true,
										categories: true,
										url: true
									}).skip(skip4docs).limit(limit - geoJSON.tags.length).toArray((err, documents) => {
										for (i = 0; documents && i < documents.length; i++) {
											geoJSON.docs.push(documents[i]);
										}
										db.collection(collname).find({
											categories: new RegExp('^'+text+'($|/)'),
											geometry: {
												$geoIntersects: {
													$geometry: {
														type: 'Polygon',
														coordinates: [[
															[bbox[0], bbox[1]],
															[bbox[0], bbox[3]],
															[bbox[2], bbox[3]],
															[bbox[2], bbox[1]],
															[bbox[0], bbox[1]]
														]]
													}
												}
											}
										}).limit(1000).toArray((err, documents) => {
											db.close();
											for (i = 0; documents && i < documents.length; i++) {
												geoJSON.features.push(documents[i]);
											}
											res.write(JSON.stringify(geoJSON));
											res.end();
										});
									});
								}
								else {
									db.collection(collname).find({
										categories: new RegExp('^'+text+'($|/)'),
										geometry: {
											$geoIntersects: {
												$geometry: {
													type: 'Polygon',
													coordinates: [[
														[bbox[0], bbox[1]],
														[bbox[0], bbox[3]],
														[bbox[2], bbox[3]],
														[bbox[2], bbox[1]],
														[bbox[0], bbox[1]]
													]]
												}
											}
										}
									}).limit(1000).toArray((err, documents) => {
										db.close();
										for (i = 0; documents && i < documents.length; i++) {
											geoJSON.features.push(documents[i]);
										}
										res.write(JSON.stringify(geoJSON));
										res.end();
									});
								}
							}) || true)
						||
							(text = new RegExp(text)) &&
							db.collection(collname).find({
								$or: [{
									name: text
								}, {
									categories: text
								}],
								geometry: {
									$geoIntersects: {
										$geometry: {
											type: 'Polygon',
											coordinates: [[
												[bbox[0], bbox[1]],
												[bbox[0], bbox[3]],
												[bbox[2], bbox[3]],
												[bbox[2], bbox[1]],
												[bbox[0], bbox[1]]
											]]
										}
									}
								}
							}).skip(skip4docs).limit(limit).toArray((err, documents) => {
								db.close();
								var geoJSON = {
									type: 'FeatureCollection',
									features: []
								}
								for (i = 0; documents && i < documents.length; i++) {
									geoJSON.features.push(documents[i]);
								}
								res.write(JSON.stringify(geoJSON));
								res.end();
							});
					});
				}
				else {
					res.write(JSON.stringify({
						error: 'NO VALID BBOX IN URL'
					})) &&
					res.end();
				}
				break;
			case 'categories':
				MongoClient.connect(URL, (err, db) => {
					db.collection('documents').aggregate([{
						$unwind: '$categories'
					}, {
						$match: {
							categories: new RegExp(text)
						}
					}, {
						$group: {
							_id: '$categories'
						}
					}, {
						$skip: skip4tags
					}, {
						$limit: limit
					}, {
						$sort: {
							_id: 1
						}
					}]).toArray((err, documents) => {
						db.close();
						res.write(JSON.stringify(documents));
						res.end();
					});
				});
				break;
			default:
				break;
		}
	},
	update: (req, res, collname, id, key) => {
		var body = '';
		req.on('data', (chunk) => {
			body+= chunk;
		});
		req.on('end', () => {
			var obj;
			try {
				obj = JSON.parse(body);
			}
			catch (ex) {
				obj = null;
			}
			id &&
				(obj && 
					(MongoClient.connect(URL, (err, db) => {
						db.collection(collname).replaceOne({
							_id: new ObjectId(id),
							key: key
						}, obj);
						db.close();
					}) || true) &&
					(obj.id = id) &&
					res.write(JSON.stringify(obj))
				||
					res.write(JSON.stringify({
						error: 'BAD OBJECT IN BODY'
					})))
			||
				res.write(JSON.stringify({
					error: 'MISSING ID IN URL'
				}));
			res.end();
		});
	},
	delete: (req, res, collname, id, key) => {
		id &&
			(MongoClient.connect(URL, (err, db) => {
				db.collection(collname).deleteOne({
					_id: new ObjectId(id),
					key: key
				});
				db.close();
			}) || true) &&
			res.write(JSON.stringify({
				id: id
			}))
		||
			res.write(JSON.stringify({
				error: 'MISSING ID IN URL'
			}));
		res.end();
	}
}


