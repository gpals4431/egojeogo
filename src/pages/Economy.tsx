import { Layout } from "@/components/Layout";
import { PixelCard } from "@/components/PixelCard";

const stockData = [
  { name: "코스피", value: "2,534.12", change: "+1.2%", up: true, emoji: "📈" },
  { name: "코스닥", value: "832.45", change: "-0.5%", up: false, emoji: "📉" },
  { name: "USD/KRW", value: "1,325.50", change: "+0.3%", up: true, emoji: "💱" },
];

const Economy = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base pixel-text-shadow inline-block px-4 py-2 bg-primary text-primary-foreground">
            📈 경제 / ECONOMY 📈
          </h1>
        </div>

        {/* Market Overview */}
        <PixelCard title="📊 시장 현황" className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stockData.map((stock) => (
              <div 
                key={stock.name}
                className="text-center p-4 bg-muted pixel-inset"
              >
                <div className="text-[10px] text-muted-foreground mb-1">
                  {stock.emoji} {stock.name}
                </div>
                <div className="text-base mb-1">{stock.value}</div>
                <div className={stock.up ? "text-primary" : "text-accent"}>
                  {stock.up ? "🔺" : "🔻"} {stock.change}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[8px] text-muted-foreground text-center">
            ⚠️ 실시간 데이터가 아닌 예시 데이터입니다
          </div>
        </PixelCard>

        {/* Investment Notes */}
        <PixelCard title="📝 투자 노트" className="mb-6">
          <div className="space-y-4">
            <div className="p-3 bg-muted pixel-inset">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] text-muted-foreground">
                  📅 2024.03.15
                </span>
                <span className="px-2 text-[8px] bg-primary text-primary-foreground">
                  📚 공부
                </span>
              </div>
              <p>
                💡 PER (주가수익비율): 주가를 주당순이익으로 나눈 값.
                낮을수록 저평가된 주식일 가능성이 있다. 🔍
              </p>
            </div>
            <div className="p-3 bg-muted pixel-inset">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] text-muted-foreground">
                  📅 2024.03.12
                </span>
                <span className="px-2 text-[8px] bg-accent text-accent-foreground">
                  🔬 분석
                </span>
              </div>
              <p>
                🎯 분산 투자의 중요성: 한 종목에 올인하지 말고
                여러 자산에 분산 투자하자. 리스크 관리가 핵심! 🛡️
              </p>
            </div>
          </div>
        </PixelCard>

        {/* Goals */}
        <PixelCard title="🎯 목표">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-primary">✅</span>
              <span>매일 경제 뉴스 읽기 📰</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✅</span>
              <span>재무제표 분석 공부 📊</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">⬜</span>
              <span className="text-muted-foreground">투자 일지 작성하기 📝</span>
            </div>
          </div>
        </PixelCard>
      </div>
    </Layout>
  );
};

export default Economy;
