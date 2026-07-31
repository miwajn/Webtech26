import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  headline: string;
  info: string;
}

@Component({
  selector: 'app-confirm-user',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './confirm-user.html',
  styleUrl: './confirm-user.css',
})
export class ConfirmUser {
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}