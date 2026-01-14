import { PixelCard } from "@/components/PixelCard";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

interface Position {
  latitude: number;
  longitude: number;
}

interface WeatherResponse {
  baseDate: string;
  baseTime: string;
  fcstDate: string;
  fcstTime: string;
  temperature: number;
  temperatureMax: number;
  temperatureMin: number;
  humidity: number;
  rainAmount: number;
  skyStatus: string;
  rainStatus: string;
  windStatus: string;
  isNight: boolean;
  regionParent: string;
  regionChild: string;
}

// 날씨 상태에 따른 이모지 매핑
const getWeatherEmoji = (skyStatus: string, rainStatus: string, isNight: boolean): string => {
  if (rainStatus && rainStatus !== "없음") {
    if (rainStatus.includes("비")) return "🌧️";
    if (rainStatus.includes("눈")) return "❄️";
    return "🌦️";
  }
  
  if (skyStatus) {
    if (skyStatus.includes("맑음")) return isNight ? "🌙" : "☀️";
    if (skyStatus.includes("구름많음")) return isNight ? "☁️" : "⛅";
    if (skyStatus.includes("흐림")) return "☁️";
  }
  
  return isNight ? "🌙" : "☀️";
};

// 날씨 상태 설명
const getWeatherDescription = (skyStatus: string, rainStatus: string): string => {
  if (rainStatus && rainStatus !== "없음") {
    return rainStatus;
  }
  return skyStatus || "날씨 정보 없음";
};

export function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [position, setPosition] = useState<Position | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation을 지원하지 않는 브라우저입니다.");
      setIsLoadingLocation(false);
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const success = (pos: GeolocationPosition) => {
      setPosition({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      console.log("position", pos);
      setIsLoadingLocation(false);
    };

    const error = (err: GeolocationPositionError) => {
      let errorMessage = "위치를 가져올 수 없습니다.";
      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "위치 권한이 거부되었습니다.";
          break;
        case err.POSITION_UNAVAILABLE:
          errorMessage = "위치 정보를 사용할 수 없습니다.";
          break;
        case err.TIMEOUT:
          errorMessage = "위치 요청 시간이 초과되었습니다.";
          break;
      }
      setLocationError(errorMessage);
      setIsLoadingLocation(false);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    // 위치 추적을 지속적으로 업데이트하려면 watchPosition 사용 가능
    // const watchId = navigator.geolocation.watchPosition(success, error, options);
    // return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 위치 정보가 있을 때만 날씨 데이터 가져오기
  const { data: weatherDataList, isLoading: isLoadingWeather } = useQuery<WeatherResponse[]>({
    queryKey: ["weather", position?.latitude, position?.longitude],
    queryFn: async () => {
      if (!position) return [];
      const response = await apiClient.get<WeatherResponse[]>(
        `/weather?lat=${position.latitude}&lon=${position.longitude}`
      );
      return response || [];
    },
    enabled: !!position, // position이 있을 때만 실행
  });

  // 현재 시간에 가장 가까운 날씨 데이터 찾기
  const currentWeather = useMemo(() => {
    if (!weatherDataList || weatherDataList.length === 0) return null;
    
    const now = new Date();
    const currentDate = now.toISOString().slice(0, 10).replace(/-/g, "");
    const currentHour = now.getHours();
    
    // 현재 날짜와 시간에 가장 가까운 데이터 찾기
    let closest: WeatherResponse | null = null;
    let minDiff = Infinity;
    
    for (const weather of weatherDataList) {
      const fcstDate = weather.fcstDate;
      const fcstTime = parseInt(weather.fcstTime.slice(0, 2));
      
      // 같은 날짜인 경우
      if (fcstDate === currentDate) {
        const diff = Math.abs(fcstTime - currentHour);
        if (diff < minDiff) {
          minDiff = diff;
          closest = weather;
        }
      }
      // 오늘보다 미래인 경우 (가장 가까운 미래 데이터)
      else if (fcstDate > currentDate) {
        // 미래 날짜의 경우, 가장 이른 시간의 데이터를 선택
        const dateDiff = parseInt(fcstDate) - parseInt(currentDate);
        const timeDiff = fcstTime - currentHour;
        // 날짜 차이를 시간 단위로 변환 (24시간 * 날짜 차이)
        const totalDiff = dateDiff * 24 + timeDiff;
        
        // 미래 데이터 중 가장 가까운 것 선택
        if (totalDiff >= 0 && totalDiff < minDiff) {
          minDiff = totalDiff;
          closest = weather;
        }
      }
    }
    
    // 같은 날짜의 데이터를 찾지 못한 경우, 가장 가까운 미래 데이터 반환
    // 또는 가장 첫 번째 데이터 반환
    return closest || weatherDataList[0];
  }, [weatherDataList, currentTime]);

  // 날짜별로 그룹화 (최대 3일)
  const weatherByDate = useMemo(() => {
    if (!weatherDataList || weatherDataList.length === 0) return [];
    
    const grouped = new Map<string, WeatherResponse[]>();
    
    for (const weather of weatherDataList) {
      const date = weather.fcstDate;
      if (!grouped.has(date)) {
        grouped.set(date, []);
      }
      grouped.get(date)!.push(weather);
    }
    
    // 날짜순으로 정렬하고 최대 3일만 반환
    const sortedDates = Array.from(grouped.keys()).sort().slice(0, 3);
    return sortedDates.map(date => ({
      date,
      weathers: grouped.get(date)!.sort((a, b) => 
        parseInt(a.fcstTime.slice(0, 2)) - parseInt(b.fcstTime.slice(0, 2))
      ),
    }));
  }, [weatherDataList]);

  return (
    <PixelCard title="🌤️ 날씨 정보" className="h-full flex flex-col">
      <div className="flex-1 flex flex-col">
        {/* 실시간 날씨 정보 */}
        <div className="text-center mb-4 pb-4 border-b-2 border-dashed border-border">
          <div className="mb-2 text-[8px] text-muted-foreground">
            📅 {currentTime.toLocaleDateString("ko-KR", { 
              year: "numeric",
              month: "long", 
              day: "numeric",
              weekday: "long"
            })}
          </div>

          <div className="flex items-center justify-center gap-4 my-4">
            {isLoadingWeather ? (
              <div className="text-center text-muted-foreground text-[10px]">
                날씨 정보를 가져오는 중...
              </div>
            ) : currentWeather ? (
              <>
                <div className="text-5xl animate-float">
                  {getWeatherEmoji(currentWeather.skyStatus, currentWeather.rainStatus, currentWeather.isNight)}
                </div>
                <div className="text-left">
                  <div className="text-2xl pixel-text-shadow">
                    {Math.round(currentWeather.temperature)}°C
                  </div>
                  <div className="text-[10px]">
                    {getWeatherDescription(currentWeather.skyStatus, currentWeather.rainStatus)}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground text-[10px]">
                날씨 정보가 없습니다.
              </div>
            )}
          </div>

          {currentWeather && (
            <div className="grid grid-cols-3 gap-2 text-center mt-4 pt-2">
              <div>
                <div className="text-[8px] text-muted-foreground">🔺 최고</div>
                <div className="text-accent">{Math.round(currentWeather.temperatureMax)}°</div>
              </div>
              <div>
                <div className="text-[8px] text-muted-foreground">🔻 최저</div>
                <div className="text-secondary">{Math.round(currentWeather.temperatureMin)}°</div>
              </div>
              <div>
                <div className="text-[8px] text-muted-foreground">💧 습도</div>
                <div>{Math.round(currentWeather.humidity)}%</div>
              </div>
            </div>
          )}
        </div>

        {/* 3일치 스크롤 가능한 날씨 정보 */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-[8px] text-muted-foreground mb-2 sticky top-0 bg-card pb-1">
            📊 3일 날씨 예보
          </div>
          {isLoadingWeather ? (
            <div className="text-center text-muted-foreground text-[8px] py-4">
              날씨 정보를 가져오는 중...
            </div>
          ) : weatherByDate.length > 0 ? (
            <div className="space-y-3">
              {weatherByDate.map(({ date, weathers }) => {
                const dateObj = new Date(
                  parseInt(date.slice(0, 4)),
                  parseInt(date.slice(4, 6)) - 1,
                  parseInt(date.slice(6, 8))
                );
                const dateStr = dateObj.toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "short"
                });
                
                return (
                  <div key={date} className="border-2 border-dashed border-border p-2">
                    <div className="text-[9px] font-bold mb-2 text-accent">
                      📅 {dateStr}
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {weathers.map((weather, idx) => {
                        const hour = parseInt(weather.fcstTime.slice(0, 2));
                        const timeStr = `${hour.toString().padStart(2, "0")}:00`;
                        
                        return (
                          <div
                            key={`${weather.fcstDate}-${weather.fcstTime}-${idx}`}
                            className="flex items-center justify-between text-[8px] py-1 px-2 hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground w-10">{timeStr}</span>
                              <span className="text-lg">
                                {getWeatherEmoji(weather.skyStatus, weather.rainStatus, weather.isNight)}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-bold">{Math.round(weather.temperature)}°</span>
                              <span className="text-muted-foreground text-[7px]">
                                {getWeatherDescription(weather.skyStatus, weather.rainStatus)}
                              </span>
                              {weather.rainAmount > 0 && (
                                <span className="text-[7px] text-accent">💧 {weather.rainAmount}mm</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-muted-foreground text-[8px] py-4">
              날씨 정보가 없습니다.
            </div>
          )}
        </div>

        {/* 위치 정보 */}
        <div className="mt-4 pt-2 border-t-2 border-dashed border-border text-[8px] text-muted-foreground">
          {isLoadingLocation ? (
            <span>📍 위치 정보 가져오는 중...</span>
          ) : locationError ? (
            <span className="text-accent">⚠️ {locationError}</span>
          ) : position ? (
            <span>
              📍 {currentWeather?.regionParent || ""} {currentWeather?.regionChild || ""}
            </span>
          ) : (
            <span>📍 위치: 서울시</span>
          )}
        </div>
      </div>
    </PixelCard>
  );
}
