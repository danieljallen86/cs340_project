var express = require('express');
var mysql = require('./dbcon.js');
var CORS = require('cors')

var app = express();
app.set('port', 4568);
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(CORS());

// Characters stuff is from line 26-189

// Nations stuff is from line 194-236

// Elements stuff is from line 241-269

// Teas stuff is from line 274-372

// Orders stuff is from line 378-463

// Poor elements_bent has its lone route at 467

// Characters Stuff

// Get characters table
app.get('/chars',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT DISTINCT c.character_id, c.name AS charname, c.bender, n.name AS naysh, CASE WHEN c.avatar = 1 THEN "Avatar" ELSE e.name END AS element FROM characters c LEFT JOIN elements_bent eb USING (character_id) LEFT JOIN elements e USING (element_id) JOIN nations n USING(nation_id) ORDER BY c.name ASC', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
  });
});

//Insert character
app.post('/chars',function(req,res,next){
  
  // Set bits for bender and avatar
  if (req.body.bender == "air" || req.body.bender == "fire" || req.body.bender == "earth" || req.body.bender == "water") {
    req.body.el_name = req.body.bender;
	  req.body.bender = 1;
	  req.body.avatar = 0;
  } else if (req.body.bender == "avatar") {
    req.body.el_name = ["Fire", "Water", "Air", "Earth"];
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
    // Insert new row into elements_bent if the character is a bender but not the Avatar
    if (req.body.bender == 1 && req.body.avatar == 0) {
      mysql.pool.query("INSERT INTO elements bent (`character_id`, `element_id`) VALUES (?, ?)", 
                      ["SELECT character_id FROM characters WHERE name="+req.body.name, "SELECT element_id FROM elements WHERE LOWER(name)="+req.body.el_name],
                      function(err, result) {
                        if (err) {
                          next(err);
                          return;
                        }
                      });
                    
    }
    // Insert 4 new rows into elements_bent for an Avatar
    else if (req.body.avatar == 1) {
      mysql.pool.query("INSERT INTO elements bent (`character_id`, `element_id`) VALUES (?, ?)", 
                      ["SELECT character_id FROM characters WHERE name="+req.body.name, "SELECT element_id FROM elements WHERE LOWER(name)="+req.body.el_name[0]],
                      function(err, result) {
                        if (err) {
                          next(err);
                          return;
                        }
                        mysql.pool.query("INSERT INTO elements bent (`character_id`, `element_id`) VALUES (?, ?)", 
                        ["SELECT character_id FROM characters WHERE name="+req.body.name, "SELECT element_id FROM elements WHERE LOWER(name)="+req.body.el_name[1]],
                        function(err, result) {
                          if (err) {
                            next(err);
                            return;
                          }
                          mysql.pool.query("INSERT INTO elements bent (`character_id`, `element_id`) VALUES (?, ?)", 
                          ["SELECT character_id FROM characters WHERE name="+req.body.name, "SELECT element_id FROM elements WHERE LOWER(name)="+req.body.el_name[2]],
                          function(err, result) {
                            if (err) {
                            next(err);
                            return;
                            }
                            mysql.pool.query("INSERT INTO elements bent (`character_id`, `element_id`) VALUES (?, ?)", 
                            ["SELECT character_id FROM characters WHERE name="+req.body.name, "SELECT element_id FROM elements WHERE LOWER(name)="+req.body.el_name[3]],
                            function(err, result) {
                              if (err) {
                                next(err);
                                return;
                              }
                            });
                          });
                        });
                      });
    }
    mysql.pool.query('SELECT DISTINCT c.character_id, c.name AS charname, c.bender, n.name AS naysh, CASE WHEN c.avatar = 1 THEN "Avatar" ELSE e.name END AS element FROM characters c LEFT JOIN elements_bent eb USING (character_id) LEFT JOIN elements e USING (element_id) JOIN nations n USING(nation_id) ORDER BY c.name ASC', function(err, rows, fields) {
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
  
  mysql.pool.query("DELETE FROM characters WHERE character_id=?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT DISTINCT c.character_id, c.name AS charname, c.bender, n.name AS naysh, CASE WHEN c.avatar = 1 THEN "Avatar" ELSE e.name END AS element FROM characters c LEFT JOIN elements_bent eb USING (character_id) LEFT JOIN elements e USING (element_id) JOIN nations n USING(nation_id) ORDER BY c.name ASC', function(err, rows, fields) {
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
  
  mysql.pool.query("UPDATE characters SET name=?, nation_id=?, bender=?, avatar=? WHERE character_id=?",
    [req.body.name, req.body.nation, req.body.bender, req.body.avatar, req.body.id],
    function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query('SELECT DISTINCT c.character_id, c.name AS charname, c.bender, n.name AS naysh, CASE WHEN c.avatar = 1 THEN "Avatar" ELSE e.name END AS element FROM characters c LEFT JOIN elements_bent eb USING (character_id) LEFT JOIN elements e USING (element_id) JOIN nations n USING(nation_id) ORDER BY c.name ASC', function(err, rows, fields) {
	    if(err) {
	      next(err);
	      return;
	    }
	    res.json({rows: rows});
    });
  });
});

// Get a specific customer

app.get('/ind-char', function(req, res, next) {

  var context = {};

  mysql.pool.query('SELECT DISTINCT c.name name, n.name nation, CASE WHEN avatar = 1 THEN \'Avatar (all)\' ELSE e.name END AS element FROM characters c LEFT JOIN nations n USING (nation_id) LEFT JOIN elements_bent eb USING (character_id) LEFT JOIN elements e ON e.element_id = eb.element_id WHERE c.character_id = ?', [req.query.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.results = rows;

    mysql.pool.query('SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING (character_id) JOIN teas t USING (tea_id) WHERE character_id = ?', [req.query.id], function (err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.orders = rows;
      res.send(context);
    });
  });
});

// Nations stuff

// Info for displaying nations table
app.get('/nations',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM nations', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
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
    context.results = rows;
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
  mysql.pool.query('SELECT * FROM teas ORDER BY name ASC', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = rows;
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
	
  mysql.pool.query("INSERT INTO teas (`name`, `caffeinated`) VALUES (?, ?)", [req.body.name, req.body.caff], function(err, result){
    if(err){
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM teas ORDER BY name ASC", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	res.json({ rows: rows});
    });
  });
});

// Update a tea

app.put('/teas', function(req, res, next){

  var context = {};

  if (req.body.caff == "true") {
	  req.body.caff = 1;
  } else {
	  req.body.caff = 0;
  }

  mysql.pool.query("UPDATE teas SET name=?, caffeinated=? WHERE tea_id=?", [req.body.name, req.body.caff, req.body.id], function(err, rows, fields) {
    if(err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM teas", function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
  });
});

// Get a specific tea

app.get('/ind-tea', function(req, res, next) {
  var context = {};
  mysql.pool.query('SELECT * FROM teas WHERE tea_id=?', [req.query.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
  });
});

// Delete a tea

app.delete('/teas', function(req, res, next) {
  var context = {};
  mysql.pool.query("DELETE FROM teas WHERE tea_id=?", [req.body.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT * FROM teas", function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
  });
});

// Orders Stuff

// Get orders table

app.get('/orders', function(req, res, next) {
    var context = {};
    mysql.pool.query("SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING(character_id) JOIN teas t USING(tea_id)", function(err, rows, fields) {
	if(err) {
	    next(err);
	    return;
	}
	context.results  = rows;
	res.send(context);
    });
});

// Insert an order

app.post("/orders", function(req, res, next){
  var context = {};
  mysql.pool.query("INSERT INTO orders (`status`, `order_date`, `character_id`, `tea_id`) VALUES (?, ?, ?, ?)", 
  [req.body.status, req.body.date, req.body.char, req.body.tea], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING(character_id) JOIN teas t USING(tea_id)", function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
  });
});

// Update an order

app.put("/orders", function(req, res, next) {
  var context = {};
  mysql.pool.query("UPDATE orders SET status=?, order_date=?, character_id=?, tea_id=? WHERE order_id=?", [req.body.status, req.body.date, req.body.char, req.body.tea, req.body.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING(character_id) JOIN teas t USING(tea_id)", function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
  });
});

// Delete an order

app.delete("/orders", function(req, res, next) {
  var context = {};
  mysql.pool.query("DELETE FROM orders WHERE order_id=?", [req.body.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    mysql.pool.query("SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING(character_id) JOIN teas t USING(tea_id)", function(err, rows, fields) {
      if (err) {
        next(err);
        return;
      }
      context.results = rows;
      res.send(context);
    });
  });
});

// Get a specific order

app.get('/ind-order', function(req, res, next) {
  var context = {};
  mysql.pool.query('SELECT order_id, status, order_date, c.name AS charname, t.name AS tea FROM orders JOIN characters c USING (character_id) JOIN teas t USING (tea_id) WHERE order_id = ?', [req.query.id], function(err, rows, fields) {
    if (err) {
      next(err);
      return;
    }
    context.results = rows;
    res.send(context);
  });
});

// Get elements_bent table

app.get('/elements-bent', function(req, res, next) {
  var context = {};
  mysql.pool.query("SELECT * FROM elements_bent", function(err, rows, fields) {
	  if(err) {
	    next(err);
	    return;
	  }
	  context.result = rows;
	  res.send(context);
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
