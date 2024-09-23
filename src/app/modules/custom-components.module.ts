import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { TableModule } from "primeng/table";
import { InputTextModule } from "primeng/inputtext";
import { CardModule } from "primeng/card";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatTable, MatTableModule } from "@angular/material/table";
import { ButtonModule } from "primeng/button";
import { PrimeIcons } from "primeng/api";
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
    declarations:[],
    imports:[
        TableModule, 
        InputTextModule,
        CardModule,  
        CommonModule, 
        ReactiveFormsModule,
        MatTable, 
        MatTableModule, 
        CommonModule, 
        TableModule, 
        ButtonModule, 
        CardModule,
        DropdownModule,
    ],
    exports:[
        TableModule,
        InputTextModule,
        CardModule,  
        CommonModule, 
        ReactiveFormsModule,
        MatTable, 
        MatTableModule, 
        CommonModule, 
        TableModule, 
        ButtonModule, 
        CardModule,
        DropdownModule,
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class CustomComponentsModule{}