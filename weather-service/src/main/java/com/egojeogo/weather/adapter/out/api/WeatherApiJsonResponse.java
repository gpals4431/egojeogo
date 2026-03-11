package com.egojeogo.weather.adapter.out.api;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class WeatherApiJsonResponse {
    
    @JsonProperty("response")
    private Response response;
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Response {
        @JsonProperty("body")
        private Body body;
    }
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {
        @JsonProperty("items")
        private Items items;
    }
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Items {
        @JsonProperty("item")
        private List<Item> item;
    }
    
    @Getter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {
        @JsonProperty("baseDate")
        private String baseDate;
        
        @JsonProperty("baseTime")
        private String baseTime;
        
        @JsonProperty("fcstDate")
        private String fcstDate;
        
        @JsonProperty("fcstTime")
        private String fcstTime;
        
        @JsonProperty("category")
        private String category;
        
        @JsonProperty("fcstValue")
        private String fcstValue;
    }
    
    public List<WeatherApiDto> toDtoList() {
        if (response == null || response.body == null || 
            response.body.items == null || response.body.items.item == null) {
            return List.of();
        }
        
        return response.body.items.item.stream()
            .map(item -> new WeatherApiDto(
                item.baseDate,
                item.baseTime,
                item.fcstTime,
                item.fcstDate,
                item.category,
                item.fcstValue
            ))
            .toList();
    }
}
