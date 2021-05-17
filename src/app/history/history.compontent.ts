import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {
  id: any;

  constructor(private router: Router,
              private activateRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params) => {
      this.id = params.id;
    });
  }

  goTo(): void {
    this.router.navigate(['map']);
  }
}
