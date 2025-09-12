"use server";
import getCourseById from "@/sanity/lib/courses/getCourseById";
import { createStudentIfNotExists } from "@/sanity/lib/student/createStudentIfNotExists";
import { clerkClient } from "@clerk/nextjs/server";
import baseUrl from "@/lib/baseUrl";
import { v4 as uuidv4 } from "uuid";
import { createEnrollment } from "@/sanity/lib/student/createEnrollment";
import { getStudentByClerkId } from "@/sanity/lib/student/getStudentByClerkId";

export async function createPaymentSession(courseId: string, userId: string) {
  try {
    // 1. Buscar detalhes do curso no Sanity
    const course = await getCourseById(courseId);
    const clerkUser = await (await clerkClient()).users.getUser(userId);
    const { emailAddresses, firstName, lastName, imageUrl } = clerkUser;
    const email = emailAddresses[0]?.emailAddress;

    if (!emailAddresses || !email) {
      throw new Error("User details not found");
    }

    if (!course) {
      throw new Error("Course not found");
    }

    // Criar usuário no Sanity se não existir

    const user = await createStudentIfNotExists({
      clerkId: userId,
      email: email || "",
      firstName: firstName || email,
      lastName: lastName || "",
      imageUrl: imageUrl || "",
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Se curso for gratuito, cria matrícula e retorna URL do curso
    if (!course.price || course.price === 0) {
      await createEnrollment({
        studentId: user._id,
        courseId: course._id,
        paymentId: "free",
        amount: 0,
      });

      return { url: `/courses/${course.slug?.current}` };
    }

    const { title, description, image, slug } = course;

    if (!title || !description || !image || !slug) {
      throw new Error("Course data is incomplete");
    }

    // Criar pagamento no Paysuite
    const url = "https://paysuite.tech/api/v1/payments";

    const headers = {
      Authorization: `Bearer 621|7Jx2O6rVnCs73oYF3FUp1ZD5noIpry2C73TOhvXHcfe585ee`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const safeReference = uuidv4().replace(/-/g, "");
    const student = await getStudentByClerkId(userId);

    const body = {
      amount: `${course.price}`,
      reference: safeReference,
      description: `${course.title}`,
      return_url: `${baseUrl}/courses/${slug.current}`,
      callback_url: `${baseUrl}/api/webhook`,
      metadata: {
        courseId: course._id,
        userId: userId,
        coursePrice: course.price,
        sanityStudentId: user._id,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao processar pagamento");
    }

    const data = await response.json();

    if (!data.data || !data.data.checkout_url) {
      throw new Error("URL de checkout não recebida");
    }

    // **Não usar window aqui!** Retornamos apenas a URL para o client abrir
    
    const preco = course.price;
    const clerkUserID = student.data?._id;
    const checkoutUrl = data.data.checkout_url;
    const paymentId = checkoutUrl.split("/").pop(); // extrai UUID

    return {
      checkoutUrl,
      paymentId,
      courseSlug: slug.current,
      preco,
      clerkUserID,
    };
  } catch (error) {
    console.error("Error in createPaymentSession:", error);
    throw error instanceof Error ? error : new Error(String(error));
  }
}
