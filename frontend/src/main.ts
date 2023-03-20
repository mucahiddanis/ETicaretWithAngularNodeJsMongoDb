import { importProvidersFrom } from "@angular/core";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideHttpClient } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { routes } from "./app/router";
import { StoreModule } from "@ngrx/store";
import { loadingReducer } from "./app/components/commons/components/loading-button/states/loading-reducer";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SweetAlert2Module } from "@sweetalert2/ngx-sweetalert2";
import { SocialLoginModule } from "@abacritt/angularx-social-login";
import { GoogleLoginProvider, } from '@abacritt/angularx-social-login';
import { FacebookLoginProvider, GoogleSigninButtonModule, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(
      BrowserModule,
      BrowserAnimationsModule,
      SocialLoginModule,
      ToastrModule.forRoot({
        closeButton: true,
        progressBar: true,
        timeOut: 5000,
        preventDuplicates: true
      }),
      SweetAlert2Module.forRoot(),
      RouterModule.forRoot(routes),
      StoreModule.forRoot({ isLoading: loadingReducer })
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '464800227266-dsnf9mt2b0nv3nrrh3n2otjec95e657a.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err:any) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ]
})

// 464800227266-dsnf9mt2b0nv3nrrh3n2otjec95e657a.apps.googleusercontent.com
