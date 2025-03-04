const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Review = require("./review");
const { required } = require("joi");

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

// virtual
ImageSchema.virtual("thumbnail").get(function () {
    return this.url
});


const opts = { toJSON: { virtuals: true } }


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts)

// CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
//     return `<a href="/campgrounds/${this._id}">${this.title}</a>`;


// });
CampgroundSchema.virtual('properties').get(function () {
    return {
        id: this._id,
        title: this.title,
        description: this.description
    }
});

CampgroundSchema.post('findOneAndDelete', async function (doc) {

    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model("Campground", CampgroundSchema)