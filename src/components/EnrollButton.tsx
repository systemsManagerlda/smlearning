"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { createPaymentSession } from "../../actions/createStripeCheckout";
import { toast } from "react-toastify";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";
import getCourseById from "@/sanity/lib/courses/getCourseById";
function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [idPagamento, setIdPagamento] = useState("");
  useEffect(() => {
    const executePaymentRequest = async () => {
      try {
        const url = new URL(
          `https://paysuite.tech/api/v1/payments/${idPagamento}`
        );

        const headers = {
          Authorization:
            "Bearer 621|7Jx2O6rVnCs73oYF3FUp1ZD5noIpry2C73TOhvXHcfe585ee",
          "Content-Type": "application/json",
          Accept: "application/json",
        };

        const response = await fetch(url, {
          method: "GET",
          headers,
        });

        const data = await response.json();
        console.log(data);
        if (data.data.transaction) {
          if (data.data.transaction.status === "completed") {
            // Encontrar o estudante
            if (!userId) {
              throw new Error("UserId não encontrado.");
            }
            const student = await getStudentByClerkId(userId);
            const course = await getCourseById(courseId);
            if (!course) {
              throw new Error("UserId não encontrado.");
            }

            if (!student || !student.data) {
              return;
            }
            await createEnrollment({
              studentId: student.data._id,
              courseId: course._id,
              paymentId: idPagamento,
              amount: Number(course.price),
            });
          } else {
            toast.error(`Pagamento não finalizado!!!`, {
              position: "top-right",
              autoClose: 5000,
              theme: "dark",
            });
          }
        } else {
          toast.error(`Não foi possivel processar o seu pagamento...`, {
            position: "top-right",
            autoClose: 5000,
            theme: "dark",
          });
        }
      } catch (error) {
        console.error("Erro na requisição:", error);
      }
    };

    // Executar após 1 minuto
    setTimeout(executePaymentRequest, 60000);
  }, [courseId, idPagamento, userId]);

  const handleEnroll = async (courseId: string) => {
    startTransition(async () => {
      try {
        if (!userId) return;
        const result = await createPaymentSession(courseId, userId);
        const checkoutWindow = window.open(result.checkoutUrl, "_blank");

        if (!checkoutWindow) {
          toast.error(
            `Não foi possível abrir a janela de pagamento. Verifique se o bloqueador de popups está ativo..`,
            {
              position: "top-right",
              autoClose: 5000,
              theme: "dark",
            }
          );
          return;
        }
        setIdPagamento(result.paymentId);

        // Fechar a janela após 1 minuto (60000 milissegundos)
        setTimeout(() => {
          if (checkoutWindow && !checkoutWindow.closed) {
            checkoutWindow.close();
            toast.info(`Tempo normal de pagamento escedido!!!`, {
              position: "top-right",
              autoClose: 5000,
              theme: "dark",
            });
          }
        }, 60000); // 60 segundos = 60000 ms
      } catch (error) {
        console.error("Error in handleEnroll:", error);
        toast.error(`Falha ao criar sessão de checkout. Tente novamente.`, {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      }
    });
  };

  // Show loading state while checking user is loading
  if (!isUserLoaded || isPending) {
    return (
      <div className="w-full h-12 rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Show enrolled state with link to course
  if (isEnrolled) {
    return (
      <Link
        prefetch={false}
        href={`/dashboard/courses/${courseId}`}
        className="w-full rounded-lg px-6 py-3 font-medium bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 h-12 flex items-center justify-center gap-2 group"
      >
        <span>Acessar Curso</span>
        <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </Link>
    );
  }

  // Show enroll button only when we're sure user is not enrolled
  return (
    <button
      className={`w-full rounded-lg px-6 py-3 font-medium transition-all duration-300 ease-in-out relative h-12
        ${
          isPending || !user?.id
            ? "bg-gray-100 text-gray-400 cursor-not-allowed hover:scale-100"
            : "bg-white text-black hover:scale-105 hover:shadow-lg hover:shadow-black/10"
        }
      `}
      disabled={!user?.id || isPending}
      onClick={() => handleEnroll(courseId)}
    >
      {!user?.id ? (
        <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
          Faça login para se inscrever
        </span>
      ) : (
        <span className={`${isPending ? "opacity-0" : "opacity-100"}`}>
          Inscreva-se agora
        </span>
      )}
      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}
    </button>
  );
}

export default EnrollButton;
