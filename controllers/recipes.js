// controllers/recipes.js

const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Recipe = require('../models/recipe.js');
const Ingredient = require('../models/ingredient.js')

// router logic will go here - will be built later on in the lab
router.get('/', async (req, res) => {
    const allRecipes = await Recipe.find();
    res.render('recipes/index.ejs', { recipes: allRecipes });
});
// AAU, I want to easily find and click on an ‘Add New Recipe’ link, which takes me to a form for adding new recipes.
router.get('/new', async (req, res) => {
    const allIngredients = await Ingredient.find();
    res.render('recipes/new.ejs', {
        ingredients: allIngredients
    });

});

// AAU, I want to see the full details of each recipe I create.

router.get('/:recipeId', async (req, res) => {

    const foundRecipe = await Recipe.findById(req.params.recipeId).populate("ingredients");
    console.log("foundRecipe", foundRecipe)

    res.render('recipes/show.ejs',
        {
            recipe: foundRecipe,
        });


});



router.post('/', async (req, res) => {
    try {

        const newRecipe = new Recipe(req.body);
        newRecipe.owner = req.session.user._id;
        await newRecipe.save();
        // Redirect to recipe index or show page
        res.redirect("/recipes")
    } catch (error) {
        console.log(error);
        // Handle errors
        return res.status(401).send("Post failed. Please try again.");
    }
});
router.delete('/:recipeId', async (req, res) => {
    await Recipe.findByIdAndDelete(req.params.recipeId);
    res.redirect('/recipes');
});

router.get('/:recipeId/edit', async (req, res) => {
    const foundRecipe = await Recipe.findById(req.params.recipeId);
    const allIngredients = await Ingredient.find();
    res.render('recipes/edit.ejs', {
        recipe: foundRecipe,
        ingredients: allIngredients
    });
});

router.put('/:recipeId', async (req, res) => {

    const keysInReqBody = Object.keys(req.body)

    console.log('keysInReqBody', keysInReqBody)

    // filter through keysInReqBody to find all keys that include ingredient-
    const recipeIngredients = keysInReqBody.filter((key) => key.includes("ingredient-"))

    console.log('recipeIngredients', recipeIngredients)

    // split keys (ingredients) at the hyphen to isolate the ingredient id

    const ingredientIds = recipeIngredients.map((ingredient) => {
        // some logic here to split the ingredient string to remove the first part
        console.log("ingredient", ingredient)
        const ingredientId = ingredient.split("-")[1];
        console.log("ingredientid", ingredientId)
        return ingredientId;

    })
    console.log("ingredientids", ingredientIds)

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.recipeId, {
        name: req.body.name,
        instructions: req.body.instructions,
        ingredients: ingredientIds,
    }, { new: true });
    await updatedRecipe.save();

    console.log(updatedRecipe)


    // add the second part of that string to an array called recipeIngredients



    res.redirect(`/recipes/${req.params.recipeId}`);

})


module.exports = router;
