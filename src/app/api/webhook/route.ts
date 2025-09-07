// app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";

export async function POST(request: NextRequest) {
  try {
    // Obter parâmetros da URL
    const url = new URL(request.url);
    const courseId = url.searchParams.get('courseId');
    const userId = url.searchParams.get('userId');

    // Debug: mostrar todos os headers
    const headers = Object.fromEntries(request.headers);
    console.log("=== TODOS OS HEADERS RECEBIDOS ===");
    Object.entries(headers).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    // Verificação de assinatura (seu código existente)
    const possibleSignatureHeaders = [
      "x-webhook-signature",
      "X-Webhook-Signature",
      "X-WEBHOOK-SIGNATURE",
      "signature",
      "Signature",
      "x-signature",
      "X-Signature",
    ];

    let signature: string | null = null;

    for (const headerName of possibleSignatureHeaders) {
      const value = request.headers.get(headerName);
      if (value) {
        signature = value;
        console.log(`Assinatura encontrada no header: ${headerName}`);
        break;
      }
    }

    console.log("Assinatura:", signature);

    if (!signature) {
      return NextResponse.json(
        {
          error: "Missing signature",
          help: "Adicione o header x-webhook-signature na requisição",
          receivedHeaders: headers,
        },
        { status: 401 }
      );
    }

    const payload = await request.text();
    console.log("Payload:", payload);

    // Verificação da assinatura
    const secret = process.env.WEBHOOK_SECRET || "whsec_34e66f8d5e4b92289b9f5c9572d7d967f591aeec4b0cc03c";
    const calculatedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    console.log("Assinatura calculada:", calculatedSignature);

    if (signature !== calculatedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse do payload
    const webhookData = JSON.parse(payload);
    console.log("Dados do webhook:", webhookData);

    // Extrair dados do webhook
    const session = webhookData.data; // Ajuste conforme a estrutura do Paysuite
    const paymentId = session.id;
    const amount = session.amount_total / 100; // Converter de centavos

    // Obter metadados do pagamento
    const metadata = session.metadata || {};
    const metadataCourseId = metadata.courseId || courseId;
    const metadataUserId = metadata.userId || userId;
    const metadataSanityStudentId = metadata.sanityStudentId;

    if (!metadataCourseId || !metadataUserId) {
      return NextResponse.json(
        { error: "Missing courseId or userId in metadata" },
        { status: 400 }
      );
    }

    // Encontrar o estudante
    let student;
    if (metadataSanityStudentId) {
      // Usar ID do Sanity se disponível nos metadados
      student = { data: { _id: metadataSanityStudentId } };
    } else {
      // Buscar pelo Clerk ID como fallback
      student = await getStudentByClerkId(metadataUserId);
    }

    if (!student || !student.data) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // Criar matrícula
    await createEnrollment({
      studentId: student.data._id,
      courseId: metadataCourseId,
      paymentId: paymentId,
      amount: amount,
    });

    console.log("Matrícula criada com sucesso!");

    return NextResponse.json({
      success: true,
      message: "Webhook processado e matrícula criada!",
      data: {
        courseId: metadataCourseId,
        studentId: student.data._id,
        paymentId: paymentId,
        amount: amount
      }
    });

  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}