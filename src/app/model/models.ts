import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;

export class UserModel {
  uId: string;
  uName: string;
  uEmail: string;
  uProPic: string;
  uType: string;
  uLevel?: number;
  preferedStore?: string;
  currentShoppingList?: ShoppingList;
  shoppingLists?: ShoppingList[];
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
  sManagerIds: string[];
  status: boolean;
}

export class ItemModel {
  itemDetail: ItemDetailModel;
  iStatus: string;
  iStoreQuantity: number;
  onSale: boolean;
  price: number;
  isle: number;
  iBought: number;
  oldPrice?: number;
}

export class ListItem {
  item: ItemModel;
  iQuantity: number;
  iSize: number;
  iStoreId: string;
  iStoreName: string;
}

export class ItemDetailModel {
  iId: string;
  iName: string;
  iDesc: string;
  iIcon: string;
  iCategory: string;
  iPrice: number;
}

export class ShoppingList {
  sId: string;
  sItems: ListItem[];
  sStatus: string;
  lName: string;
  date: Timestamp;
}

// export class OrderModel {
//   oId: string;
//   cId: string;
//   oItems: ItemModel[];
// }
//
// export class CustomerStoreModel {
//   sId: string;
//   currentShoppingList: ShoppingList;
//   shoppingLists: ShoppingList[];
// }
