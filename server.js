const request = require('request');
const path = require('path');
var express = require('express');
let mysql = require('mysql');
var cors = require('cors')
var app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
app.use(cors())
app.get('/alm', async (req, res) => {
    try {
      const client = await pool.connect();
      const result = await client.query('SELECT * FROM alerts');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
app.post('/alert', async (req, res) => {
    var nodename = req.body.nodename;
    var ndate = req.body.date;
    var ntime = req.body.time; 
    try {
      const client = await pool.connect();
      const result = await client.query('INSERT INTO alerts(node_name,date,time) VALUES ('+nodename+','+ndate+','+ntime+'');
      const results = { 'results': (result) ? result.rows : null};
      res.send(results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
 app.listen(PORT, () => {
	console.log(`server started on port ${PORT}`);
  });
