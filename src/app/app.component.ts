import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TimetableComponent } from './timetable/timetable.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TimetableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my-angular-app';
}
