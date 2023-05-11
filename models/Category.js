import mongoose from "mongoose";
// on importe l'objet Schema de mongoose
const { Schema } = mongoose;

//on créé l'objet instance de Schema
const categorySchema = new Schema({
    //on ne spécifie pas l'Id, mongoose le fait pour nous
    categoryName: {
        type: String,
        require: true,
        unique: true
    },
    categoryDescription: {
        type: String
    },
    categorySlug: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    categoryImg: { //true if an image exists with slug filename, false if not (then we use a default image)
        type: Boolean
    },
});

//fonction mongoose.model(nom de la "table", schéma qui définie la collection)
const Category = mongoose.model("Category", categorySchema);

export default Category;