export default function Hero() {
  return (
    <div className="relative h-[45vh] w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/55 dark:from-white/15 dark:to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            Expanda Seu Conhecimento Com Nossos Cursos
          </h1>
          <p className="text-xl text-muted-foreground">
           Explore um universo de conhecimento com cursos criados por especialistas. Aprenda com profissionais experientes e leve suas habilidades ao próximo nível.
          </p>
        </div>
      </div>
    </div>
  );
}
