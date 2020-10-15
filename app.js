
	const express = require('express'),
		  bodyParser = require('body-parser'),
		  mongoose = require('mongoose'),
		  app = express();

		  let fs = require('fs');
		  let path = require('path');
		  let multer = require('multer');

		  require('dotenv/config');

		  mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser:true, useUnifiedTopology:true});

		  // mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true, useUnifiedTopology:true},
		  // 		err => {
		  // 			console.log('connected');
		  // 		});


		  app.use(bodyParser.urlencoded({extended:false}));
		  app.use(bodyParser.json());

		  app.set('view engine', 'ejs');

		  let storage = multer.diskStorage({
		  	destination: (req, file, cb) => {
		  		cb(null, 'uploads')
		  	},
		  	filename: (req, file, cb) => {
		  		cb(null, file.fieldname + '-'+Date.now())
		  	}
		  });

		  let upload = multer({storage: storage});

		  let imgModel = require('./model');

		  app.get('/', (req, res) => {
		  		imgModel.find({}, (err, items) => {
		  			if(err) {
		  				console.log(err);
		  			}
		  			else {
		  				res.render('app', {items: items});
		  			}
		  		});
		  });


		  app.post('/', upload.single('image'), (req, res, next) => {

		  		var obj = {
		  			name:req.body.name,
		  			desc:req.body.desc,
		  			img: {
		  				data:fs.readFileSync(path.join(__dirname+'/uploads/' + req.file.filename)),
		  				contentType: 'image/png'
		  			}
		  		}
		  		imgModel.create(obj, (err, item) => {
		  			if(err){
		  				console.log(err);
		  			} else {
		  				item.save();
		  				res.redirect('/');
		  			}
		  		});
		  });


		  app.get('/details/:id', (req, res, next) => {

		  		imgModel.find({_id: req.params.id}, (err, data) => {
		  			if(err) console.log(err);
		  			if(data){
		  				res.render('details', {data:data});
		  			}
		  		})
		  });

		  app.listen('3000' || process.env.PORT, err => {
		  		if(err) throw error
		  		console.log('Server Started');
		  })