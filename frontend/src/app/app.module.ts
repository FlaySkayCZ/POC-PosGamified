// Angular core modules
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

// Third-party modules
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Custom modules
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { FormModule } from './form/form.module';
import { CashierModule } from './cashier/cashier.module';
import { LoginModule } from './login/login.module';
import { ToolbarModule } from './shared/toolbar/toolbar.module';
import { ConfirmDialogComponent } from './shared/confirmDelete/confirm-dialog.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { RegisterModule } from './register/register.module';
import { UserEditModule } from './user-edit/user-edit.module';
import { MenuEditModule } from './menu-edit/menu-edit.module';
import { PatronModule } from './patron/patron.module';


// Components
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { LandingComponent } from './landing/landing.component';

// Services
import { TokenInterceptor } from './shared/services/token.interceptor';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ConfirmDialogComponent,

  ],
  imports: [
    AdminModule,
    AppRoutingModule,
    BrowserModule,
    CashierModule,
    DashboardModule,
    FormModule,
    FormsModule,
    HttpClientModule,
    LoginModule,
    RegisterModule,
    MaterialModule,
    ToolbarModule,
    UserEditModule,
    MenuEditModule,
    PatronModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },

    })
  ],
  providers: [TranslateService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent],
  exports: [TranslateModule],

})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
