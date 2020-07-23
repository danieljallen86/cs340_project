/* The root URL for these routes is "http://flip3.engr.oregonstate.edu:4568/
--I used chars, nations, elements, and teas as the routes
--GET requests SELECTS the whole table, POST allows inserts, DELETE does what you would think, and PUT is for UPDATEs.
--For example, a GET request to "http://flip3.engr.oregonstate.edu:4568/elements will send back the rows in the elements table.
--So far, there are all four options for characters, and only SELECT and INSERT for the others.
--To my knowledge, all the names for the properties in the req.body objects match up with the names they have in your HTML files.
please let me know if you find any bugs and/or discrepancies. Thanks!*/

var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors')

var app = express();
app.set('port', 4568);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

// Route handlers for character edits

// Get characters table
app.get('/chars',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM characters', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

//Insert character
app.post('/chars',function(req,res,next){
  var context = req.body;
  
  
  // Get respective nation_id
  if (req.body.nation == "air") {
	req.body.nation = 4;
  }
  
  if (req.body.nation == "earth") {
	req.body.nation = 2;
  }
  
  if (req.body.nation == "fire") {
	req.body.nation = 1;
  }
  
  if (req.body.nation == "water") {
	req.body.nation = 3;
  }
  
  // Set bits for bender and avatar
  if (req.body.bender == "air" || req.body.bender == "fire" || req.body.bender == "earth" || req.body.bender == "water") {
	  req.body.bender = 1;
	  req.body.avatar = 0;
  } else if (req.body.bender == "avatar") {
	  req.body.bender = 1;
	  req.body.avatar = 1;
  } else {
	  req.body.bender = 0;
	  req.body.avatar = 0;
  }

  mysql.pool.query("INSERT INTO characters (`name`, `nation_id`, `bender`, `avatar`) VALUES (?, ?, ?, ?)", [req.body.name, req.body.nation, req.body.bender, req.body.avatar], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM characters", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	res.json({ rows: rows});
    });
  });
});

// Delete character
app.delete('/chars',function(req,res,next){
  var context = {};
  mysql.pool.query("DELETE FROM characters WHERE name=?", [req.body.name], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM characters", function(err, rows, fields) {
	if(err) {
	    nex(err);
	    return;
	}
	res.json({rows: rows});
    });
  });
});

// Update character
app.put('/chars',function(req,res,next){
  
  // Take value from form and replace with respective nation_id
  if (req.body.nation == "air") {
	req.body.nation = 4;
  }
  
  if (req.body.nation == "earth") {
	req.body.nation = 2;
  }
  
  if (req.body.nation == "fire") {
	req.body.nation = 1;
  }
  
  if (req.body.nation == "water") {
	req.body.nation = 3;
  }
  
  // Set bits for bender and avatar columns
  if (req.body.bender == "air" || req.body.bender == "fire" || req.body.bender == "earth" || req.body.bender == "water") {
	  req.body.bender = 1;
	  req.body.avatar = 0;
  } else if (req.body.bender == "avatar") {
	  req.body.bender = 1;
	  req.body.avatar = 1;
  } else {
	  req.body.bender = 0;
	  req.body.avatar = 0;
  }
  
  mysql.pool.query("UPDATE characters SET name=?, nation_id=?, bender=?, avatar=? WHERE name=?",
    [req.body.name, req.body.nation, req.body.bender, req.body.avatar, req.body.name],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM characters", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	res.json({rows: rows});
    });
  });
});

// nations stuff

// Info for displaying nations table
app.get('/nations',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM nations', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

// Making an insert to nations
app.post('/nations', function(req,res,next){
	
	// If a ruler was given, get their character_id. If not, or if the character doesn't exist, their id is null
	mysql.pool.query("SELECT character_id FROM characters WHERE name=?", [req.body.ruler], function(err, result, fields) {
		if(err) {
			next(err);
			return;
		}
		
		if (typeof(result[0]) != "undefined") {
			req.body.ruler = result[0].character_id;
		} else {
			req.body.ruler = null;
		}
  
		if (req.body.element == "air") {
			req.body.element = 4;
		}
  
		if (req.body.element == "earth") {
			req.body.element = 2;
		}
  
		if (req.body.element == "fire") {
			req.body.element = 1;
		}
  
		if (req.body.element == "water") {
		req.body.element = 3;
		}
  
		mysql.pool.query("INSERT INTO nations (`name`, `capital`, `ruler_id`, `element_id`) VALUES (?, ?, ?, ?)", [req.body.name, req.body.capital, req.body.ruler, req.body.element], function(err, result){
			if(err){
				next(err);
				return;
			}
			mysql.pool.query("SELECT * FROM nations", function(err, rows, fields) {
				if(err) {
					next(err);
					return;
				}
				res.json({ rows: rows});
			});
		});
	});
});

// elements stuff

// Get elements table
app.get('/elements',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM elements', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

// Insert in elements
app.post('/elements',function(req,res,next){
  
mysql.pool.query("INSERT INTO elements (`name`, `original_bender`) VALUES (?, ?)", [req.body.name, req.body.original_bender], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM elements", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	res.json({ rows: rows});
    });
  });
});

// Teas stuff

// Get teas table
app.get('/teas',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM teas', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    res.send(context);
  });
});

// Insert new tea
app.post('/teas',function(req,res,next){
  
  // set bit for caffeinated
  
  if (req.body.caff == "true") {
	  req.body.caff = 1;
  } else {
	  req.body.caff = 0;
  }
	
  mysql.pool.query("INSERT INTO teas (`name`, `caffeinated`, `bender`) VALUES (?, ?)", [req.body.name, req.body.caff], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM teas", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	res.json({ rows: rows});
    });
  });
});

// Error handlers
app.use(function(req,res){
  res.status(404);
  res.send("404");
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.send("500");
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
