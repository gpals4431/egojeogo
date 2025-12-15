import { PixelCard } from "@/components/PixelCard";
import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// 타입 정의
interface SubwayArrivalInfo {
  subwayId: string;
  subwayName: string;
  updnLine: string;
  trainLineNm: string;
  statnNm: string;
  bstatnNm: string;
  arvlMsg2: string;
  arvlMsg3: string;
  btrainSttus: string;
  btrainNo: string;
}

interface SubwayArrivalResponse {
  stationName: string;
  upLine: SubwayArrivalInfo[];
  downLine: SubwayArrivalInfo[];
}

// 호선별 색상 매핑
const getLineColor = (subwayId: string) => {
  const colors: Record<string, string> = {
    "1001": "bg-blue-600",      // 1호선
    "1002": "bg-green-500",     // 2호선
    "1003": "bg-orange-500",    // 3호선
    "1004": "bg-sky-400",       // 4호선
    "1005": "bg-purple-600",    // 5호선
    "1006": "bg-amber-700",     // 6호선
    "1007": "bg-olive-600",     // 7호선
    "1008": "bg-pink-500",      // 8호선
    "1009": "bg-yellow-500",    // 9호선
    "1063": "bg-teal-500",      // 경의중앙선
    "1065": "bg-sky-500",       // 공항철도
    "1067": "bg-green-600",     // 경춘선
    "1075": "bg-yellow-400",    // 수인분당선
    "1077": "bg-red-500",       // 신분당선
  };
  return colors[subwayId] || "bg-gray-500";
};

export function SubwayWidget() {
  const station = "외대앞";
  const { data, isLoading, error } = useQuery({
    queryKey: ["subwayLines", station],
    queryFn: () => apiClient.get<SubwayArrivalResponse>(`/subway/real-time?station=${station}`),
    refetchInterval: 3000, // 3초마다 갱신
  });

  if (isLoading) {
    return (
      <PixelCard title="🚇 서울 지하철 정보" className="h-full">
        <div className="text-center py-4 text-muted-foreground">
          ⏳ 로딩 중...
        </div>
      </PixelCard>
    );
  }

  if (error) {
    return (
      <PixelCard title="🚇 서울 지하철 정보" className="h-full">
        <div className="text-center py-4 text-accent">
          ❌ 데이터를 불러올 수 없습니다
        </div>
      </PixelCard>
    );
  }

  const subwayData = data as SubwayArrivalResponse;

  return (
    <PixelCard title="🚇 서울 지하철 정보" className="h-full">
      <div className="space-y-3">
        {/* 상행 열차 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="text-primary">⬆️ 상행</span>
          </div>
          {subwayData?.upLine?.length > 0 ? (
            subwayData.upLine.map((train, idx) => (
              <TrainItem key={`up-${idx}`} train={train} />
            ))
          ) : (
            <div className="text-[11px] text-muted-foreground py-1">도착 예정 열차 없음</div>
          )}
        </div>

        {/* 역 이름 (가운데) */}
        <div className="flex items-center justify-center py-2">
          <div className="flex-1 h-[2px] bg-border"></div>
          <div className="px-4 py-1 bg-primary text-primary-foreground text-[14px] font-bold mx-2">
            🚉 {subwayData?.stationName || station}역
          </div>
          <div className="flex-1 h-[2px] bg-border"></div>
        </div>

        {/* 하행 열차 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
            <span className="text-accent">⬇️ 하행</span>
          </div>
          {subwayData?.downLine?.length > 0 ? (
            subwayData.downLine.map((train, idx) => (
              <TrainItem key={`down-${idx}`} train={train} />
            ))
          ) : (
            <div className="text-[11px] text-muted-foreground py-1">도착 예정 열차 없음</div>
          )}
        </div>

        <div className="mt-4 pt-2 border-t-2 border-border text-[10px] text-muted-foreground">
          <p>⏰ 3초마다 자동 갱신</p>
          <p>📍 출처: 서울교통공사</p>
        </div>
      </div>
    </PixelCard>
  );
}

// 열차 아이템 컴포넌트
function TrainItem({ train }: { train: SubwayArrivalInfo }) {
  return (
    <div className="flex items-center gap-2 py-1 border-b border-dashed border-border">
      {/* 호선 배지 */}
      <span className={`${getLineColor(train.subwayId)} text-white text-[10px] px-1.5 py-0.5 rounded`}>
        {train.subwayName}
      </span>
      
      {/* 열차 정보 */}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] truncate">
          {train.bstatnNm}행
          {train.btrainSttus === "급행" && (
            <span className="ml-1 text-accent text-[10px]">[급행]</span>
          )}
        </div>
      </div>
      
      {/* 도착 정보 */}
      <span className="text-[11px] px-2 py-0.5 bg-muted text-muted-foreground whitespace-nowrap">
        {train.arvlMsg2}
      </span>
    </div>
  );
}
