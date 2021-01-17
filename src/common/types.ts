export interface Caption {
  name: string;
  content: string;
}

export interface Transcript {
  ownerId: string;
  title: string;
  content: Caption[];
}