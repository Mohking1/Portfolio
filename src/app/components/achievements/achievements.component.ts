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
      description: 'Cleared GATE (Graduate Aptitude Test in Engineering) examination in both 3rd and 4th year of B.Tech Computer Science.',
      tag: 'Competitive Exam'
    },
    {
      title: 'Open Source Contribution',
      highlight: 'Merged Upstream PR',
      description: 'Authored and merged upstream contribution to LNReader fixing an automated web-scraping parser after an external site architecture update.',
      tag: 'Open Source'
    },
    {
      title: 'College Hackathon',
      highlight: '2nd Place',
      description: 'Secured 2nd place in a college hackathon designing rapid AI-driven solutions.',
      tag: 'Hackathon'
    },
    {
      title: 'Google Developer Student Club',
      highlight: 'Core Team (2 Years)',
      description: 'Active core contributor for roughly two years; organized 5+ technical workshops and developer events.',
      tag: 'Leadership & Community'
    },
    {
      title: 'SSIP Innovation Project',
      highlight: 'Project Innovation Award',
      description: 'Selected under Student Startup & Innovation Policy (SSIP) to engineer an autonomous AI & robotics project.',
      tag: 'Innovation Initiative'
    }
  ];
}
