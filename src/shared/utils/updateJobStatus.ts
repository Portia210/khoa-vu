import { BASE_URL } from '../constants/enviroment';
import { CrawlerCommand, CrawlerStatus } from '../types/CrawlerCommand';

const updateJobStatus = async (
  job: CrawlerCommand,
  status: CrawlerStatus = 'RUNNING',
  message?: string,
): Promise<boolean> => {
  try {
    if (!job._id) throw new Error('Job id is required');
    const payload = {
      ...job,
      status,
      message,
    };
    const response = await fetch(`${BASE_URL}/api/jobs/${job._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());
    return response;
  } catch (error) {
    console.error('Error while updating job status', error);
    throw error;
  }
};

export { updateJobStatus };
