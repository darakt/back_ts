export class CreateCommentDto {
  userId: string;
  orderId?: string;
  georeferenceId?: string;
  text: string;
}
