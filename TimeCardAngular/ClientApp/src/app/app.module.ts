import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import { LoginComponent } from './login/login.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { AuthGuard } from './guards/auth.guard';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { ErrorInterceptorService } from './services/error-interceptor.service';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminGuard } from './guards/admin.guard';
import { LookupComponent } from './lookup/lookup.component';
import { AccountComponent } from './account/account.component';
import { JobComponent } from './job/job.component';
import { PaymentComponent } from './payment/payment.component';
import { WorkComponent } from './work/work.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    LoginComponent,
    UserHomeComponent,
    AdminHomeComponent,
    LookupComponent,
    AccountComponent,
    JobComponent,
    PaymentComponent,
    WorkComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'login', component: LoginComponent },
      { path: 'lookup', component: LookupComponent, canActivate: [AdminGuard] },
      { path: 'account', component: AccountComponent, canActivate: [AdminGuard] },
      { path: 'job', component: JobComponent, canActivate: [AdminGuard] },
      { path: 'payment', component: PaymentComponent, canActivate: [AdminGuard] },
      { path: 'work', component: WorkComponent, canActivate: [AdminGuard] },
    ])
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent] 
})
export class AppModule { }
