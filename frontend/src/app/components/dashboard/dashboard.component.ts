import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',

})
export class DashboardComponent {

  manage = 'images/manage.jpeg';
  product = 'images/product.jpg';
  salary = 'images/salary.jpg';

}
