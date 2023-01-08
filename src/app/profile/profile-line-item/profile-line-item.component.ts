import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-profile-line-item',
  templateUrl: './profile-line-item.component.html',
  styleUrls: ['./profile-line-item.component.scss'],
})
export class ProfileLineItemComponent {
  //TODO: pass the update email function down as well. Or do we use an output field here?
  @Input() itemLabel = '';
  @Input() itemValue: FormControl = new FormControl('');
  @Input() inputType: string = '';
  isEditing: boolean = false;
}
