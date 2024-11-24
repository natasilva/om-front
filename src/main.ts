import { bootstrapApplication } from '@angular/platform-browser';
import { OrderComponent } from './app/order/order.component';
import { appConfig } from './app/app.config';

bootstrapApplication(OrderComponent, appConfig)
  .catch((err) => console.error(err));
