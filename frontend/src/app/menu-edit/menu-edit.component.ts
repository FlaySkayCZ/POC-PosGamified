import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './../shared/services/auth.service';
import { firstValueFrom } from 'rxjs';

import { AddCategoryDialogComponent } from './add-category-dialog/add-category-dialog.component';
import { EditItemDialogComponent } from './edit-item-dialog/edit-item-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirmDelete/confirm-dialog.component';
import { BACKEND_URL } from '../constants';

interface Category {
  name: string;
  items: Item[];
}
interface Item {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
}
@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css']
})
export class MenuEditComponent implements OnInit {
  private getMenuUrl = `${BACKEND_URL}/api/menu`;
  private postMenuUrl = `${BACKEND_URL}/api/menu`;
  items: Item[] = [];

  categories: Category[] = [];

  displayedColumns: string[] = ['name', 'description', 'price', 'category', 'actions'];
  dataSource: any[] = [{ col1: null, col2: null }];

  selectedMenuItem: Item | undefined;

  menuItemForm: FormGroup = new FormGroup({});

  addCategoryDialogRef: MatDialogRef<AddCategoryDialogComponent> | undefined;

  editItemDialogRef: MatDialogRef<EditItemDialogComponent> | undefined;

  dialogRef!: MatDialogRef<AddCategoryDialogComponent>;


  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }
  ngOnInit() {
    this.getMenuItems();
    this.menuItemForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required]
    });
  }
  cancelEdit() {
    this.selectedMenuItem = undefined;
      this.menuItemForm.reset();
  }
  deleteMenuItemPrompt(item: Item) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title: this.translate.instant('menu.actions.delete') + '?', message: this.translate.instant('menu.confirmation') + item.name },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteItem(item.id);
      }
    });
  }
  deleteItem(id: number) {
    this.http.delete(`${BACKEND_URL}/api/menu/${id}`, {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${this.authService.getToken()}`
      })
    }).subscribe(response => {
      console.log(response);
    });
  }
  openAddCategoryDialog() {
    this.addCategoryDialogRef = this.dialog.open(AddCategoryDialogComponent, {
      width: '400px',
      disableClose: true
    });
    this.addCategoryDialogRef.afterClosed().subscribe((category: string) => {
      if (category) {
        const newCategory: Category = { name: category, items: [] };
        this.categories.push(newCategory);
        this.menuItemForm.get('category')?.setValue(category);
      }
    });
  }
  openItemDialog(item: Item | null) {
    if (item === null) {
      this.selectedMenuItem = undefined;
      this.menuItemForm.patchValue({
        name: undefined,
        price: undefined,
        description: undefined,
        category: undefined,
      });
    } else {
      this.selectedMenuItem = item;
      this.menuItemForm.patchValue({
        name: item.name,
        price: item.price,
        description: item.description,
        category: item.category,
      });
    }

    this.editItemDialogRef = this.dialog.open(EditItemDialogComponent, {
      width: '400px',
      disableClose: true,
      data: {
        selectedMenuItem: this.selectedMenuItem,
        menuItemForm: this.menuItemForm,
        categories: this.categories
      }
    });
    this.editItemDialogRef.afterClosed().subscribe((editedItem: Item) => {
      if (editedItem) {
        this.items = this.items.map(item => {
          if (item.id === editedItem.id) {
            return editedItem;
          } else if (editedItem.id === -1) {
            editedItem.id = this.items.length + 1;
            return editedItem;
          }

          return item;
        });
      }
    });
  }


  // Function to fetch menu items from backend
  async getMenuItems(): Promise<void> {
    try {
      const items = await firstValueFrom(this.http.get<Item[]>(this.getMenuUrl));
      this.items = items;
      this.categories = this.groupByCategory(this.items);
    } catch (error) {
      this.snackBar.open('Error fetching items', 'Close', {
        duration: 3000,
      });
    }
  }
  // Function to group items by category
  groupByCategory(items: Item[]): Category[] {
    const groupedItems = new Map<string, Item[]>();
    for (const item of items) {
      const category = item.category;
      const categoryItems = groupedItems.get(category) ?? [];
      categoryItems.push(item);
      groupedItems.set(category, categoryItems);
    }
    return Array.from(groupedItems, ([name, items]) => ({ name, items }));
  }
}
