import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AuthComponent } from "./auth.component";
import { SharedModule } from "../shared/shared.module";

@NgModule({
    declarations: [
        AuthComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        RouterModule.forChild([{path: '', component:AuthComponent}]),
        SharedModule
    ]
})
export class AuthModule{

}