import { Injectable } from "@angular/core"
import { Recipe } from "./recipe.model";
import { Ingredient } from "../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list/shopping-list.service";
import { Subject } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class RecipeService{
    // public recipeSelected=new EventEmitter<Recipe>();
    recipeChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('Tasty Burger Recipe', 
    //     'This is very yummy!!', 
    //     'https://st.depositphotos.com/1419868/1253/i/950/depositphotos_12532112-stock-photo-cheeseburger.jpg',
    //     [
    //       new Ingredient('Buns', 5),
    //       new Ingredient('Sauses', 6),
    //       new Ingredient('French Fries', 1)
    //     ]),
    //     new Recipe('Yummy Dessert Recipe', 
    //     'This is Sweet Dish!!', 
    //     'https://foodsguy.com/wp-content/uploads/2022/01/Tiramisu.jpg',
    //     [
    //       new Ingredient('Ice-Cream', 1),
    //       new Ingredient('Coco Powder', 5)
    //     ])
    //   ];

    private recipes: Recipe[] = [];

      constructor(private slService:ShoppingListService,
                  private router: Router){}

      getRecipeList(){
        return this.recipes.slice();
      }

      setRecipes(recipes: Recipe[]){
        this.recipes = recipes;
        this.recipeChanged.next(this.recipes.slice());
      }

      getRecipe(index:number){
        return this.recipes[index];
      }

      addIngredientsToShoppingList(ingredients:Ingredient[]){
        this.slService.addIngredients(ingredients);
      }

      addRecipe(recipe:Recipe){
        this.recipes.push(recipe);
        this.recipeChanged.next(this.recipes.slice());
      }

      updateRecipe(index:number, newRecipe:Recipe){
        this.recipes[index] = newRecipe;
        this.recipeChanged.next(this.recipes.slice());
      }

      deleteRecipe(index:number){
        this.recipes.splice(index, 1);
        this.recipeChanged.next(this.recipes.slice());
        this.router.navigate(['/recipes']);
      }
}