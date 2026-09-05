import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html'
})
export class AchievementsComponent {
  achievements = [
    {
      title: 'GATE Qualification',
      highlight: 'Qualified 2x',
      description: 'Cleared GATE Examination in both 3rd and 4th year of B.Tech Computer Science.',
      tag: 'Competitive Exam'
    },
    {
      title: 'SSIP Innovation Award',
      highlight: '₹30,000 Grant',
      description: 'Received a ₹30,000 grant award from Student Startup & Innovation Policy (SSIP) to support an AI & robotics innovation project.',
      tag: 'Government Grant'
    },
    {
      title: 'College Hackathon',
      highlight: '2nd Place',
      description: 'Secured 2nd place in a college hackathon designing rapid AI-driven solutions.',
      tag: 'Hackathon'
    },
    {
      title: 'Open Source Contribution',
      highlight: 'Merged PR',
      description: 'Authored and merged upstream contribution to LNReader fixing an automated web-scraping parser after an external site architecture update.',
      tag: 'Open Source'
    },
    {
      title: 'Google Developer Student Club',
      highlight: 'Core Team (2 Years)',
      description: 'Active core contributor for roughly two years; organized 5+ technical workshops and developer events.',
      tag: 'Leadership & Community'
    }
  ];
}
