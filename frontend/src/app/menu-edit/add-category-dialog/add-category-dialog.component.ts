import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  styleUrls: ['./add-category-dialog.component.css']
})
export class AddCategoryDialogComponent implements OnInit {

  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddCategoryDialogComponent>
  ) { }

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCategory(): void {

    if (this.categoryForm.valid) {
      const category = this.categoryForm.get('category')?.value;
      this.dialogRef.close(category);
    }
  }
}
