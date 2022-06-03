import { Component, OnInit } from '@angular/core';
import { errorHelpers } from 'src/app/helpers/helpers';
import { CategoryModel } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-navbar-public',
  templateUrl: './navbar-public.component.html',
  styleUrls: ['./navbar-public.component.css']
})
export class NavbarPublicComponent implements OnInit {
  
  public showCategories: boolean = false;

  public categories: CategoryModel[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories()
      .subscribe({
        error: (err:any) => {
          errorHelpers(err);
        },
        next: (resp:any) => {
          this.categories = resp;
        }
      });
  }

}
