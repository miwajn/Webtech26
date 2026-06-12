import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { About } from './about/about';
import { Signup } from './signup/signup';
import { PageNotFound } from './page-not-found/page-not-found';

export const routes: Routes = [
{ path: "", component: Home, pathMatch: 'full' }, // full: Route nur, wenn URL sonst nichts enthält
{ path: "login", component: Login },
{ path: "about", component: About },
{ path: "signup", component: Signup },
{ path: "**", component: PageNotFound},  //Falls ungültige URL/ pageNotFound
];