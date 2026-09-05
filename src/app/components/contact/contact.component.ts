import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  imports: [CommonModule]
})
export class ContactComponent {
  email = 'lokhandwalamohammed100@gmail.com';
  github = 'https://github.com/Mohking1';
  linkedin = 'https://www.linkedin.com/in/mohammed37/';
}

