export interface BaseObject {
  id: string;
}

export interface BlogPost extends BaseObject {
  //id: string;
  title: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;

  authorId: string;
}

export interface Author extends BaseObject {
  //id: string;
  name: string;
}
