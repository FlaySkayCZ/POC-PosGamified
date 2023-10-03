import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';
import { BACKEND_URL } from '../constants';
interface Host {
  hostId: number;
  surname: string;
  name: string;
  reason: string;
  birthDate: string;
  icn: string;
  residence: string;
  city: string;
  cityPart: string;
  street: string;
  arrivalDate: Date;
  departureDate: Date;
  note: string;
}

@Component({
  selector: 'app-hotelForm',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnInit {
  @ViewChild('parent', { static: true }) parent: ElementRef | undefined;
  _formGroup!: FormGroup;
  _formControl!: FormControl;
  constructor(
    private translate: TranslateService,
    private renderer: Renderer2,
    private http: HttpClient,
    private fb: FormBuilder) { }

  hostId: number | undefined;
  surname: string = '';
  name: string = '';
  reason: string = '';
  birthDate: string = '';
  icn: string = '';
  residence: string = '';
  city: string = '';
  cityPart: string = '';
  street: string = '';
  arrivalDate = new Date();
  departureDate = new Date();
  Note: string = '';
  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate());
  date = new FormControl(new Date());


  ngOnInit() {
    this.getLastId();
    this._formGroup = this.fb.group({
      surname: ['', Validators.required],
      name: ['', Validators.required],
      reason: ['', Validators.required],
      birthDate: ['', Validators.required],
      icn: ['', Validators.required],
      residence: ['', Validators.required],
      city: ['', Validators.required],
      cityPart: ['', Validators.required],
      street: ['', Validators.required],
      arrivalDate: [new Date(), Validators.required],
      departureDate: [new Date(), Validators.required],
      note: ['']
    });
    this.defaultForm();
  }

  submitHost() {
    const formData = {
      hostId: this.hostId,
      surname: this.surname,
      name: this.name,
      reason: this.reason,
      birthDate: this.birthDate,
      icn: this.icn,
      residence: this.residence,
      city: this.city,
      cityPart: this.cityPart,
      street: this.street,
      arrivalDate: this.date.value,
      departureDate: this.departureDate,
      Note: this.Note,
    };

    console.log(formData);
    axios.post( `${BACKEND_URL}/submit-form`, formData)
      .then(response => {
        this.getLastId();
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    this.defaultForm();
  }

  async getLastId() {
    axios.get( `${BACKEND_URL}/get-last-id`)
      .then(response => {
        this.hostId = response.data.nextId;
      })
      .catch(error => {
        console.error(error);
      });
  }

  defaultForm() {
    this.surname = '';
    this.name = '';
    this.reason = '';
    this.birthDate = '';
    this.icn = '';
    this.residence = '';
    this.city = '';
    this.cityPart = '';
    this.street = '';
    this.arrivalDate = this.minDate;
    this.departureDate = this.minDate;
    this.Note = '';

  }
  getErrorMessage() {
    return 'You must enter a value';
  }
}
