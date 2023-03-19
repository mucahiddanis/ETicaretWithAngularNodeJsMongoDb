import { inject } from "@angular/core";
import { Routes } from "@angular/router";
import { AuthService } from "./components/auths/services/auth.service";

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./components/auths/login/login.component").then(c => c.LoginComponent),
    },
    {
        path: "confirmMail/:value",
        loadComponent: () => import("./components/auths/confirm-mail/confirm-mail.component").then(c => c.ConfirmMailComponent),
    },
    {
        path: "forgot-password/:value",
        loadComponent: () => import("./components/auths/forgot-password/forgot-password.component").then(c => c.ForgotPasswordComponent)
    },
    {
        path: "forgot-password/:value/:code",
        loadComponent: () => import("./components/auths/forgot-password/forgot-password.component").then(c => c.ForgotPasswordComponent)
    },
    {
        path: "register",
        loadComponent: () => import("./components/auths/register/register.component").then(c => c.RegisterComponent),
    },
    {
        path: "",
        loadComponent: () => import("./components/layouts/layouts.component").then(c => c.LayoutsComponent),
        canActivateChild: [() => inject(AuthService).isLogged()],
        children: [
            {
                path: "",
                loadComponent: () => import("./components/home/home.component").then(c => c.HomeComponent),
            },
            {
                path: "**",
                loadComponent: () => import("./components/not-found/not-found.component").then(c => c.NotFoundComponent),
            }
        ]
    }
]