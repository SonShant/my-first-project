import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";


export const RecipeResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    dataStorageService: DataStorageService = inject(DataStorageService)
  ): Observable<{}> =>
  dataStorageService.fetchRecipes().pipe(
      catchError((err) => {
        return of('No data' + err);
      })
    );