import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "../../components/Header";
import { SanityLive } from "@/sanity/lib/live";


export const metadata: Metadata = {
  title: "Systems Manager Learning",
  description:
    "A Systems Manager Learning é uma plataforma de ensino online que oferece cursos universais voltados para o desenvolvimento profissional em diversas áreas do conhecimento. Com conteúdos acessíveis, atualizados e ministrados por especialistas, a plataforma permite que qualquer pessoa, em qualquer lugar, possa aprender no seu próprio ritmo. Seja para impulsionar a carreira, adquirir novas competências ou expandir horizontes, a Systems Manager Learning é o espaço ideal para quem busca conhecimento de qualidade com flexibilidade e credibilidade.",
};

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <SanityLive />
    </ClerkProvider>
  );
}
