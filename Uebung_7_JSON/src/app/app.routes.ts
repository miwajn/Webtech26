import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Form } from './form/form';
import { Table } from './table/table';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'create', component: Form },
  { path: 'read', component: Table }
];
