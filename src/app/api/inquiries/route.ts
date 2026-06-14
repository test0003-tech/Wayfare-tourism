import { NextResponse } from 'next/server';

export const runtime = 'edge';

// In-memory inquiries store for edge runtime (no database access)
const inquiries: Array<{
  id: string;
  name: string;
  email: string;
  phone: string | null;
  type: string;
  message: string;
  status: string;
  createdAt: string;
}> = [];

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

    const inquiryId = `INQ-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const inquiry = {
      id: inquiryId,
      name: typeof name === 'string' ? name.trim() : name,
      email: typeof email === 'string' ? email.trim().toLowerCase() : email,
      phone: phone || null,
      type: type || 'custom',
      message: typeof message === 'string' ? message.trim() : message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };

    inquiries.push(inquiry);

    return NextResponse.json(
      { success: true, inquiry: { id: inquiry.id, status: inquiry.status } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
