import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const PAYSUITE_WEBHOOK_SECRET =
  process.env.PAYSUITE_WEBHOOK_SECRET ||
  "whsec_7f2127e9745c43fe3bc103f4397bcd5315a215f886d53fc8";

export async function POST(req: NextRequest) {
  try {
    // 1. Obter payload cru (string)
    const rawBody = await req.text();

    // 2. Capturar assinatura do header
    const signature = req.headers.get("x-webhook-signature");
    console.log("Assinatura", signature);
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 3. Calcular HMAC-SHA256
    const computed = crypto
      .createHmac("sha256", PAYSUITE_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    // 4. Verificar se bate
    if (computed !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // 5. Assinatura válida → processar evento
    const event = JSON.parse(rawBody);

    switch (event.event) {
      case "payment.success":
        console.log("✅ Pagamento bem-sucedido:", event.data);

        // Aqui você pode salvar no banco, atualizar fatura, etc.
        return NextResponse.json({
          event: "payment.success",
          data: event.data,
          created_at: event.created_at,
          request_id: event.request_id,
        });

      case "payment.failed":
        console.log("❌ Pagamento falhou:", event.data);

        // Exemplo: salvar falha no banco, alertar cliente, etc.
        return NextResponse.json({
          event: "payment.failed",
          data: event.data,
          created_at: event.created_at,
          request_id: event.request_id,
        });

      default:
        console.log("ℹ️ Evento desconhecido:", event.event);
        return NextResponse.json({ received: true });
    }
  } catch (err) {
    console.error("Erro no webhook:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
