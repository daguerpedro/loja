const sqlite3 = require('sqlite3').verbose();
const path = require('path')

let db = new sqlite3.Database(path.join(__dirname, '../databases/store.db'), (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('[DATABASE] Connected to the store database.');

  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER primary key AUTOINCREMENT, name TEXT, price REAL, quantity REAL, description TEXT )")
  })
});

getProducts = (limit = 10, callback) => {
  db.all("SELECT * FROM products LIMIT ?", limit, function (err, row) {
    //TODO: BETTER IMPLEMENTATION
    if (err) return console.log(err)
    callback(row)
  })
}

createProduct = (prod, callback) => {
  db.run(`INSERT INTO products (name,price,quantity,description) VALUES (?, ?, ?, ?); `, prod.name, prod.price, prod.quantity, prod.description,
  (err, row) => {
    console.log(err);
    console.log(row);  
    callback(row);  
  })
}

module.exports.getProducts = getProducts
module.exports.createProduct = createProduct