import {Component,OnDestroy,OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slform: NgForm;
  
  subscription: Subscription;
  editMode = false;
  editItemIndex:number;
  editedItem:Ingredient;

  constructor(private shoppingListService:ShoppingListService) { }

  ngOnInit() {
    this.subscription= this.shoppingListService.startEditting.subscribe(
      (index:number) => {
        this.editItemIndex= index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getIngredient(index); 
        this.slform.setValue({
          'name' : this.editedItem.name,
          'amount' : this.editedItem.amount
        })
      }
    );
  }

  onAddItem(form: NgForm) {   
    const value= form.value; 
    const newIngredient = new Ingredient(value.name, value.amount);

    if(this.editMode){
      this.shoppingListService.updateIngredient(this.editItemIndex, newIngredient);      
    }else{
      this.shoppingListService.addIngredient(newIngredient);
    }
    form.reset();
    this.editMode= false;
  }

  onClear(){
    this.slform.reset();
    this.editMode = false;
  }

  onDelete(){
    this.shoppingListService.deleteIngredient(this.editItemIndex);
    this.onClear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
