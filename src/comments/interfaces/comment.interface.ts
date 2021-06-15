export interface Comment {
  userId: string;
  orderId: string;
  georeferenceId: string;
  text: string;
}

export const CommentMock: Comment = {
  userId: '1',
  orderId: '5',
  georeferenceId: '3',
  text: 'a comment',
};
