import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ValidDirective } from '../directives/valid.directive';
import { LoadingButtonComponent } from '../components/loading-button/loading-button.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ValidDirective,
    LoadingButtonComponent
  ],
  
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ValidDirective,
    LoadingButtonComponent
  ]
})
export class SharedModule { }
