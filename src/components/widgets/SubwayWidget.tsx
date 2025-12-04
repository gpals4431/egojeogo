import { PixelCard } from "@/components/PixelCard";

const subwayLines = [
  { line: "1호선", status: "정상", emoji: "🔵" },
  { line: "2호선", status: "정상", emoji: "🟢" },
  { line: "3호선", status: "지연", emoji: "🟠" },
  { line: "4호선", status: "정상", emoji: "🔷" },
  { line: "5호선", status: "정상", emoji: "🟣" },
];

export function SubwayWidget() {
  return (
    <PixelCard title="🚇 서울 지하철 정보" className="h-full">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[14px] text-muted-foreground">실시간 운행정보</span>
        </div>
        
        <div className="space-y-2">
          {subwayLines.map((subway) => (
            <div 
              key={subway.line}
              className="flex items-center justify-between py-1 border-b border-dashed border-border"
            >
              <span className="text-[13px] flex items-center gap-2">
                <span>{subway.emoji}</span>
                {subway.line}
              </span>
              <span 
                className={`px-2 py-0.5 text-[12px] ${
                  subway.status === "정상" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-accent text-accent-foreground animate-pixel-shake"
                }`}
              >
                {subway.status === "정상" ? "✅" : "⚠️"} [{subway.status}]
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-2 border-t-2 border-border text-[12px] text-muted-foreground">
          <p>⏰ 마지막 업데이트: 방금 전</p>
          <p>📍 출처: 서울교통공사</p>
        </div>
      </div>
    </PixelCard>
  );
}
