import { Directive, ElementRef, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[appDropdown]'
})
export class DropdownDirective {
  @HostBinding('class.open') isOpen=false;

  //Dropdown is closed by a click on that button code-
  @HostListener('click') toggleOpen(){
    this.isOpen=!this.isOpen;
  }

  // Dropdown is closed by a click anywhere outside in the document
    // @HostListener('document:click', ['$event']) toggleOpen(event:Event){
    //   this.isOpen= this.elref.nativeElement.contains(event.target)? !this.isOpen:false;
    // }

  constructor(private elref:ElementRef) { }

}
