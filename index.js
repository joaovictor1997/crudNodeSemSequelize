const express = require('express');
const { engine } = require('express-handlebars');
const conn = require('./db/conn');

const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.post('/books/updatebook', (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const pageqty = req.body.pageqty;

    const sql = `UPDATE books SET ?? = ?, ?? = ? WHERE ?? = ?`;
    const data = ['title', title, 'pageqty', pageqty, 'id', id];

    conn.query(sql, data, (err) => {
        if(err) {
            console.log(err);
            return;
        }

        res.redirect('/books');
    })
});

app.post('/books/remove/:id', (req, res) => {

    const id = req.params.id;

    const sql = `DELETE FROM books WHERE ?? = ?`;

    const data = ['id', id];

    conn.query(sql, data, (err) => {
        if(err) {
            console.log(err);
            return;
        }

        res.redirect('/books');
    })
})

app.get('/books/edit/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM books WHERE ?? = ?`;
    const data = ['id', id];

    conn.query(sql, data, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }

        const book = data[0];
        res.render('editbook', {book});
    })
})

app.get('/books/:id', (req, res) => {
    const id = req.params.id;

    const sql = `SELECT * FROM books WHERE ?? = ?`;
    const data = ['id', id];

    conn.query(sql, data, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }

        const book = data[0];
        res.render('book', {book});
    })
})

app.get('/books', (req, res) => {
    const sql = 'SELECT * FROM books';

    conn.query(sql, (err, data) => {
        if(err) {
            console.log(err);
            return;
        }

        const books = data;
        console.log(books);
        res.render('books', {books});
    })

})

app.post('/books/insertbook', (req, res) => {

    if(!req.body.title) {
        res.redirect('/');
    }

    const title = req.body.title;
    const pageqty = req.body.pageqty;

    const sql = `INSERT INTO books (??, ??) VALUES (?, ?)`;
    const data = ['title','pageqty', title, pageqty]

    conn.query(sql, function(err) {
        if(err) {
            console.log(err);
            return;
        }

        res.redirect('/books');
        console.log('success');
    })
})


app.get('/', (req, res) => {
    res.render('home');
})

app.listen(3000);
