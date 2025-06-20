export type MarkdownGetResponse = {
  content: string;
};

export type MarkdownPostRequest = {
  title: string;
  content: string;
  authorId: number;
};

export type MarkdownPostResponse = {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  authorId: number;
};

export type Report = {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
  authorId: number;
};
