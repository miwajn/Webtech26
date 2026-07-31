import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDeleteData {
  headline: string;
  info: string;
}

@Component({
  selector: 'app-confirm-delete',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './delete-table.html',
  styleUrl: './delete-table.css',
})
export class DeleteTable {
  data = inject<ConfirmDeleteData>(MAT_DIALOG_DATA);
}