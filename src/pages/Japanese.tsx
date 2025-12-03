import { Layout } from "@/components/Layout";
import { PixelCard } from "@/components/PixelCard";

const vocabularyList = [
  { japanese: "勉強", reading: "べんきょう", meaning: "공부" },
  { japanese: "毎日", reading: "まいにち", meaning: "매일" },
  { japanese: "頑張る", reading: "がんばる", meaning: "힘내다" },
  { japanese: "練習", reading: "れんしゅう", meaning: "연습" },
];

const Japanese = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base pixel-text-shadow inline-block px-4 py-2 bg-primary text-primary-foreground">
            本 일본어 공부 / JAPANESE 本
          </h1>
        </div>

        {/* Study Progress */}
        <PixelCard title="학습 진행도" className="mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>JLPT N3 도전 중!</span>
              <span className="text-primary">65%</span>
            </div>
            <div className="h-6 bg-muted pixel-inset">
              <div 
                className="h-full bg-primary flex items-center justify-end px-2"
                style={{ width: "65%" }}
              >
                <span className="text-[8px] text-primary-foreground">LV.65</span>
              </div>
            </div>
            <div className="flex justify-between text-[8px] text-muted-foreground">
              <span>N5 완료</span>
              <span>N4 완료</span>
              <span>N3 진행중</span>
              <span>N2</span>
              <span>N1</span>
            </div>
          </div>
        </PixelCard>

        {/* Today's Vocabulary */}
        <PixelCard title="오늘의 단어" className="mb-6">
          <div className="space-y-2">
            {vocabularyList.map((word, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 border-b border-dashed border-border"
              >
                <div className="flex items-center gap-4">
                  <span className="text-lg">{word.japanese}</span>
                  <span className="text-[10px] text-muted-foreground">
                    ({word.reading})
                  </span>
                </div>
                <span className="text-primary">{word.meaning}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button className="pixel-btn bg-primary text-primary-foreground px-4 py-2">
              [ 새 단어 뽑기 ]
            </button>
          </div>
        </PixelCard>

        {/* Study Notes */}
        <PixelCard title="학습 노트">
          <div className="space-y-4">
            <div className="p-3 bg-muted pixel-inset">
              <div className="text-[8px] text-muted-foreground mb-2">
                2024.03.15 학습 기록
              </div>
              <p>
                오늘은 문법 ~てしまう를 배웠다. "완료" 또는 "유감"의 
                의미를 나타내는 표현이다. 예: 食べてしまった (다 먹어버렸다)
              </p>
            </div>
            <div className="text-center text-muted-foreground">
              <p className="text-[10px]">▶ 꾸준히 하면 늘어요! がんばって! ◀</p>
            </div>
          </div>
        </PixelCard>
      </div>
    </Layout>
  );
};

export default Japanese;
