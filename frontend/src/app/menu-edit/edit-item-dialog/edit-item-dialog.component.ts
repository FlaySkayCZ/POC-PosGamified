import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { BACKEND_URL } from '../../constants';
import { TranslateService } from '@ngx-translate/core';
interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}
interface Category {
  name: string;
  items: Item[];
}
@Component({
  selector: 'app-edit-item-dialog',
  templateUrl: './edit-item-dialog.component.html',
  styleUrls: ['./edit-item-dialog.component.css']
})
export class EditItemDialogComponent implements OnInit {
  @Output() itemSaved = new EventEmitter<void>();
  selectedMenuItem: Item | undefined;
  menuItemForm: FormGroup;
  categories: Category[] = [];
  isSaving = false;
  constructor(
    public dialogRef: MatDialogRef<EditItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public translate: TranslateService,
  ) {
    this.selectedMenuItem = data.selectedMenuItem;
    this.menuItemForm = data.menuItemForm;
    this.categories = data.categories;
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveItem(): void {
    if (this.menuItemForm.valid && !this.isSaving) {
      const item = {
        id: this.selectedMenuItem?.id ?? -1, // If ID is -1, the backend will create a new item.
        name: this.menuItemForm.get('name')?.value,
        description: this.menuItemForm.get('description')?.value,
        price: this.menuItemForm.get('price')?.value,
        category: this.menuItemForm.get('category')?.value,
      };
      this.isSaving = true;
      this.http.post(`${BACKEND_URL}/api/menu`, item).subscribe(
        () => {
          this.snackBar.open('Item saved successfully!', 'Close', { duration: 3000 });
          this.dialogRef.close(item);
          this.itemSaved.emit();
        },
        (error) => {
          console.log(error);

          this.snackBar.open('Error saving item.', 'Close', { duration: 3000 });
        },
        () => {
          this.isSaving = false;
        }
      );
    }
  }
}
