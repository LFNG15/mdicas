import { NextResponse } from "next/server";

export function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message = "Não encontrado") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message = "Erro interno") {
  // Mensagens internas do banco NUNCA são repassadas — apenas logadas no servidor.
  return NextResponse.json({ error: message }, { status: 500 });
}

export function ok<T>(payload: T) {
  return NextResponse.json(payload);
}

export function logError(scope: string, err: unknown) {
  // Centraliza logging para evitar vazar detalhes ao cliente.
  console.error(`[api:${scope}]`, err);
}
