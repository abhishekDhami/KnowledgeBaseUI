import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { KnowledgeHomeService } from '../knowledge-home.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-uploadfile',
  templateUrl: './uploadfile.component.html',
  styleUrls: ['./uploadfile.component.css'],
})
export class UploadfileComponent implements OnInit {
  userMessagePopupWindow = '';
  isfileSelected = false;
  selectedFile?: File;
  @Input() selectedCategory: string = '';
  @Output() refreshFiles = new EventEmitter<string>();
  @Output() popOutAddFiles = new EventEmitter<boolean>();
  constructor(
    private knowledgeService: KnowledgeHomeService,
    private route: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  //Handling event when user select file
  onFileSelected(event: any) {
    this.userMessagePopupWindow = '';
    const file: File = event.target.files[0];
    if (file && this.validatingFile(file)) {
      this.isfileSelected = true;
      this.selectedFile = file;
    }
  }

  //when user cancel to add File
  cancelAddFilebutton() {
    this.popOutAddFiles.emit(true);
  }

  //Handling Upload button event
  uploadFile() {
    this.spinner.show();
    this.userMessagePopupWindow = '';
    let formData = new FormData();
    formData.append('file', <File>this.selectedFile);
    this.knowledgeService.addFile(formData, this.selectedCategory).subscribe(
      (data) => {
        //On Successful upload refresh list of the files
        this.refreshFiles.emit('refresh');
        this.popOutAddFiles.emit(true);
      },
      (err) => {
        this.userMessagePopupWindow = this.knowledgeService.handleError(err);
      },
      () => {
        this.spinner.hide();
      }
    );
  }

  //Validating User's Input file, Limiting File to 2MB in size
  validatingFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      this.userMessagePopupWindow = 'File Size should be less than 2 MB';
      return false;
    }
    return true;
  }
}
