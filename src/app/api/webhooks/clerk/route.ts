import { env } from '@/data/env/server';
import { createUserSubscription, deleteUserSubscription } from '@/repositories/subscription';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  const { headers } = req;
  const svixId = headers.get('svix-id') ?? '';
  const svixTimestamp = headers.get('svix-timestamp') ?? '';
  const svixSignature = headers.get('svix-signature') ?? '';

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET);

  let event: WebhookEvent;

  try {
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as WebhookEvent;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error verifying webhook:', error);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  if (event.type === 'user.created' && event.data.id != null) {
    await createUserSubscription({
      clerkUserId: event.data.id,
      tier: 'Free',
    });

    return new Response('', { status: 200 });
  }

  if (event.type === 'user.deleted' && event.data.id != null) {
    await deleteUserSubscription(event.data.id);

    return new Response('', { status: 200 });
  }

  return new Response('', { status: 200 });
}
