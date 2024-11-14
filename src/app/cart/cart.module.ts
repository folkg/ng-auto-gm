import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CartComponent } from './cart.component';
import { CartRoutingModule } from './cart-routing.module';

@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, CartRoutingModule],
})
//TODO: Implement cart and payment
export class CartModule {}
