import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusText'
})
export class StatusTextPipe implements PipeTransform {

  transform(isActive: boolean): string {
    return isActive ? 'Wydarzenie aktywne' : 'Wydarzenie nieaktywne';
  }
}
