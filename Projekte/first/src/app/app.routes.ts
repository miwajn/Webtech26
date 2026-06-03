import { Routes } from '@angular/router';
import { Eins } from './main/eins/eins';
import { Zwei } from './main/zwei/zwei';

export const routes: Routes = [
    { path: 'eins', component: Eins },
    { path: 'zwei', component: Zwei },
];
