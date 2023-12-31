import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ROLE } from 'src/app/shared/constants/role.constant';
import { IProductResponse } from 'src/app/shared/interfaces/product/product.interface';
import { OrderService } from 'src/app/shared/order/order.service';
import { AccountService } from 'src/app/shared/services/account/account.service';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { BasketDialogComponent } from '../basket-dialog/basket-dialog.component';
import { PhoneDialogComponent } from '../phone-dialog/phone-dialog.component';
import { SharedModule} from '../../shared/shared.module';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public total = 0;
  private basket: Array<IProductResponse> = [];
  public isLogin = false;
  public loginUrl = '';
  public loginPage = '';


  constructor(
    private orderService: OrderService,
    private accountService: AccountService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadBasket();
    this.updateBasket();
    this.checkUserLogin();
    this.checkUpdateUserLogin();
  }

  loadBasket(): void {
    if (localStorage.length > 0 && localStorage.getItem('basket')) {
      this.basket = JSON.parse(localStorage.getItem('basket') as string);
    }
    this.getTotalPrice();
  }

  getTotalPrice(): void {
    this.total = this.basket
      .reduce((total: number, prod: IProductResponse) => total + prod.count * prod.price, 0);
  }

  updateBasket(): void {
    this.orderService.changeBasket.subscribe(() => {
      this.loadBasket();
    })
  }

  checkUserLogin(): void {
    const currentUser = JSON.parse(
      localStorage.getItem('currentUser') as string
    );
    if (currentUser && currentUser.role === ROLE.ADMIN) {
      this.isLogin = true;
      this.loginUrl = 'admin';
      this.loginPage = 'Admin';
    } else if (currentUser && currentUser.role === ROLE.USER) {
      this.isLogin = true;
      this.loginUrl = 'cabinet';
      this.loginPage = 'Cabinet';
    } else {
      this.isLogin = false;
      this.loginUrl = '';
      this.loginPage = '';
    }
  }

  checkUpdateUserLogin(): void {
    this.accountService.isUserLogin$.subscribe(() => {
      this.checkUserLogin();
    });
  }

  openLoginDialog(): void {
    this.dialog.open(AuthDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'auth-dialog',
      autoFocus: false
    })
  }

  openBasketDialog(): void {
    this.dialog.open(BasketDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'basket-dialog',
      autoFocus: false
    })
  }

  openPhoneDialog(): void {
    this.dialog.open(PhoneDialogComponent, {
      backdropClass: 'dialog-back',
      panelClass: 'phone-dialog',
      autoFocus: false
    })
  }
}
