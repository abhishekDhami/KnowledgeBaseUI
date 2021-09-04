import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KnowledgeHomeService } from '../knowledge-home.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-createfile',
  templateUrl: './createfile.component.html',
  styleUrls: ['./createfile.component.css'],
})
export class CreatefileComponent implements OnInit {
  userMessagePopupWindow = '';
  @Input() selectedCategory: string = '';
  @Output() refreshFiles = new EventEmitter<string>();
  @Output() popOutCreateFile = new EventEmitter<boolean>();
  constructor(
    private knowledgeService: KnowledgeHomeService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  //when user cancel to add File
  cancelCreateFilebutton() {
    this.popOutCreateFile.emit(true);
  }

  //Handling Upload button event
  createFile(fileName: string, fileText: string) {
    this.userMessagePopupWindow = '';
    if (this.validatingUserFileInput(fileName, fileText)) {
      this.spinner.show();
      this.knowledgeService
        .createFile(fileName, fileText, this.selectedCategory)
        .subscribe(
          (data) => {
            //On Successful upload refresh list of the files
            this.refreshFiles.emit('refresh');
            this.popOutCreateFile.emit(true);
          },
          (err) => {
            this.userMessagePopupWindow =
              this.knowledgeService.handleError(err);
          },
          () => {
            this.spinner.hide();
          }
        );
    }
  }

  //Validating User's Input file, Limiting File to 2MB in size
  validatingUserFileInput(fileName: string, fileText: string) {
    console.log(fileName, fileText);
    if (
      fileName.search(
        new RegExp(
          '^[a-zA-Z0-9](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\\.[a-zA-Z0-9_-]+$'
        )
      ) === -1
    ) {
      this.userMessagePopupWindow = 'Please Provide Proper file name ';
      return false;
    } else if (fileText.length > 1200) {
      this.userMessagePopupWindow = 'Provide file name withine 1200 letters.';
      return false;
    }

    return true;
  }
}
