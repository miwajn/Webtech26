import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface DeleteTableData {
  headline: string;
  info: string;
}

@Component({
  selector: 'app-delete-table',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-table.html',
  styleUrl: './delete-table.css',
})
export class DeleteTable {
  data = inject<DeleteTableData>(MAT_DIALOG_DATA);
}