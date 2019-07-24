import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Question } from '../interfaces/question';
import { moveItemInArray } from '@angular/cdk/drag-drop';

const DEFAULT_QUESTIONS: Question[] = [
  {
    id: 'what',
    text: '今一番の悩みは何ですか？'
  },
  {
    id: 'goal',
    text: '何をもって解決となりますか？'
  },
  {
    id: 'how',
    text: 'どうすれば解決しますか？'
  },
  {
    id: 'when',
    text: 'いつからはじめますか？'
  }
];

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  sessionTime = this.load('sessionTime') || 1800;
  questions: Question[] = this.load('questions') || DEFAULT_QUESTIONS;
  questionIndex: number;
  sessionSource = new Subject<boolean>();
  session$ = this.sessionSource.asObservable();


  questionSource = new BehaviorSubject<number>(0);
  question$ = this.questionSource.asObservable();

  constructor() { }

  start() {
    this.sessionSource.next(true);
  }

  stop() {
    this.sessionSource.next(false);
  }

  changeQuestion(index: number)   {
    this.questionSource.next(index);
  }

  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
    this.save();
  }

  updateQuestion(i: number, text: string) {
    this.questions[i].text = text;
    this.save();
  }

  addQuestion(text: string) {
    this.questions.push({
      id: Date.now().toString(),
      text
    });
    this.save();
  }

  changeQuestionOrder(before: number, after: number) {
    moveItemInArray(this.questions, before, after);
    this.save();
  }

  save() {
    localStorage.setItem('data', JSON.stringify({
      sessionTime: this.sessionTime,
      questions: this.questions
    }));
  }

  private load(key: string) {
    const item = localStorage.getItem('data');
    if (item) {
      return JSON.parse(item)[key];
    } else {
      return null;
    }
  }
}
