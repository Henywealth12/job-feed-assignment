import { Injectable } from '@nestjs/common';
import { Job } from './job.model';
import { GetJobsQueryDto } from './dto/get-jobs-query.dto';

@Injectable()
export class JobsService {
  private jobs: Job[] = [
    { id: '1', title: 'Frontend Engineer', category: 'Engineering', type: 'Full-time', description: 'React work' },
    { id: '2', title: 'Backend Engineer', category: 'Engineering', type: 'Contract', description: 'Node.js APIs' },
    { id: '3', title: 'UI Designer', category: 'Design', type: 'Contract', description: 'Figma design' },
    { id: '4', title: 'Product Designer', category: 'Design', type: 'Full-time', description: 'UX flows' }
  ];

  getJobs(query: GetJobsQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    let filtered = this.jobs;

    if (query.category) {
      filtered = filtered.filter(job =>
        job.category.toLowerCase() === query.category.toLowerCase()
      );
    }

    if (query.type) {
      filtered = filtered.filter(job =>
        job.type.toLowerCase() === query.type.toLowerCase()
      );
    }

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);

    const start = (page - 1) * limit;
    const data = filtered.slice(start, start + limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    };
  }
      }
