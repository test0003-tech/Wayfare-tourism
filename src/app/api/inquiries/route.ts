import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, type, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    const inquiry = await db.inquiry.create({
      data: {
        name: typeof name === 'string' ? name.trim() : name,
        email: typeof email === 'string' ? email.trim().toLowerCase() : email,
        phone: phone || null,
        type: type || 'custom',
        message: typeof message === 'string' ? message.trim() : message,
        status: 'new',
      },
    });

    return NextResponse.json(
      { success: true, inquiry: { id: inquiry.id, status: inquiry.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
