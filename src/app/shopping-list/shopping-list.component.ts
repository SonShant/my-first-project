import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { LoggingService } from '../logging.service';


@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredientChangeSubscript : Subscription;

  constructor(private shoppingListService:ShoppingListService,
              private loggingService:LoggingService) { }

  ngOnInit() {
    this.ingredients=this.shoppingListService.getIngredients();
    this.ingredientChangeSubscript = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients:Ingredient[])=>{
          this.ingredients=ingredients;
      }
    );

    this.loggingService.printLog('Hello from shopping list component in ngOnInit!!')
  }

  ngOnDestroy(): void {
    this.ingredientChangeSubscript.unsubscribe();
  }

  onEditItem(index:number){
    this.shoppingListService.startEditting.next(index);
  }

}
