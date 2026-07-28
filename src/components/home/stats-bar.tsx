export function StatsBar() {
  const stats = [
    { value: "50+", label: "Publications" },
    { value: "12+", label: "Active Projects" },
    { value: "6", label: "International Partners" },
    { value: "25+", label: "Researchers" },
  ];

  return (
    <section className="bg-foreground py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-background mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-background/60 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
