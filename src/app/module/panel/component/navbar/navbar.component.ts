import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth/auth.service';
import { ReplaySubject } from 'rxjs';
import { User } from 'src/app/service/auth/entity/user';

interface MenuItem {
  label: string;
  routerLink: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  user: ReplaySubject<User>;
  title = 'panel';
  menuItems: MenuItem[] = [
    {label: 'dealers', routerLink: '/panel/dealers'},
    {label: 'faults', routerLink: '/panel/faults'},
    {label: 'faultRecords', routerLink: '/panel/fault-records'},
    {label: 'fieldTeams', routerLink: '/panel/field-teams'},
  ];

  constructor(private readonly authService: AuthService) {
  }

  ngOnInit() {
    this.user = this.authService.user;
  }
}
