import { Component } from '@angular/core';
import { SharedModule } from 'src/app/components/commons/modules/shared.module';
import { NavbarComponent } from './navbar/navbar.component';

@Component({
  selector: 'app-layouts',
  standalone: true,
  imports: [SharedModule, NavbarComponent],
  templateUrl: './layouts.component.html',
  styleUrls: ['./layouts.component.css']
})
export class LayoutsComponent {

}
