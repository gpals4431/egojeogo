import { Layout } from "@/components/Layout";
import { SubwayWidget } from "@/components/widgets/SubwayWidget";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center mb-8 py-8">
        <div className="inline-block pixel-card bg-primary text-primary-foreground px-8 py-6">
          <h1 className="text-sm md:text-base mb-4 pixel-text-shadow">
            🌟 WELCOME TO MY PIXEL WORLD 🌟
          </h1>
          <p className="text-[10px] leading-relaxed max-w-md mx-auto">
            안녕하세요! 👋 이곳은 나만의 픽셀 공간입니다.<br />
            💻 개발, 🗾 일본어, 📈 경제, 🍱 일상을 기록합니다.
          </p>
          <div className="mt-4 text-[8px] text-primary-foreground/70">
            👇 아래로 스크롤하여 더 알아보기 👇
          </div>
        </div>
      </section>

      {/* Dashboard Widgets */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-primary">▶▶</span>
          <h2 className="text-xs uppercase tracking-wider">📊 대시보드</h2>
          <div className="flex-1 border-b-2 border-dashed border-border ml-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SubwayWidget />
          <NewsWidget />
          <WeatherWidget />
        </div>
      </section>

      {/* Quick Links */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-primary">▶▶</span>
          <h2 className="text-xs uppercase tracking-wider">🔗 바로가기</h2>
          <div className="flex-1 border-b-2 border-dashed border-border ml-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: "👾", label: "내소개", path: "/about", desc: "자기소개" },
            { icon: "💻", label: "개발노트", path: "/dev-notes", desc: "코딩일지" },
            { icon: "🗾", label: "일본어", path: "/japanese", desc: "学習記録" },
            { icon: "🍱", label: "식단", path: "/diet", desc: "건강관리" },
          ].map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="pixel-card bg-card p-4 text-center hover:bg-muted transition-colors group"
            >
              <div className="text-3xl mb-2 group-hover:animate-pixel-bounce">
                {item.icon}
              </div>
              <div className="text-[10px] uppercase tracking-wider mb-1">
                {item.label}
              </div>
              <div className="text-[8px] text-muted-foreground">
                {item.desc}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Status Bar */}
      <section className="pixel-border bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[10px]">
          <div className="flex items-center gap-4">
            <span className="text-primary">🟢</span>
            <span>STATUS: ONLINE ✨</span>
          </div>
          <div className="flex items-center gap-4">
            <span>👥 VISITORS: 1,234</span>
            <span>|</span>
            <span>📝 POSTS: 42</span>
          </div>
          <div className="text-muted-foreground">
            🕐 LAST UPDATE: {new Date().toLocaleDateString("ko-KR")}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
