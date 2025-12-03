import { PixelCard } from "@/components/PixelCard";

const newsItems = [
  { 
    id: 1, 
    title: "코스피, 오늘 2,500선 돌파...",
    time: "10분 전",
    category: "증시"
  },
  { 
    id: 2, 
    title: "환율, 1,300원대 안착 전망",
    time: "25분 전",
    category: "외환"
  },
  { 
    id: 3, 
    title: "美 연준, 금리 동결 시사...",
    time: "1시간 전",
    category: "글로벌"
  },
  { 
    id: 4, 
    title: "반도체 수출 증가세 지속",
    time: "2시간 전",
    category: "산업"
  },
];

export function NewsWidget() {
  return (
    <PixelCard title="경제 뉴스" className="h-full">
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📰</span>
          <span className="text-[10px] text-muted-foreground">실시간 경제소식</span>
        </div>

        <ul className="space-y-3">
          {newsItems.map((news, index) => (
            <li 
              key={news.id}
              className="group cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <span className="text-primary shrink-0">▶</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate group-hover:text-primary transition-colors">
                    {news.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[8px] text-muted-foreground">
                    <span className="px-1 bg-muted">[{news.category}]</span>
                    <span>{news.time}</span>
                  </div>
                </div>
              </div>
              {index < newsItems.length - 1 && (
                <div className="mt-2 border-b border-dashed border-border" />
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-2 border-t-2 border-border">
          <button className="w-full py-2 text-[10px] text-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors">
            [ 더 보기 → ]
          </button>
        </div>
      </div>
    </PixelCard>
  );
}
