import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ind'
})
export class IndPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
