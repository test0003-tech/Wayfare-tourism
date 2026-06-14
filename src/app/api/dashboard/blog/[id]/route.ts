import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.authorName !== undefined && { authorName: body.authorName }),
        ...(body.authorAvatar !== undefined && { authorAvatar: body.authorAvatar }),
        ...(body.authorBio !== undefined && { authorBio: body.authorBio }),
        ...(body.date !== undefined && { date: body.date }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.readingTime !== undefined && { readingTime: body.readingTime }),
        ...(body.tags !== undefined && { tags: body.tags }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.status !== undefined && { status: body.status }),
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
