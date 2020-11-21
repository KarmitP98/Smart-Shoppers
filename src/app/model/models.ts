export class UserModel {
  uId: string;
  uName: string;
  uEmail: string;
  uProPic: string;
  uType: string;
  uLevel?: number;
  preferedStore?: string;
  currentShoppingCart?: ShoppingList;
  orders?: OrderModel[];
  shoppingCarts?: ShoppingList[];
  searches?: string[];
  mStoreIds?: string[];
}

export class StoreModel {
  sId: string;
  sName: string;
  sAddress: string;
  sPostalCode: string;
  sAreaCode: string;
  sCity: string;
  sProvince: string;
  sCountry: string;
  sManagerId: string;
  sPriceMult: number;
  sItems: ItemModel[];
}

export class ItemModel {
  itemDetail: ItemDetailModel;
  iQ: number;
  iStatus: string;
  iStoreQuantity: number;
  onSale: boolean;
  iBought: boolean;
  newPrice: number;
  oldPrice?: number;
}

export class ItemDetailModel {
  iId: string;
  iName: string;
  iDesc: string;
  iIcon: string;
  iCategory: string;
}

export class ShoppingList {
  sId: string;
  sItems: ItemModel[];
  sStatus: string;
}

export class OrderModel {
  oId: string;
  cId: string;
  oItems: ItemModel[];
}
