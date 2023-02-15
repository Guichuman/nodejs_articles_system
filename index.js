const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require('./database/database')
const session = require("express-session")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./users/UsersController")

const Article = require('./articles/Article')
const Category = require('./categories/Category')
const User = require('./users/User')

//View engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: "random",
    cookie: {
        maxAge: 300000000
    }
}))

//Static
app.use(express.static('public'));

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Database
connection
    .authenticate()
    .then(() => {
        console.log('conectado no banco')
    }).catch((error) => {
        console.log(error)

    })

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

app.get("/", (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories => {
            res.render('index', { articles: articles, categories: categories })

        })
    })
})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(articles => {
        if (articles != null) {
            Category.findAll().then(categories => {
                res.render('article', { articles: articles, categories: categories })

            })
        } else {
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")

    })
})

app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug

    Category.findOne({
        where: {
            slug: slug
        },
        include: [{
            model: Article,
            include: [{ model: Category }],
        }]
    }).then(category => {
        if (category != null) {
            Category.findAll().then(categories => {
                res.render("index", { articles: category.articles, categories: categories })
            })
        } else {
            res.redirect("/")
        }
    }).catch(error => {
        res.redirect("/")
    })
})

app.listen(8080, () => {
    console.log("rodando")
})