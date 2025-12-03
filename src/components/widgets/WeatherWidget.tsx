import { PixelCard } from "@/components/PixelCard";
import { useState, useEffect } from "react";

export function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const weather = {
    condition: "sunny",
    temp: 12,
    high: 15,
    low: 8,
    humidity: 45,
    description: "맑음",
    emoji: "☀️",
  };

  return (
    <PixelCard title="🌤️ 오늘의 날씨" className="h-full">
      <div className="text-center">
        <div className="mb-2 text-[8px] text-muted-foreground">
          📅 {currentTime.toLocaleDateString("ko-KR", { 
            year: "numeric",
            month: "long", 
            day: "numeric",
            weekday: "long"
          })}
        </div>

        <div className="flex items-center justify-center gap-4 my-4">
          <div className="text-5xl animate-float">
            {weather.emoji}
          </div>
          <div className="text-left">
            <div className="text-2xl pixel-text-shadow">{weather.temp}°C</div>
            <div className="text-[10px]">{weather.description}</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-2 border-t-2 border-dashed border-border">
          <div>
            <div className="text-[8px] text-muted-foreground">🔺 최고</div>
            <div className="text-accent">{weather.high}°</div>
          </div>
          <div>
            <div className="text-[8px] text-muted-foreground">🔻 최저</div>
            <div className="text-secondary">{weather.low}°</div>
          </div>
          <div>
            <div className="text-[8px] text-muted-foreground">💧 습도</div>
            <div>{weather.humidity}%</div>
          </div>
        </div>

        <div className="mt-4 text-[8px] text-muted-foreground">
          📍 위치: 서울시
        </div>
      </div>
    </PixelCard>
  );
}
