import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 } from 'uuid';

const s3 = new S3Client({
	region: process.env.R2_REGION as string,
	forcePathStyle: true,
	endpoint: process.env.R2_URL as string,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.R2_ACCESS_KEY_SECRET as string
	}
});

const createImage = async (file: File | Buffer, _type?: string) => {
	const id = v4();

	let Body: any;
	let ContentType = '';

	if (file instanceof File) {
		Body = Buffer.from(await file.arrayBuffer());
		ContentType = file.type;
	} else if (file instanceof Buffer) {
		if (!_type) throw new Error('Type is required when passing a Buffer');
		Body = file;
		ContentType = _type;
	} else {
		throw new Error('Invalid file type');
	}

	const params = {
		Body,
		Bucket: process.env.R2_BUCKET as string,
		Key: id,
		ContentType
	};

	const uploadCommand = new PutObjectCommand(params);
	const response = await s3.send(uploadCommand);
	return id;
};

const readImage = async (id: string): Promise<{ data: Uint8Array; contentType: string }> => {
	const readCommand = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET as string,
		Key: id
	});
	const object = await s3.send(readCommand);
	const byteArray = await object.Body?.transformToByteArray();
	if (byteArray === undefined) {
		throw new Error('File does not exist');
	}

	return {
		data: byteArray,
		contentType: object.ContentType ?? 'application/octet-stream'
	};
};

const getImageUrl = async (id: string) => {
	const readCommand = new GetObjectCommand({
		Bucket: process.env.R2_BUCKET as string,
		Key: id
	});

	const url = await getSignedUrl(s3, readCommand, { expiresIn: 60 });

	return url;
};

export { createImage, readImage, getImageUrl };
