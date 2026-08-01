import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { About } from './about/about';
import { Signup } from './signup/signup';
import { PageNotFound } from './page-not-found/page-not-found';
import { User } from './user/user';
import { Table } from './table/table';
import { TerminComponent } from './termin/termin';
import { UserProfil } from './user-profil/user-profil';

export const routes: Routes = [
    { path: "", component: Home },
    { path: "home", component: Home },
    { path: "login", component: Login },
    { path: "user", component: User },
    { path: "about", component: About },
    { path: "signup", component: Signup },
    { path: "table", component: Table },
    { path: "termin/:id", component: TerminComponent },
    { path: "userProfil", component: UserProfil },
    { path: "**", component: PageNotFound, pathMatch: 'full' },  // full: Route nur, wenn URL sonst nichts enthält
];