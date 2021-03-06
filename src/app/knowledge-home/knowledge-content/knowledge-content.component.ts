import { Component, OnInit } from '@angular/core';
import { KnowledgeHomeService } from '../knowledge-home.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-knowledge-content',
  templateUrl: './knowledge-content.component.html',
  styleUrls: ['./knowledge-content.component.css'],
})
export class KnowledgeContentComponent implements OnInit {
  userCategories: any;
  filteredCategories: any;
  showWindowForAddCategory = false;
  userMessage = '';
  userMessagePopupWindow = '';

  constructor(
    private knowledgeService: KnowledgeHomeService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  //Fetch available Categories from database for current user
  loadCategories() {
    this.spinner.show();
    this.userMessage = '';
    this.knowledgeService
      .getCategories()
      .then((res: any) => {
        if (res.data) {
          this.userCategories = res.data;
          this.filteredCategories = this.userCategories;
        } else {
          this.userMessage = 'No Data Available';
        }
      })
      .catch((err) => {
        this.userMessage = this.knowledgeService.handleError(err);
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  //Handling on Category Click event
  clickOnCategory(category: any) {
    this.route.navigateByUrl(`/knowledgehome/files/${category}`);
  }

  //Handling Input to Search filter for categories and updating filtered categories accordingly
  onChangeSearchCategory(categoryname: string) {
    if (this.userCategories) {
      let pattern = new RegExp(categoryname, 'i');
      this.filteredCategories = (<string[]>this.userCategories).filter(
        (category) => category.search(pattern) !== -1
      );
    }
  }

  //Handle Add Category button,It will promt pop for user input
  addCategory() {
    this.userMessagePopupWindow = '';
    this.showWindowForAddCategory = true;
  }

  //Handle Save Category button
  saveCategory(newcategory: string) {
    this.userMessagePopupWindow = '';
    this.spinner.show();
    if (newcategory.search(new RegExp('^[a-z\\d\\s]{1,20}$', 'i'))) {
      this.userMessagePopupWindow =
        'Please Enter Value without any Symbol with length of 1 to 20 characters';
      this.spinner.hide();
    } else {
      this.knowledgeService
        .addCategory(newcategory)
        .then((data: any) => {
          this.loadCategories();
          this.showWindowForAddCategory = false;
        })
        .catch((err: any) => {
          this.userMessagePopupWindow = this.knowledgeService.handleError(err);
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  //To handle Cancel Add Category button click event
  cancelAddCategory() {
    this.showWindowForAddCategory = false;
  }
}
