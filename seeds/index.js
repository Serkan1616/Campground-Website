const mongoose = require("mongoose")
const Campground = require("../models/campground")
const cities = require("./cities")
const { places, descriptors } = require("./seedHelpers")

mongoose.connect("mongodb://127.0.0.1:27017/yelp_camp")

const db = mongoose.connection
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 200; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: "673f919034e6bf442165405d",
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dmtyvcr1m/image/upload/v1733157644/YelpCamp/mvq93ihnwbuwdcms8ma1.jpg',
                    filename: 'YelpCamp/mvq93ihnwbuwdcms8ma1',
                },
                {
                    url: 'https://res.cloudinary.com/dmtyvcr1m/image/upload/v1733157685/YelpCamp/ateu7aa2m6pcez17ebzb.jpg',
                    filename: 'YelpCamp/ateu7aa2m6pcez17ebzb',

                }
            ],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fuga doloribus beatae quis enim eligendi perspiciatis adipisci. Molestias autem aliquam, dolorem voluptate quis iusto modi odio expedita, omnis praesentium neque laboriosam.",
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        })
        await camp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })