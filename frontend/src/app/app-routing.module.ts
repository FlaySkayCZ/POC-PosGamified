import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/services/auth.guard';

// Components go here (see below)
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ToolbarComponent } from './shared/toolbar/toolbar.component';
import { LandingComponent } from './landing/landing.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserEditModule } from './user-edit/user-edit.module';
import { MenuEditModule } from './menu-edit/menu-edit.module';
import { CashierComponent } from './cashier/cashier.component';
import { PatronComponent } from './patron/patron.component';

const routes: Routes = [
  // Using app- for programmatical routing
  // Using wihtout app- for browser routing
  { path: '', component: LandingComponent },
  { path: 'app-root', component: AppComponent },
  { path: 'app-hotelForm', component: FormComponent },
  { path: 'app-toolbar', component: ToolbarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'patron', component: PatronComponent, canActivate: [AuthGuard], data: { expectedRole: 'patron' || 'cashier' || 'admin' } },
  { path: 'cashier', component: CashierComponent, canActivate: [AuthGuard], data: { expectedRole: 'cashier' || 'admin' } },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'user-edit', component: UserEditModule, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
  { path: 'menu-edit', component: MenuEditModule, canActivate: [AuthGuard], data: { expectedRole: 'admin' } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }