import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import prisma from '../../../../lib/prisma'

export async function POST(req: Request) {

  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    })
  }

  // Do something with the payload
  // For this guide, you simply log the payload to the console
  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    try {
        await prisma.user.create({
            data: {
                id: evt.data.id,
                clerkId: evt.data.id,
                username: JSON.parse(body).data?.username,
                email: JSON.parse(body).data?.email_address,
                name: JSON.parse(body).data.username,
                image: JSON.parse(body).data.image_url,
              },
            }); 
            return new Response('作成成功', { status: 200 })
    } catch (err) {
      console.error('作成失敗:', err);
      return new Response('Error occured', {
        status: 400
      })
    }}

    if (eventType === 'user.updated') {
        try {
            await prisma.user.update({
                where: {
                    clerkId: evt.data.id,
                  },
                  data: {
                    username: JSON.parse(body).data.username,
                    email: JSON.parse(body).data.email_address,
                    name: JSON.parse(body).data.username,
                    image: JSON.parse(body).data.image_url,
                  },
                }); 
                return new Response('', { status: 200 })
        } catch (err) {
          console.error('修正成功', err);
          return new Response('修正更新失敗', {
            status: 400
          })
        }}

  return new Response('webhook失敗', { status: 200 })
}