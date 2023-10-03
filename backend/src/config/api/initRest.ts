import { Database } from "sqlite3";
import { lastHostId } from './../../api/GET/last-host-id.js';
import { submitForm } from './../../api/POST/submit-form.js';
import { RegisterService } from './../../api/POST/register.js';
import { LoginService } from './../../api/POST/login.js';
import { GetUsersService } from './../../api/GET/users.js';
import { UpdateUserService } from './../../api/PUT/users.js';
import { GetUserRoleService } from './../../api/GET/user-role.js';
import { GetPatronsService } from './../../api/GET/patrons.js';
import { GetMenuService } from './../../api/GET/menu.js';
import { DeleteUserService } from "./../../api/DELETE/users.js";
import { PostMenuService } from "./../../api/POST/menu.js";
import { DeleteMenuService } from "./../../api/DELETE/menu.js";
import { BillsService, BillsItemService } from "./../../api/POST/bills.js";

export function initRest(db: Database[], app: any) {
    console.log('Initializing REST routes');
    //db[0] is the hosts database.
    //db[1] is the menu database.
    //db[2] is the userbase database.
    lastHostId(db[0], app);
    submitForm(db[0], app);

    GetMenuService(db[1], app);
    PostMenuService(db[1], app);
    DeleteMenuService(db[1], app);

    RegisterService(db[2], app);
    LoginService(db[2], app);
    GetUsersService(db[2], app);
    UpdateUserService(db[2], app);
    GetPatronsService(db[2], app);
    DeleteUserService(db[2], app);
    BillsService(db[2], app);
    BillsItemService(db[2], app);

    GetUserRoleService(app);
}

