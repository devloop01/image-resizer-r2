import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import sharp from 'sharp';

import { resizeImageSchema } from './resize.schema';
import { createImage, getImageUrl } from './resize.service';

export const resizeRoute = new Hono();

resizeRoute.post('/:compression', zValidator('form', resizeImageSchema), async (c) => {
	const compression = +c.req.param('compression');
	const { image } = c.req.valid('form');

	const quality = 100 - compression;

	try {
		const imageData = await image.arrayBuffer();
		const imageBuffer = Buffer.from(imageData);

		const sImage = sharp(imageBuffer);
		const finalImageBuffer = await sImage.jpeg({ quality }).toBuffer();

		const imageId = await createImage(finalImageBuffer, 'image/jpeg');
		const imageUrl = await getImageUrl(imageId);

		return c.json({
			success: true,
			imageUrl
		});
	} catch (error) {
		console.error(error);
		return c.json({ success: false });
	}
});
