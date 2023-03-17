import { Routes } from "@angular/router";
import { AuthGuard } from "./components/auths/guards/auth.guard";

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import("./components/auths/login/login.component").then(c => c.LoginComponent),
    },
    {
        path: "register",
        loadComponent: () => import("./components/auths/register/register.component").then(c => c.RegisterComponent),
    },
    {
        path: "",
        loadComponent: () => import("./components/layouts/layouts.component").then(c => c.LayoutsComponent),
        canActivateChild: [AuthGuard],
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