// controllers/ingredients.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js');
// router logic will go here - will be built later on in the lab

router.get('/', async (req, res) => {
    const allIngredients = await Ingredient.find();
    res.render('ingredients/index.ejs', {
        ingredients: allIngredients
    });
});

router.post('/', async (req, res) => {
    try {

        const newIngredient = new Ingredient(req.body);

        newIngredient.owner = req.session.user._id;

        // save changes
        await newIngredient.save();

        // Redirect to Ingredient index or show page
        res.redirect('/ingredients')
    } catch (error) {
        console.log(error);
        // Handle errors
        return res.status(401).send("Post failed. Please try again.");
    }
});

module.exports = router;
