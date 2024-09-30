import { Food } from "./Food";

export class CartItem{
    quantity: number;
    price: number;
    constructor(public food:Food) {
        this.quantity = 1;
        this.price = this.food.price;
    }
}