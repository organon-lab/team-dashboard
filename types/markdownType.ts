export type MarkdownGetResponse = {
  content: string;
};

export type MarkdownPostRequest = {
  content: string;
};

export type MarkdownPostResponse = {
  id: number;
  content: string;
};

export type Report = {
  id: number;
  content: string | null;
};
