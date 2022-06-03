import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryLength'
})
export class CategoryLengthPipe implements PipeTransform {

  transform(value: string): string {

    if (!value || value.length === 0){
      return 'No tiene una descripcion'
    }

    if (value.length > 170){
      return value.substring(0, 170) + '....';
    }
    
    return value;
  }

}
