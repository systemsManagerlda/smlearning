"use client";

import { useUser } from "@clerk/nextjs";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createPaymentSession } from "../../actions/createStripeCheckout";
import { toast } from "react-toastify";
function EnrollButton({
  courseId,
  isEnrolled,
}: {
  courseId: string;
  isEnrolled: boolean;
}) {
  const { user, isLoaded: isUserLoaded } = useUser();
  // const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleEnroll = async (courseId: string) => {
    startTransition(async () => {
      try {
        const userId = user?.id;
        if (!userId) return;
        const result = await createPaymentSession(courseId, userId); 

        // Cria sessão de pagamento no server
        // const { checkoutUrl, paymentId } =
        //   await createPaymentSession(courseId, userId);

        // if (!checkoutUrl || !paymentId) {
        //   throw new Error("Checkout URL ou Payment ID não recebidos");
        // }

        // Armazena os dados no localStorage
      if (result.checkoutUrl && result.paymentId) {
        localStorage.setItem('paymentData', JSON.stringify({
          preco: result.preco,
          clerkUserID: result.clerkUserID,
          checkoutUrl: result.checkoutUrl,
          paymentId: result.paymentId,
          courseSlug: result.courseSlug,
          timestamp: Date.now()
        }));

        // Redireciona para o checkout
        window.location.href = result.checkoutUrl;
      }

        // Abre checkout numa nova aba
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
        // Timeout máximo de 1 minuto
        const timeout = setTimeout(
          () => {
            // clearInterval(interval);

            if (checkoutWindow && !checkoutWindow.closed) {
              checkoutWindow.close();
            }

            toast.error(
              `O pagamento não foi realizado dentro do tempo estimado. Tente novamente.`,
              {
                position: "top-right",
                autoClose: 5000,
                theme: "dark",
              }
            );
          },
          1 * 60 * 1000
        ); // 1 minuto
        console.log(timeout);
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
