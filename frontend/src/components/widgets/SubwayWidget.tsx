import { PixelCard } from "@/components/PixelCard";
import { apiClient } from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

// 타입 정의
interface SubwayArrivalInfo {
  lineName: string;
  updnLine: string;
  trainLineNm: string;
  statnNm: string;
  bstatnNm: string;
  arvlMsg2: string;
  arvlMsg3: string;
  btrainSttus: string;
  btrainNo: string;
}

// 같은 방향으로 그룹화된 열차들
interface TrainGroup {
  lineName: string;
  direction: string;      // 외선, 내선, 상행, 하행
  destination: string;    // 종착역 (성수행 등)
  stationName: string;   // 해당 그룹의 역 이름
  trains: SubwayArrivalInfo[];
}

// updnLine 값을 기준으로 상행/하행 그룹 분류
const isUpDirection = (updnLine: string) => ["상행", "외선"].includes(updnLine);

// 호선별 색상 매핑
const getLineColor = (lineName: string) => {
  const colors: Record<string, string> = {
    "1호선": "bg-blue-600",
    "2호선": "bg-green-500",
    "3호선": "bg-orange-500",
    "4호선": "bg-sky-400",
    "5호선": "bg-purple-600",
    "6호선": "bg-amber-700",
    "7호선": "bg-olive-600",
    "8호선": "bg-pink-500",
    "9호선": "bg-yellow-500",
    "경의중앙선": "bg-teal-500",
    "공항철도": "bg-sky-500",
    "경춘선": "bg-green-600",
    "수인분당선": "bg-yellow-400",
    "신분당선": "bg-red-500",
    "우이신설선": "bg-lime-500",
    "서해선": "bg-green-400",
    "김포골드라인": "bg-amber-500",
    "신림선": "bg-blue-400",
  };
  return colors[lineName] || "bg-gray-500";
};

// 도착 시간(분)을 추출
const getMinutesFromMsg = (arvlMsg2: string): number => {
  const minMatch = arvlMsg2.match(/(\d+)분/);
  if (minMatch) return parseInt(minMatch[1]);
  
  if (arvlMsg2.includes("도착") || arvlMsg2.includes("진입")) return 0;
  if (arvlMsg2.includes("출발") && !arvlMsg2.includes("전역")) return -1;
  if (arvlMsg2.includes("전역 출발")) return 0.5;
  if (arvlMsg2.includes("전역 도착") || arvlMsg2.includes("전역 진입")) return 1;
  
  return 5; // 기본값
};

// 열차가 이동 중인지 확인
const isTrainMoving = (arvlMsg2: string): boolean => {
  return arvlMsg2.includes("출발") || arvlMsg2.includes("분") || arvlMsg2.includes("번째");
};

// 호선 목록 (표시용과 전송용)
const SUBWAY_LINES = [
  { value: "1", label: "1호선" },
  { value: "2", label: "2호선" },
  { value: "3", label: "3호선" },
  { value: "4", label: "4호선" },
  { value: "5", label: "5호선" },
  { value: "6", label: "6호선" },
  { value: "7", label: "7호선" },
  { value: "8", label: "8호선" },
  { value: "9", label: "9호선" },
  { value: "경의중앙선", label: "경의중앙선" },
  { value: "공항철도", label: "공항철도" },
  { value: "경춘선", label: "경춘선" },
  { value: "수인분당선", label: "수인분당선" },
  { value: "신분당선", label: "신분당선" },
  { value: "우이신설선", label: "우이신설선" },
  { value: "서해선", label: "서해선" },
  { value: "김포골드라인", label: "김포골드라인" },
  { value: "신림선", label: "신림선" }
];

// 방향 목록
const DIRECTIONS = ["상행", "하행"];

export function SubwayWidget() {
  const station = "신림";
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["subwayLines", station],
    queryFn: () => apiClient.get<SubwayArrivalInfo[]>(`/subway/favorite-station`),
    // refetchInterval: 3000,
  });

  // 관심역 등록 mutation (별도 API 호출, 자동 갱신 없음)
  const registerMutation = useMutation({
    mutationFn: async (data: { stationName: string; line: string; upDownLine: string }) => {
      return apiClient.post(`/subway/favorite-station`, data);
    },
    onSuccess: () => {
      setIsModalOpen(false);
      // 등록 성공 후 사용자가 직접 새로고침하거나 기다리면 자동으로 갱신됨 (refetchInterval)
    },
  });

  const { upGroups, downGroups, stationName } = useMemo(() => {
    const arrivals = (data as SubwayArrivalInfo[]) || [];
    const stationName = arrivals[0]?.statnNm || station;
    
    // 방향 + 호선별로 그룹화
    const groupMap = new Map<string, TrainGroup>();
    
    arrivals.forEach(train => {
      const key = `${train.lineName}-${train.updnLine}-${train.bstatnNm}`;
      
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          lineName: train.lineName,
          direction: train.updnLine,
          destination: train.bstatnNm,
          stationName: train.statnNm,  // 각 그룹의 실제 역 이름
          trains: [],
        });
      }
      
      groupMap.get(key)!.trains.push(train);
    });
    
    // 도착 시간순 정렬
    groupMap.forEach(group => {
      group.trains.sort((a, b) => getMinutesFromMsg(a.arvlMsg2) - getMinutesFromMsg(b.arvlMsg2));
    });
    
    const groups = Array.from(groupMap.values());
    
    return {
      upGroups: groups.filter(g => isUpDirection(g.direction)),
      downGroups: groups.filter(g => !isUpDirection(g.direction)),
      stationName,
    };
  }, [data, station]);

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

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <PixelCard 
          title="🚇 서울 지하철 정보" 
          className="h-full"
          titleAction={
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-[10px] px-2 hover:bg-primary transition-colors">
                <Plus className="h-3 w-3 mr-1" />
                관심역 등록
              </Button>
            </DialogTrigger>
          }
        >
          <div className="space-y-3">
            {/* 데이터가 없을 때 */}
            {upGroups.length === 0 && downGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-[14px] mb-2">데이터가 없습니다.</p>
                <p className="text-[11px]">위의 버튼을 클릭하여 관심역을 등록하거나 데이터를 확인해주세요.</p>
              </div>
            ) : (
              /* 역 이름 박스 (상행/하행 정보 포함) */
              <div className="border-2 border-primary rounded-xl p-3 bg-primary/5">
                {/* 역 이름 헤더 */}
                <div className="text-center mb-3">
                  <div className="px-4 py-1 bg-primary text-primary-foreground text-[14px] font-bold inline-block rounded-lg">
                    🚉 {stationName}역
                  </div>
                </div>

                {/* 상행/외선 - 데이터가 있을 때만 표시 */}
                {upGroups.length > 0 && (
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span className="text-primary">⬆️ 상행 · 외선</span>
                    </div>
                    {upGroups.map((group, idx) => (
                      <TrainTrackGroup key={`up-${idx}`} group={group} />
                    ))}
                  </div>
                )}

                {/* 구분선 - 상행과 하행 둘 다 있을 때만 표시 */}
                {upGroups.length > 0 && downGroups.length > 0 && (
                  <div className="border-t border-dashed border-border my-3" />
                )}

                {/* 하행/내선 - 데이터가 있을 때만 표시 */}
                {downGroups.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
                      <span className="text-accent">⬇️ 하행 · 내선</span>
                    </div>
                    {downGroups.map((group, idx) => (
                      <TrainTrackGroup key={`down-${idx}`} group={group} />
                    ))}
                  </div>
                )}
              </div>
            )}

          <div className="mt-4 pt-2 border-t-2 border-border text-[10px] text-muted-foreground">
            <p>⏰ 3초마다 자동 갱신</p>
            <p>📍 출처: 서울교통공사</p>
          </div>
        </div>
      </PixelCard>
      <FavoriteStationModal 
        onRegister={(data) => registerMutation.mutate(data)}
        isLoading={registerMutation.isPending}
      />
    </Dialog>
    </>
  );
}

// 관심역 등록 모달 컴포넌트
function FavoriteStationModal({ 
  onRegister, 
  isLoading 
}: { 
  onRegister: (data: { stationName: string; line: string; upDownLine: string }) => void;
  isLoading: boolean;
}) {
  const [stationName, setStationName] = useState("");
  const [selectedLine, setSelectedLine] = useState<string>("");
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [errors, setErrors] = useState<{
    stationName?: string;
    line?: string;
    upDownLine?: string;
  }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!stationName || stationName.trim() === "") {
      newErrors.stationName = "역 이름을 입력해주세요";
    }
    
    if (!selectedLine || selectedLine === "") {
      newErrors.line = "호선을 선택해주세요";
    }
    
    if (!selectedDirection || selectedDirection === "") {
      newErrors.upDownLine = "방향을 선택해주세요";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onRegister({
      stationName: stationName.trim(),
      line: selectedLine,
      upDownLine: selectedDirection,
    });
    
    // 폼 초기화
    setStationName("");
    setSelectedLine("");
    setSelectedDirection("");
    setErrors({});
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>관심역 등록</DialogTitle>
        <DialogDescription>
          지하철 역과 호선, 방향을 선택하여 관심역을 등록하세요.<br />
          역이름 등록시, 역을 제외하고 입력해주세요. (예: 신림역 → 신림)
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="station">
            역 이름 <span className="text-red-500">*</span>
          </Label>
          <Input
            id="station"
            placeholder="예: 신림"
            value={stationName}
            onChange={(e) => {
              setStationName(e.target.value);
              if (errors.stationName) {
                setErrors(prev => ({ ...prev, stationName: undefined }));
              }
            }}
            className={errors.stationName ? "border-red-500" : ""}
            required
          />
          {errors.stationName && (
            <p className="text-[11px] text-red-500">{errors.stationName}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="line">
            호선 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={selectedLine} 
            onValueChange={(value) => {
              setSelectedLine(value);
              if (errors.line) {
                setErrors(prev => ({ ...prev, line: undefined }));
              }
            }}
            required
          >
            <SelectTrigger 
              id="line"
              className={errors.line ? "border-red-500" : ""}
            >
              <SelectValue placeholder="호선을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {SUBWAY_LINES.map((line) => (
                <SelectItem key={line.value} value={line.value}>
                  {line.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.line && (
            <p className="text-[11px] text-red-500">{errors.line}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direction">
            방향 <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={selectedDirection} 
            onValueChange={(value) => {
              setSelectedDirection(value);
              if (errors.upDownLine) {
                setErrors(prev => ({ ...prev, upDownLine: undefined }));
              }
            }}
            required
          >
            <SelectTrigger 
              id="direction"
              className={errors.upDownLine ? "border-red-500" : ""}
            >
              <SelectValue placeholder="방향을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {DIRECTIONS.map((direction) => (
                <SelectItem key={direction} value={direction}>
                  {direction}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.upDownLine && (
            <p className="text-[11px] text-red-500">{errors.upDownLine}</p>
          )}
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "등록 중..." : "등록"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// 통합 트랙 컴포넌트 (같은 방향의 모든 열차를 하나의 트랙에 표시)
function TrainTrackGroup({ 
  group
}: { 
  group: TrainGroup;
}) {
  const lineColor = getLineColor(group.lineName);
  const stationName = group.stationName;  // 그룹의 실제 역 이름 사용
  
  // 역 목록 생성 (현재역 + 열차들이 위치한 역들)
  const stations = useMemo(() => {
    const stationSet = new Set<string>();
    stationSet.add(stationName); // 현재역은 항상 포함
    
    group.trains.forEach(train => {
      if (train.arvlMsg3 && train.arvlMsg3 !== stationName) {
        stationSet.add(train.arvlMsg3);
      }
    });
    
    // 도착 시간순으로 정렬 (먼 역이 왼쪽)
    const stationArray = Array.from(stationSet);
    return stationArray.sort((a, b) => {
      if (a === stationName) return 1;  // 현재역은 항상 오른쪽
      if (b === stationName) return -1;
      
      // 해당 역에 있는 열차의 도착 시간으로 정렬
      const trainA = group.trains.find(t => t.arvlMsg3 === a);
      const trainB = group.trains.find(t => t.arvlMsg3 === b);
      const timeA = trainA ? getMinutesFromMsg(trainA.arvlMsg2) : 0;
      const timeB = trainB ? getMinutesFromMsg(trainB.arvlMsg2) : 0;
      return timeB - timeA; // 도착 시간 긴 순 (먼 역이 왼쪽)
    });
  }, [group.trains, stationName]);

  return (
    <div className="border border-border rounded p-2 bg-card/50">
      {/* 상단: 호선 + 종착역 */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`${lineColor} text-white text-[10px] px-1.5 py-0.5 rounded`}>
          {group.lineName}
        </span>
        <span className="text-[12px]">
          {group.destination}행
          <span className="text-muted-foreground text-[10px] ml-1">({group.direction})</span>
        </span>
      </div>

      {/* 노선도 트랙 */}
      <div className="relative h-10 bg-muted/30 rounded overflow-hidden">
        {/* 트랙 라인 */}
        <div className={`absolute top-4 left-2 right-2 h-1 ${lineColor} opacity-30 rounded-full`} />
        
        {/* 역 표시 */}
        <div className="absolute inset-x-2 top-0 h-full flex items-start justify-between pt-2">
          {stations.map((station, idx) => {
            const isCurrent = station === stationName;
            const position = stations.length === 1 ? 100 : (idx / (stations.length - 1)) * 100;
            
            return (
              <div 
                key={station} 
                className="flex flex-col items-center"
                style={{ 
                  position: 'absolute',
                  left: `${position}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className={`
                  rounded-full 
                  ${isCurrent 
                    ? `w-3 h-3 ${lineColor} ring-2 ring-primary ring-offset-1 ring-offset-background` 
                    : `w-2 h-2 ${lineColor} opacity-60`
                  }
                `} />
                <span className={`
                  text-[8px] mt-0.5 whitespace-nowrap
                  ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}
                `}>
                  {station}
                </span>
              </div>
            );
          })}
        </div>

        {/* 열차 아이콘들 */}
        {group.trains.map((train, idx) => {
          const stationIdx = stations.findIndex(s => s === train.arvlMsg3);
          const currentIdx = stations.findIndex(s => s === stationName);
          
          // 위치 계산
          let position: number;
          if (train.arvlMsg3 === stationName || stationIdx === -1) {
            // 현재역에 도착/진입한 경우
            position = 100;
          } else {
            // 해당 역 위치 기준
            const basePosition = (stationIdx / (stations.length - 1)) * 100;
            // 출발 상태면 약간 오른쪽으로
            if (train.arvlMsg2.includes("출발")) {
              const nextPosition = ((stationIdx + 1) / (stations.length - 1)) * 100;
              position = basePosition + (nextPosition - basePosition) * 0.3;
            } else {
              position = basePosition;
            }
          }
          
          const moving = isTrainMoving(train.arvlMsg2);
          
          return (
            <div 
              key={train.btrainNo}
              className="absolute top-2 transition-all duration-[2000ms] ease-in-out z-20"
              style={{ left: `calc(${position}% - 6px)` }}
            >
              <span className={`text-sm ${moving ? 'animate-train-move' : ''}`}>
                🚃
              </span>
            </div>
          );
        })}
      </div>

      {/* 도착 정보 리스트 */}
      <div className="mt-2 pt-2 border-t border-dashed border-border">
        <div className="text-[9px] text-muted-foreground mb-1">도착 예정</div>
        <div className="space-y-1">
          {group.trains.map((train) => (
            <ArrivalInfoItem key={train.btrainNo} train={train} />
          ))}
        </div>
      </div>
    </div>
  );
}

// 도착 정보 아이템 컴포넌트
function ArrivalInfoItem({ train }: { train: SubwayArrivalInfo }) {
  return (
    <div className="flex items-center justify-between text-[10px]">
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">{train.btrainNo}열차</span>
        {train.btrainSttus === "급행" && (
          <span className="text-accent text-[9px]">[급행]</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-[9px]">{train.arvlMsg3}</span>
        <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-medium">
          {train.arvlMsg2}
        </span>
      </div>
    </div>
  );
}
