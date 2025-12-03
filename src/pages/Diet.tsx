import { Layout } from "@/components/Layout";
import { PixelCard } from "@/components/PixelCard";

const todayMeals = [
  { time: "아침", menu: "통밀빵, 계란, 우유", cal: 450, emoji: "🌅" },
  { time: "점심", menu: "닭가슴살 샐러드, 현미밥", cal: 550, emoji: "☀️" },
  { time: "저녁", menu: "연어구이, 야채볶음", cal: 480, emoji: "🌙" },
  { time: "간식", menu: "그릭요거트, 견과류", cal: 200, emoji: "🍪" },
];

const Diet = () => {
  const totalCal = todayMeals.reduce((sum, meal) => sum + meal.cal, 0);
  const goalCal = 2000;
  const progress = Math.min((totalCal / goalCal) * 100, 100);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-sm md:text-base pixel-text-shadow inline-block px-4 py-2 bg-primary text-primary-foreground">
            🍱 식단 / DIET 🍱
          </h1>
        </div>

        {/* Calorie Tracker */}
        <PixelCard title="🔥 오늘의 칼로리" className="mb-6">
          <div className="text-center mb-4">
            <div className="text-2xl pixel-text-shadow">
              🍽️ {totalCal} / {goalCal} kcal
            </div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {goalCal - totalCal > 0 
                ? `${goalCal - totalCal} kcal 남음 💪` 
                : "목표 달성! 🎉🥳"}
            </div>
          </div>
          <div className="h-8 bg-muted pixel-inset mb-2">
            <div 
              className={`h-full transition-all flex items-center justify-center ${
                progress >= 100 ? "bg-accent" : "bg-primary"
              }`}
              style={{ width: `${progress}%` }}
            >
              <span className="text-[8px] text-primary-foreground">
                {Math.round(progress)}% 🏃
              </span>
            </div>
          </div>
          <div className="flex justify-between text-[8px] text-muted-foreground">
            <span>0</span>
            <span>500</span>
            <span>1000</span>
            <span>1500</span>
            <span>2000 🎯</span>
          </div>
        </PixelCard>

        {/* Today's Meals */}
        <PixelCard title="🍴 오늘의 식사" className="mb-6">
          <div className="space-y-3">
            {todayMeals.map((meal, index) => (
              <div 
                key={index}
                className="flex items-center justify-between py-2 border-b border-dashed border-border"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-[8px]">
                    {meal.emoji} {meal.time}
                  </span>
                  <span>{meal.menu}</span>
                </div>
                <span className="text-muted-foreground">
                  {meal.cal} kcal
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 pixel-btn bg-secondary text-secondary-foreground">
            [ ➕ 식사 추가하기 ]
          </button>
        </PixelCard>

        {/* Weekly Stats */}
        <PixelCard title="📊 주간 통계">
          <div className="space-y-2">
            <div className="flex items-end justify-between h-24 px-2">
              {["월", "화", "수", "목", "금", "토", "일"].map((day, i) => {
                const heights = [75, 85, 70, 90, 80, 95, 60];
                const emojis = ["😊", "😄", "🙂", "😤", "😎", "🤩", "😴"];
                return (
                  <div key={day} className="flex flex-col items-center gap-1">
                    <span className="text-xs">{emojis[i]}</span>
                    <div 
                      className="w-6 bg-primary transition-all"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-[8px]">{day}</span>
                  </div>
                );
              })}
            </div>
            <div className="text-center text-[10px] text-muted-foreground pt-2 border-t border-border">
              📈 평균 섭취량: 1,850 kcal/일
            </div>
          </div>
        </PixelCard>
      </div>
    </Layout>
  );
};

export default Diet;
