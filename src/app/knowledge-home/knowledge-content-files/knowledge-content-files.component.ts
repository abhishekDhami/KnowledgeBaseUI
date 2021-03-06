import { Component, OnInit } from '@angular/core';
import { KnowledgeHomeService } from '../knowledge-home.service';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-knowledge-content-files',
  templateUrl: './knowledge-content-files.component.html',
  styleUrls: ['./knowledge-content-files.component.css'],
})
export class KnowledgeContentFilesComponent implements OnInit {
  userFiles: any;
  filteredFiles: any;
  showWindowForAddFile = false;
  showWindowForCreateFile = false;
  selectedCategory: string = '';
  userMessage = '';

  constructor(
    private knowledgeService: KnowledgeHomeService,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    //Fetching Latest value of category from the URL's params
    this.activatedRoute.paramMap.subscribe((params) => {
      this.selectedCategory = <string>params.get('category');
      this.loadFiles();
    });
  }

  //Loading list of files
  loadFiles() {
    this.userMessage = '';
    this.spinner.show();
    this.knowledgeService
      .getFiles(<string>this.selectedCategory)
      .then((res: any) => {
        if (res.data === null) {
          this.backToContent();
        } else if (res.data && res.data.files.length !== 0) {
          this.userFiles = res.data.files;
          this.filteredFiles = this.userFiles;
        } else {
          this.userMessage = 'No Files Available';
        }
      })
      .catch((err) => {
        this.userMessage = this.knowledgeService.handleError(err);
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  //Handling Input to Search filter for files and updating filteredFiles accordingly
  onChangeSearchFile(fileName: string) {
    if (this.userFiles) {
      let pattern = new RegExp(fileName, 'i');
      this.filteredFiles = (<string[]>this.userFiles).filter(
        (file) => file.search(pattern) !== -1
      );
    }
  }

  //Handing click event on File, Download respective file to user's machine
  clickOnFile(file: any) {
    this.spinner.show();
    this.knowledgeService
      .getFile(file, this.selectedCategory)
      .then((blob) => {
        saveAs(blob, file);
      })
      .catch((err) => {
        this.userMessage = this.knowledgeService.handleError(err);
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  //Handle Back to Content button
  backToContent() {
    this.route.navigateByUrl('/knowledgehome/content');
  }

  //Handle Add File button event, it will pop up Upload-file component
  addFile() {
    this.showWindowForAddFile = true;
  }

  //Handle Canceling Add File event
  cancelAddFile() {
    this.showWindowForAddFile = false;
  }

  createFile() {
    this.showWindowForCreateFile = true;
  }

  cancelCreateFile() {
    this.showWindowForCreateFile = false;
  }
}
