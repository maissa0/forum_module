import { AbstractControl, ValidatorFn } from '@angular/forms';

export function forbiddenWordsValidator(forbiddenWords: string[]): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = forbiddenWords.some(word => control.value.toLowerCase().includes(word.toLowerCase()));
    return forbidden ? { forbiddenWord: true } : null;
  };
}
