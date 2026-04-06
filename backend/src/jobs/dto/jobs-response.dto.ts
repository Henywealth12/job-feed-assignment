import { Job } from '../job.model';

export interface JobsResponseDto {
  data: Job[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
