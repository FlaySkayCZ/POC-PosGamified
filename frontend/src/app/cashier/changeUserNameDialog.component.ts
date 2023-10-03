import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  name: string;
}

@Component({
  selector: 'app-change-user-name-dialog',
  templateUrl: './changeUserNameDialog.component.html',
})
export class ChangeUserNameDialogComponent {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<ChangeUserNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.name = data.name;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
