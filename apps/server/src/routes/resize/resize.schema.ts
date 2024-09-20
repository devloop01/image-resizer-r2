import { z } from 'zod';

export const resizeImageSchema = z.object({ image: z.instanceof(File) });
