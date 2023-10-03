import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <div mat-dialog-content>
      {{ message }}
    </div>
    <div mat-dialog-actions>
      <button mat-button [mat-dialog-close]="true"> {{'yes' | translate }}</button>
      <button mat-button [mat-dialog-close]="false">{{'no' | translate }}</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) { }

  get title(): string {
    return this.data.title;
  }

  get message(): string {
    return this.data.message;
  }


}
