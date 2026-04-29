import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export type AuthedHandler<TCtx = unknown> = (
  request: Request,
  ctx: TCtx,
) => Promise<NextResponse> | NextResponse;

export function withAdminAuth<TCtx = unknown>(handler: AuthedHandler<TCtx>) {
  return async (request: Request, ctx: TCtx) => {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    return handler(request, ctx);
  };
}
