import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Component } from '@angular/core';
//Connected component
import { ToolbarComponent } from './toolbar.component';

// This is module that contains all all angular materials
import { MaterialModule } from '../../material.module';



@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TranslateModule
  ],
  exports: [ToolbarComponent]
})

export class ToolbarModule { }
