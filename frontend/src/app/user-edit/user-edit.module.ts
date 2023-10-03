import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
//Connected component
import { UserEditComponent } from './user-edit.component';

// Components go here (see below)
import { ToolbarModule } from '../shared/toolbar/toolbar.module';

// This is module that contains all all materials
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [UserEditComponent],
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
  exports: [UserEditComponent]
})
export class UserEditModule { }
