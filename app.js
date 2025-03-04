if (!process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
const express = require("express")
const path = require("path")
const mongoose = require("mongoose")
const ejsMate = require("ejs-mate")
const catchAsync = require("./utils/catchAsync")
const ExpressError = require("./utils/ExpressError")
const Campground = require("./models/campground")
const methodOverride = require("method-override")
const { campgroundSchema, reviewSchema } = require("./schemas.js")
const Review = require("./models/review.js")
const passport = require("passport")
const localStrategy = require("passport-local")
const User = require("./models/user.js")

const session = require("express-session")
const flash = require("connect-flash")

const usersRoutes = require("./routes/users.js")
const campgroundsRoutes = require("./routes/camgrounds.js")
const reviewsRoutes = require("./routes/reviews.js")

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const app = express()

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))
app.engine("ejs", ejsMate)

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "public")))

const sessionConfig = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }

}
app.use(session(sessionConfig))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    next()
})

app.get("/fakeUser", async (req, res) => {
    const user = new User({ email: "Colltttt@gmail.com", username: "Serkan" })
    const newUser = await User.register(user, "chicken")
    res.send(newUser)
})

app.use("/", usersRoutes)
app.use("/campgrounds", campgroundsRoutes)
app.use("/campgrounds/:id/reviews", reviewsRoutes)


app.get("/", (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {
    next(new ExpressError("Page not Found!!", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = "Oh no, Something Went Wrong!"
    res.status(statusCode).render("error", { err })

})

app.listen(3000, () => {
    console.log("Heyy i am listening!!")
})