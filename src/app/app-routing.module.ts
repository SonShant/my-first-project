import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    {path:'', redirectTo: 'recipes', pathMatch:'full'},
    {path: 'recipes', loadChildren:() => import('./recipes/recipes.module').then(m => m.RecipesModule)},
    {path: 'shopping-list', loadChildren:() => import('./shopping-list/shopping-list.module').then(n => n.ShoppingListModule)},
    {path: 'auth', loadChildren:() => import('./auth/auth.module').then(o => o.AuthModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
