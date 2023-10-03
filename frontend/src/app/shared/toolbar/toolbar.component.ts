import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { TranslateService } from '@ngx-translate/core';

interface Language {
  value: string;
  viewValue: string;
  icon: string;
}
const defaultLanguage = 'en';
const supportedLanguages = ['cs', 'de', 'en', 'es', 'fr'];

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  selectedLanguage: any;

  languages: Language[] = [
    { value: 'cs', viewValue: 'Čeština', icon: 'language' },
    { value: 'en', viewValue: 'English', icon: 'language' },
    { value: 'de', viewValue: 'Detuch', icon: 'language' },
    { value: 'es', viewValue: 'Español', icon: 'language' },
    { value: 'fr', viewValue: 'Français', icon: 'language' }
  ];
  constructor(private translate: TranslateService) {
    const browserLanguage = translate.getBrowserLang() as string;
    if (supportedLanguages.includes(browserLanguage)) { this.selectedLanguage = browserLanguage } else { this.selectedLanguage = defaultLanguage; }
    this.selectedLanguage = this.languages.find(language => language.value === browserLanguage);
    translate.setDefaultLang(defaultLanguage);
    translate.use(this.selectedLanguage.value);
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  selectLang(lang: Language) {
    this.translate.use(lang.value);
    this.selectedLanguage = lang;
    this.sidenav?.close();
  }
  toMenu() {
    window.location.href = '/'; 
  }
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login'; 
  }
}
