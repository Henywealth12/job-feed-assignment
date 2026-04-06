export class GetJobsQueryDto {
  page?: number = 1;
  limit?: number = 10;
  category?: string;
  type?: string;
}
