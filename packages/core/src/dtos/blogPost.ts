export interface BlogPost {
  id: string;
  title: string;
  text: string;
  createdAt: Date;
  lastUpdatedAt: Date;

  authorId: string;
}

export interface Author {
  id: string;
  name: string;
}
