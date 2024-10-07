import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { StorageService } from "../../../auth-services/storage-service/storage.service";
import { Observable } from "rxjs";

const BASIC_URL = "http://localhost:8080/api/";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(private http: HttpClient, private storageService: StorageService) {} // Inject StorageService

  postQuestion(questionDto: any): Observable<any> {
    questionDto.apprenantId = this.getUserId(); // Use instance method
    console.log("questionDto", questionDto);
    return this.http.post(`${BASIC_URL}question`, questionDto, {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllQuestions(pageNumber: number): Observable<any> {
    return this.http.get<any[]>(`${BASIC_URL}questions/${pageNumber}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getQuestionById(questionId: number): Observable<any> {
    return this.http.get<any>(`${BASIC_URL}question/${this.getUserId()}/${questionId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  getQuestionsByUserId(pageNumber: number): Observable<any> {
    return this.http.get<any[]>(`${BASIC_URL}questions/${this.getUserId()}/${pageNumber}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  addVoteToQuestion(voteQuestionDto: any): Observable<any> {
    return this.http.post<any[]>(`${BASIC_URL}vote`, voteQuestionDto, {
      headers: this.createAuthorizationHeader()
    });
  }

  editQuestion(questionId: number, questionDto: any): Observable<any> {
    return this.http.put(`${BASIC_URL}question/${questionId}`, questionDto, {
      headers: this.createAuthorizationHeader()
    });
  }

  deleteQuestion(questionId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}question/${questionId}`, {
      headers: this.createAuthorizationHeader()
    });
  }

  private createAuthorizationHeader(): HttpHeaders {
    const token = this.storageService.getToken(); // Use instance method
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getUserId(): number | null {
    return this.storageService.getUserId(); // Use instance method
  }
}
