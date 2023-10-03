import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
//Connected component
import { DashboardComponent } from './dashboard.component';
import { AdminModule } from '../admin/admin.module';
import { UserEditModule } from '../user-edit/user-edit.module';
import { MenuEditModule } from '../menu-edit/menu-edit.module';
import { CashierModule } from '../cashier/cashier.module';
// Components go here (see below)
import { ToolbarModule } from '../shared/toolbar/toolbar.module';

// This is module that contains all all materials
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    AdminModule,
    ReactiveFormsModule,
    ToolbarModule,
    MaterialModule,
    TranslateModule,
    UserEditModule,
    MenuEditModule,
    CashierModule,
    FlexLayoutModule.withConfig({
      useColumnBasisZero: false,
      printWithBreakpoints: ['md', 'lt-lg', 'lt-xl', 'gt-sm']
    }),
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
