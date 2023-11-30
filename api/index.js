const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');

require('dotenv').config();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

app.get('/api/attractions', (req, res) => {
  
    const page = parseInt(req.query.page);
    const per_page = parseInt(req.query.per_page);
    const sort_column = req.query.sort_column;
    const sort_direction = req.query.sort_direction;
    const search = req.query.search;

    const start_idx = (page -1) * per_page;
    var params = [];
    var sql = 'SELECT * FROM attractions';

    if (search) {
      sql += ' WHERE name LIKE ?';
      params.push('%'+ search + '%');
    }

    if (sort_column) {
      sql += ' ORDER BY ' +sort_column+' '+sort_direction;
    }

    sql += ' LIMIT ?, ?';
    params.push(start_idx);
    params.push(per_page);

    db.query(sql, params, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        db.query('SELECT COUNT(id) as total FROM attractions', (err, counts) => {
          const total = counts[0]['total'];
          const total_pages = Math.ceil(total/per_page);
          res.send({
            page: page,
            per_page: per_page,
            total: total,
            total_pages: total_pages,
            data: result
          })
        });
      }
    })
});

app.listen(process.env.SERVER_PORT, () => {
  console.log('Server is running on port ' + process.env.SERVER_PORT);
})