import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/CartItem';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = new Cart();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject(this.cart);

  constructor(private userService: UserService) {
    this.initializeCart();
    
    this.userService.userObservable.subscribe(user => {
      if (user.token) {
        const cartJson = localStorage.getItem(`Cart_${user.id}`);
        if (cartJson) {
          this.cart = JSON.parse(cartJson);
          this.cartSubject.next(this.cart);
        }
      }
    });
  }

  initializeCart() {
    const user = this.userService.currentUser;
    if (user.id) {
      const cartJson = localStorage.getItem(`Cart_${user.id}`);
      if (cartJson) {
        this.cart = JSON.parse(cartJson);
        this.cartSubject.next(this.cart);
      }
    }
  }

  addToCart(food: Food): void {
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if (cartItem) {
      cartItem.quantity++;
    } else {
      this.cart.items.push(new CartItem(food));
    }
    this.saveCartToLocalStorage();
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items.filter(item => item.food.id != foodId);
    this.saveCartToLocalStorage();
  }
  
  changeQuantity(foodId: string, quantity: number) {
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if (!cartItem)
      return;

    cartItem.quantity = quantity;
    cartItem.price = quantity * cartItem.food.price;
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cart = new Cart();
    this.saveCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private saveCartToLocalStorage() {
    const user = this.userService.currentUser;
    if (user.id) {
      this.cart.totalPrice = this.cart.items.reduce((sum, item) => sum + item.price, 0);
      this.cart.totalCount = this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem(`Cart_${user.id}`, JSON.stringify(this.cart));
      this.cartSubject.next(this.cart);
    }
  }
}
