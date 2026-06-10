import { handleSignIn, getLogtoContext } from '@logto/next/server-actions';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { logtoConfig } from '@/app/logto';
import { db, users } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  await handleSignIn(logtoConfig, searchParams);

  // Upsert user into database
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  if (isAuthenticated && claims) {
    await db.insert(users).values({
      id: crypto.randomUUID(),
      logtoId: claims.sub,
      name: claims.name || claims.username || null,
      email: claims.email || null,
    }).onConflictDoUpdate({
      target: users.logtoId,
      set: {
        name: claims.name || claims.username || null,
        email: claims.email || null,
      }
    });
  }

  redirect('/');
}
