import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { exhaustMap, map, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) { }

  storeRecipes(){
    const recipes = this.recipeService.getRecipeList();
    this.http
    .put('https://ng-course-recipe-book-ab4d1-default-rtdb.firebaseio.com/recipes.json', recipes)
    .subscribe(response => {
        console.log(response);
      });  
  }

  // fetchRecipes(){
    // this.http
    // .get<Recipe[]>('https://ng-course-recipe-book-ab4d1-default-rtdb.firebaseio.com/recipes.json')
    // .pipe(
    //   map(recipes => {
    //     return recipes.map(recipe => {
    //       return {
    //       ...recipe,
    //         ingredients: recipe.ingredients ? recipe.ingredients : []
    //       };
    //     });
    //   })
    //   )
    // .subscribe(recipes => {
    //   this.recipeService.setRecipes(recipes);
    // });

  fetchRecipes(){       
          return this.http
          .get<Recipe[]>(
            'https://ng-course-recipe-book-ab4d1-default-rtdb.firebaseio.com/recipes.json'
          ).pipe(
            map(recipes => {
              return recipes.map(recipe => {
                return {
                ...recipe,
                  ingredients: recipe.ingredients ? recipe.ingredients : []
                };
              });
            }),
            tap(recipes => {
              this.recipeService.setRecipes(recipes);
            })      
        ); 
  
    // .pipe(
    //   map(recipes => {
    //     return recipes.map(recipe => {
    //       return {
    //       ...recipe,
    //         ingredients: recipe.ingredients ? recipe.ingredients : []
    //       };
    //     });
    //   }),
    //   tap(recipes => {
    //     this.recipeService.setRecipes(recipes);
    //   }) 
    //   )
    
  }
}
