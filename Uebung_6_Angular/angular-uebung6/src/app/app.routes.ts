import { Routes } from '@angular/router';
import { Table } from '../table/table';
import { Home } from '../home/home';
import { Form } from '../form/form';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'read', component: Table },
    { path: 'create', component: Form },
];
