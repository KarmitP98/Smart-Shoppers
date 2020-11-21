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
  sStreet: string;
  sPostalCode: string;
  sAreaCode: string;
  sCity: string;
  sProvince: string;
  sCountry: string;
  sPriceMult: number;
  sItems: ItemModel[];
  sManagerId?: string;
}

export class ItemModel {
  itemDetail: ItemDetailModel;
  iStatus: string;
  iStoreQuantity: number;
  onSale: boolean;
  iBought: boolean;
  price: number;
  isle: number;
  iQ?: number;
  oldPrice?: number;
}

export class ItemDetailModel {
  iId: string;
  iName: string;
  iDesc: string;
  iIcon: string;
  iCategory: string;
  iPrice?: number;
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
