import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

export const sendMessage = async (message: string) => {
  // send message to SQS
  // console.log('Message sent to SQS:', message);
  const region = process.env.AWS_REGION ?? '';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID ?? '';
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY ?? '';

  const sqs = new SQSClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const command = new SendMessageCommand({
    QueueUrl: process.env.AWS_SQS_QUEUE_URL ?? '',
    MessageBody: message,
    MessageGroupId: 'offchain-events',
    MessageDeduplicationId: `${Date.now()}`,
  });

  try {
    await sqs.send(command);
  } catch (error) {
    console.error('Error sending message to SQS:', error);
  }
};
