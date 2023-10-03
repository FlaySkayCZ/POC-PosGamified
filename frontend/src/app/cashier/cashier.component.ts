import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeUserNameDialogComponent } from './changeUserNameDialog.component';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { interval, firstValueFrom } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UrlSegment } from '@angular/router';
import { BACKEND_URL } from '../constants';


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
interface TabItem {
  item: Item;
  quantity: number;
}
interface coloros {
  color: string;
  item: Item;
}
interface User {
  id: number;
  name: string;
  type: string;
  tab?: TabItem[];
}
interface Bill {
  user: User;
  subtotal: number;
  total: number;
  date: Date;
}

@Component({
  selector: 'app-cashier',
  templateUrl: './cashier.component.html',
  styleUrls: ['./cashier.component.css'],
})
export class CashierComponent implements OnInit {

  private getUsersUrl = `${BACKEND_URL}/api/patrons`;
  private getMenuUrl = `${BACKEND_URL}/api/menu`;
  private postBillsUrl = `${BACKEND_URL}/api/bills`;
  private postBillsItemsUrl = `${BACKEND_URL}/api/bill_items`;

  // Users that are currently displayed in the autocomplete
  filteredUsers: User[] = [];
  filteredItems: Item[] = [];
  userSearchControl = new FormControl();
  itemSearchControl = new FormControl();

  //Users that currently have an open tab
  users: User[] = [];
  //Users that are stored in the backend
  backendUsers: User[] = [];
  //Users that are stored in the Local Storage
  localTempUsers: User[] = [];
  //Users that are stored in the Local Storage
  localUsers: User[] = [];
  //User that is currently selected, i.e. the user that is paying the bill or adding items to the tab
  selectedUser: User | null = null;
  //Array of categories of items
  categories: Category[] = [];
  //Category that is currently selected
  selectedCategory: Category | undefined;
  //Array of all menu items
  items: Item[] = [];
  //Array of all bills
  bills: Bill[] = [];
  //Currency of the restaurant
  currency: string = 'Czk';
  //Page settings
  currentPage = 1;
  pageSize = 16;
  pageSizeOptions: number[] = [4, 8, 12, 16];
  categoryColors: string[] = [];
  colors: coloros[] = [];
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getLocalUsers();
    await this.getUsers();
    await this.getCategories();
    await this.sortUsers();
    await this.setColors();
  }
  async setColors() {
    let uniqueCategories = [...new Set(this.items.map(item => item.category))];
    uniqueCategories.forEach(category => {
      const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
      this.categoryColors.push(randomColor);
    });
    let categoryIndex = this.items.map(item => uniqueCategories.indexOf(item.category));
    for (let i = 0; i < this.items.length; i++) {
      this.colors.push({ color: this.categoryColors[categoryIndex[i]], item: this.items[i] });
    }

  }
  getColor(item: Item): string {
    const colorObj = this.colors.find(c => c.item === item);
    return colorObj ? colorObj.color : '';
  }
  // Function to fetch the users from the server
  async getUsers(): Promise<void> {
    try {
      const response = this.http.get<User[]>(this.getUsersUrl);
      const users = await firstValueFrom(response);
      if (!users) {
        throw new Error('Failed to fetch users');
      }
      this.backendUsers = users.map(user => ({ ...user, type: 'patron' }));
      const userIds = new Set(this.users.map(user => user.id));
      this.backendUsers = this.backendUsers.filter(backendUser => !userIds.has(backendUser.id));
    } catch (error) {
      this.snackBar.open('Error fetching items', 'Close', {
        duration: 3000,
      });
    }
  }
  // Function to fetch the menu items from the server
  async getCategories(): Promise<void> {
    try {
      const items = await firstValueFrom(this.http.get<Item[]>(this.getMenuUrl));
      this.items = items;

      this.categories = this.groupByCategory(items);
    } catch (error) {
      this.snackBar.open('Error fetching items', 'Close', {
        duration: 3000,
      });
    }
  }
  // Retrieve temporary users from Local Storage
  private getLocalUsers(): void {
    const usersJson = localStorage.getItem('users');
    const tempUsersJson = localStorage.getItem('tempUsers');
    const localUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const localTempUsers = JSON.parse(localStorage.getItem('tempUsers') || '{}');
    if (tempUsersJson) {
      this.localTempUsers = JSON.parse(tempUsersJson);
      this.users = this.users.concat(localTempUsers);
    }
    if (usersJson) {
      this.localUsers = JSON.parse(usersJson);
      this.users = this.users.concat(JSON.parse(usersJson));
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
  // Function to filter items by category and page
  filterByCategory(items: any[], category: string, pageNumber: number, pageSize: number): any[] {
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const fullRows = Math.floor((endIndex - 1) / 16) - Math.floor((startIndex - 1) / 16);
    const emptySlots = 16 - ((endIndex - 1) % 16 + 1);

    if (category === 'All') {
      const filteredItems = items.slice(startIndex, endIndex);
      if (filteredItems.length < pageSize) {
        for (let i = 0; i < emptySlots; i++) {
          filteredItems.push(null);
        }
      }
      return filteredItems;
    } else {
      const filteredItems = items.filter(item => item.category === category).slice(startIndex, endIndex);
      if (filteredItems.length < pageSize) {
        for (let i = 0; i < emptySlots; i++) {
          filteredItems.push(null);
        }
      }
      return filteredItems;
    }
  }

  // Function to select a user
  selectUser(user: User): void {
    this.selectedUser = user;
  }
  //function to sort users
  sortUsers() {
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
    this.users.sort((a, b) => collator.compare(a.name, b.name));
  }
  // Function to open the dialog to change the user's name
  openChangeUserNameDialog(user: User): void {
    const dialogRef = this.dialog.open(ChangeUserNameDialogComponent, {
      width: '250px',
      data: { name: user.name },
    });

    dialogRef.afterClosed().subscribe((newName: string) => {
      if (newName) {
        this.changeUserName(user, newName);
        this.sortUsers();
      }
    });
  }
  // Function to change the user's name
  changeUserName(user: User, newName: string): void {
    let userIndex = this.localTempUsers.findIndex((user) => user.id === this.selectedUser?.id);
    user.name = newName;
    this.localTempUsers.splice(userIndex, 1);
    this.localTempUsers.push(user);
    localStorage.setItem('tempUsers', JSON.stringify(this.localTempUsers));
  }
  // Function to Change the page size
  onPageSizeChanged(event: any) {
    this.pageSize = event.pageSize;
  }
  // Function to add a blank user which does not have account to the list of users
  addBlankUser(): void {
    const translatedText = this.translate.instant('cashier.blankUser');
    let counter = 1;
    let name = translatedText;
    const usedIds = this.localTempUsers.filter(user => user.id < 0).map(user => user.id);
    let newId = -1;
    while (usedIds.includes(newId)) {
      newId--;
    }
    while (this.users.find(user => user.name === name)) {
      name = `${translatedText} ${counter}`;
      counter++;
    }
    const newBlankUser: User = {
      id: newId,
      name: name,
      type: 'temp',
      tab: []
    };
    this.users.push(newBlankUser);
    this.localTempUsers.push(newBlankUser);
    this.saveTempUsersToLocalStorage();
    this.sortUsers();
    this.selectedUser = newBlankUser;
  }
  // Function to add a temporary user to local storage
  saveTempUsersToLocalStorage(): void {
    localStorage.setItem('tempUsers', JSON.stringify(this.localTempUsers));
  }
  saveUsersToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(this.localUsers));
  }
  // Function to search for a user by name
  searchUsers() {
    // Don't filter until user types at least 4 letters 
    if (!this.userSearchControl.getRawValue() || this.userSearchControl.getRawValue().length < 2) {
      this.filteredUsers = [];
      return;
    }
    this.filteredUsers = this.backendUsers.filter(user => user.name.toLowerCase().includes(this.userSearchControl.getRawValue().toLowerCase())).slice(0, 5);
  }
  searchMenuItems() {
    // Don't filter until user types at least 2 letters
    if (!this.itemSearchControl.getRawValue() || this.itemSearchControl.getRawValue().length < 2) {
      this.filteredItems = [];
      return;
    }
    this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(this.itemSearchControl.getRawValue().toLowerCase())).slice(0, 5);
  }
  addBackendUser(user: User): void {
    this.users.push(user);
    this.localUsers.push(user);
    this.backendUsers = this.backendUsers.filter(u => u.id !== user.id);
    this.userSearchControl.setValue('');
    this.filteredUsers = [];
    this.saveUsersToLocalStorage();
    this.sortUsers();
    this.selectUser(user);
  }

  //Function to display the user's name in the search bar
  displayUser(user: User): string {
    return user ? user.name : '';
  }
  displayItem(item: Item): string {
    return item ? item.name : '';
  }
  //Function to select a user from the search bar
  onUserSelected(event: MatAutocompleteSelectedEvent) {
    const user = event.option.value as User;
    this.selectUser(user);
    // Reset search input
    this.userSearchControl.setValue('');
  }

  // Function to open the dialog to add a new user
  async searchForUser(userId: number): Promise<User | null> {
    try {
      const user = this.users.find((u) => u.id === userId);
      if (!user) throw new Error(`User ${userId} not found`);
      return user;
    } catch (error) {
      return null;
    }
  }

  // Function to add an item to the selected user's tab
  addItemToTab(item: Item): void {
    if (this.selectedUser) {
      if (!this.selectedUser.tab) {
        this.selectedUser.tab = [];
      }
      let tabItem = this.selectedUser.tab.find(ti => ti.item.id === item.id);
      if (tabItem) {
        tabItem.quantity++;
      } else {
        tabItem = { item, quantity: 1 };
        this.selectedUser.tab.push(tabItem);
      }
      if (this.selectedUser.type === "patron") {
        const index = this.localUsers.findIndex(user => user.id === this.selectedUser?.id); //? used for null check even tho it cant be null here because of the if statement above it 
        if (index !== -1) {
          this.localUsers[index] = this.selectedUser;
          localStorage.setItem('users', JSON.stringify(this.localUsers));
        }
      } else if (this.selectedUser.type === "temp") {
        const index = this.localTempUsers.findIndex(user => user.id === this.selectedUser?.id); //? used for null check even tho it cant be null here because of the if statement above it 
        if (index !== -1) {
          this.localTempUsers[index] = this.selectedUser;
          localStorage.setItem('tempUsers', JSON.stringify(this.localTempUsers));
        }
      }
      this.itemSearchControl.setValue('');

    }
  }

  // Function to remove an item from the selected user's tab
  removeItemFromTab(item: Item): void {
    if (this.selectedUser && this.selectedUser.tab) {
      let tabItem = this.selectedUser.tab.find(ti => ti.item.id === item.id);
      if (tabItem) {
        if (tabItem.quantity > 1) {
          tabItem.quantity--;
        } else {
          this.selectedUser.tab = this.selectedUser.tab.filter(ti => ti.item.id !== item.id);
        }

        // Find the index of the selected user in the array of local users or local temp users
        let index;
        if (this.selectedUser.type === "patron") {
          index = this.localUsers.findIndex(user => user.id === this.selectedUser?.id);
          this.localUsers[index] = this.selectedUser;
          localStorage.setItem('users', JSON.stringify(this.localUsers));
        } else if (this.selectedUser.type === "temp") {
          index = this.localTempUsers.findIndex(user => user.id === this.selectedUser?.id);
          this.localTempUsers[index] = this.selectedUser;
          localStorage.setItem('tempUsers', JSON.stringify(this.localTempUsers));
        }

      }
    }
  }
  // Function to calculate the subtotal for the selected user's tab
  calculateSubtotal(): number {
    let subtotal: number = 0;
    if (this.selectedUser && this.selectedUser.tab) {
      this.selectedUser.tab.forEach((tabItem) => {
        subtotal += tabItem.item.price * tabItem.quantity;
      });
    }
    return parseFloat(subtotal.toPrecision(4));
  }
  // Function to issue a bill for the selected user
  issueBill() {
    //code to call popup which will show the bill, and depending on if user is temporary will just save the sale or call backend to save the sale and user
    if (!this.selectedUser) {
      throw new Error('No user selected');
    }
    //check if user is temporary
    if (this.selectedUser.type === 'temp') {
      this.removeTempUser(this.selectedUser);
      this.sortUsers();
    } else if (this.selectedUser.type === 'patron') {
      this.removeUser(this.selectedUser);
      this.sortUsers();

    }
    //Subtotal will be calcualted depending on discount aquired by user from expirience points
    const subtotal = this.calculateSubtotal();
    const total = subtotal; // For future use when we add sales, tax is included in price of item

    const newBill = {
      user_id: this.selectedUser.id, //ID of user who is being billed
      subtotal, //Subtotal of bill
      total, //Total of bill
      date: new Date(), //Date of bill
    };
    let billItems = this.selectedUser.tab!.map((tabItem) => { //Map the tab items to bill items
      return {
        bill_id: -1, //Will be added later
        name: tabItem.item.name,
        quantity: tabItem.quantity,
        price: tabItem.item.price,
      };
    });

    this.http.post(this.postBillsUrl, newBill).subscribe((res: any) => {
      const billId = res;
      billItems.forEach((billItem) => { //Add bill id to each bill item
        billItem.bill_id = billId;
      });
      this.http.post(this.postBillsItemsUrl, billItems).subscribe((res: any) => {
        const billItems_id = res.id;
      });
    });

    this.users = [];
    this.users = this.users.concat(this.localTempUsers);
    this.users = this.users.concat(this.localUsers);
    this.sortUsers();
    this.selectedUser = null;
  }
  // Function to remove a temporary user
  removeTempUser(user: User): void {
    let index = -1;
    for (let i = 0; i < this.localTempUsers.length; i++) {
      if (this.localTempUsers[i].id === user.id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.localTempUsers.splice(index, 1);
      // Store temporary users in Local Storage
      localStorage.setItem('tempUsers', JSON.stringify(this.localTempUsers));
    }
  }
  removeUser(user: User): void {
    let index = -1;
    for (let i = 0; i < this.localUsers.length; i++) {
      if (this.localUsers[i].id === user.id) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.localUsers.splice(index, 1);
      // Store temporary users in Local Storage
      localStorage.setItem('users', JSON.stringify(this.localUsers));
    }

  }

}


//Graveyard of code that may be useful later on but is not currently being used in the project
  // Function to add an item to the selected user's tab
  // addItem(item: Item): void {
  //   // Add the item to the selected user's tab for the evening.
  //   if (this.selectedUser) {
  //     const tabItem: TabItem = {
  //       item: item,
  //       quantity: 1
  //     };
  //     if (!this.selectedUser.tab) {
  //       this.selectedUser.tab = [];
  //     }
  //     const existingTabItem = this.selectedUser.tab.find(ti => ti.item.id === item.id);
  //     if (existingTabItem) {
  //       existingTabItem.quantity++;
  //     } else {
  //       this.selectedUser.tab.push(tabItem);
  //     }
  //   }
  // }
  // // Function to remove an item from the selected user's tab
  // removeItem(item: Item): void {
  //   // Remove the item from the selected user's tab for the evening.
  //   if (this.selectedUser && this.selectedUser.tab) {
  //     const existingTabItemIndex = this.selectedUser.tab.findIndex(ti => ti.item.id === item.id);
  //     if (existingTabItemIndex !== -1) {
  //       const existingTabItem = this.selectedUser.tab[existingTabItemIndex];
  //       if (existingTabItem.quantity > 1) {
  //         existingTabItem.quantity--;
  //       } else {
  //         this.selectedUser.tab.splice(existingTabItemIndex, 1);
  //       }
  //     }
  //   }
  // }