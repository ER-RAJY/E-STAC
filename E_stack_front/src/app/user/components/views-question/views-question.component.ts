import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../user-service/question-service/question.service';
import { ActivatedRoute } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from "../../../auth-services/storage-service/storage.service";
import {AnswerService} from "../../user-service/answer-services/answer.service";

@Component({
  selector: 'app-views-question',
  templateUrl: './views-question.component.html',
  styleUrls: ['./views-question.component.scss']
})
export class ViewsQuestionComponent implements OnInit {
  questionId: number = this.activatedRoute.snapshot.params["questionId"];
  question: any;
  validateForm!: FormGroup;
  selectedFile!: File | null;
  imagePreview!: string | ArrayBuffer | null;
  formData: FormData = new FormData();
  answers: any[] = [];

  constructor(private questionService: QuestionService,
              private answerService: AnswerService,
              private activatedRoute: ActivatedRoute,
              private formBuilder: FormBuilder,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.validateForm = this.formBuilder.group({
      body: [null, Validators.required]
    });
    this.getQuestionById();
  }

  getQuestionById() {
    this.questionService.getQuestionById(this.questionId).subscribe(data => {
      console.log("Get Question By Id questionService", data)
      this.question = data.questionDTO;
      data.answerDtoList.forEach((element: any) => {
        if (element.file != null) {
          element.convertedImg = "data:image/jpeg;base64," + element.file.data;
        }
        this.answers.push(element);
      })

    })
  }

  addAnswer() {
    const data = this.validateForm.value;
    data.questionId = this.questionId;
    data.userId = StorageService.getUserId();
    this.formData.append('multipartFile', this.selectedFile!);

    console.log("Sending AnswerDto:", data); // سجل البيانات لي غادي ترسلها

    this.answerService.postAnswer(data).subscribe(
      (res: { id: number | null; }) => {
        if (res.id != null) {
          this.answerService.postAnswerImage(this.formData, res.id).subscribe(
            (response: any) => {
              console.log("Answer image added", response);
            }
          );
          this.snackBar.open("Answer added successfully", "Close", {
            duration: 5000,
          });
        } else {
          this.snackBar.open("Failed to add answer", "Close", {
            duration: 5000,
          });
        }
      },
      (error) => {
        this.snackBar.open("Failed to add answer", "Close", {
          duration: 5000,
        });
        console.error(error);
      }
    );
    this.validateForm.reset();
  }


  addVote(voteType: string, voted: number) {

    if (voted == 1 || voted == -1) {
      this.snackBar.open("You already voted to this question", "Close", {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
    } else {
      const data = {
        userId: StorageService.getUserId(),
        questionId: this.questionId,
        voteType: voteType
      }
      this.questionService.addVoteToQuestion(data).subscribe(res => {
        console.log("********** addVote res : ", res)
        if (res != null) {
          this.snackBar.open("Vote added successfully", "Close", {
            duration: 5000,
          });
          this.getQuestionById();
        } else {
          this.snackBar.open("Vote added failed", "Close", {
            duration: 5000,
          });
        }
      })

    }


  }

  onFileSelectedd(event: any) {
    this.selectedFile = event.target.files[0];
    this.previewImage();
    console.log("********** selected file", this.selectedFile)

  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
    this.previewImage();
  }
  previewImage() {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(this.selectedFile!);
  }

}
