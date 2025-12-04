import { Layout } from "@/components/Layout";
import { PixelCard } from "@/components/PixelCard";

const About = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base pixel-text-shadow inline-block px-4 py-2 bg-primary text-primary-foreground">
            👾 내소개 / ABOUT ME 👾
          </h1>
        </div>

        <PixelCard title="🪪 프로필" className="mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Pixel Avatar */}
            <div className="shrink-0 text-center">
              <div className="text-6xl mb-2">👨‍💻</div>
              <div className="text-[8px] text-muted-foreground">LEVEL 99</div>
            </div>
            
            <div className="space-y-3">
              <div className="border-b border-dashed border-border pb-2">
                <span className="text-muted-foreground">📛 이름:</span>
                <span className="ml-2">픽셀 개발자</span>
              </div>
              <div className="border-b border-dashed border-border pb-2">
                <span className="text-muted-foreground">💼 직업:</span>
                <span className="ml-2">소프트웨어 개발자</span>
              </div>
              <div className="border-b border-dashed border-border pb-2">
                <span className="text-muted-foreground">💖 관심사:</span>
                <span className="ml-2">코딩, 일본어, 경제, 건강</span>
              </div>
              <div>
                <span className="text-muted-foreground">🔋 상태:</span>
                <span className="ml-2 text-primary">● 활동 중 ✨</span>
              </div>
            </div>
          </div>
        </PixelCard>

        <PixelCard title="📝 소개글" className="mb-6">
          <div className="space-y-4">
            <p>
              안녕하세요! 👋 이 픽셀 홈페이지에 오신 것을 환영합니다.
            </p>
            <p>
              저는 개발을 좋아하고 💻, 새로운 것을 배우는 것을 즐기는
              사람입니다. 이 공간에서 제 개발 여정 🚀, 일본어 학습 🗾,
              경제 공부 📈, 그리고 건강한 식단 🥗에 대해 기록합니다.
            </p>
            <p className="text-muted-foreground">
              💬 "작은 픽셀들이 모여 큰 그림이 된다" 🧩
            </p>
          </div>
        </PixelCard>

        <PixelCard title="⚔️ 스킬">
          <div className="space-y-3">
            {[
              { name: "JavaScript", level: 80, emoji: "⚡" },
              { name: "React", level: 75, emoji: "⚛️" },
              { name: "TypeScript", level: 70, emoji: "📘" },
              { name: "일본어", level: 50, emoji: "🗾" },
            ].map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between">
                  <span>{skill.emoji} {skill.name}</span>
                  <span className="text-muted-foreground">{skill.level}%</span>
                </div>
                <div className="h-4 bg-muted pixel-inset">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PixelCard>
      </div>
    </Layout>
  );
};

export default About;
