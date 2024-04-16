import { Component, OnInit } from '@angular/core';
import { users } from '../dataBase/user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // console.log(users);    
  }

}
