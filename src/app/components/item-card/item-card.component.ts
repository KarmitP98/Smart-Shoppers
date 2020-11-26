import { Component, Input, OnInit } from '@angular/core';
import { ItemModel } from '../../model/models';

@Component( {
              selector: 'app-item-card',
              templateUrl: './item-card.component.html',
              styleUrls: [ './item-card.component.css' ]
            } )
export class ItemCardComponent implements OnInit {

  @Input() item: ItemModel;

  constructor() { }

  ngOnInit(): void {
  }


}
