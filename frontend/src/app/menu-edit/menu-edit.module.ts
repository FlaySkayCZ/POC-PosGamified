import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
//Connected component
import { MenuEditComponent } from './menu-edit.component';
import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EditItemDialogComponent } from './edit-item-dialog/edit-item-dialog.component';
// Components go here (see below)
import { ToolbarModule } from '../shared/toolbar/toolbar.module';

// This is module that contains all all materials
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [
    MenuEditComponent,
    AddCategoryDialogComponent,
    EditItemDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToolbarModule,
    MaterialModule,
    TranslateModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm']
    }),
  ],
  exports: [
    MenuEditComponent,
    AddCategoryDialogComponent,
    EditItemDialogComponent
  ],
   entryComponents: [
    AddCategoryDialogComponent,
    EditItemDialogComponent
  ]

})
export class MenuEditModule { }
