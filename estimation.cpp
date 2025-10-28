#include <curl/curl.h>
#include <nlohmann/json.hpp>
#include <GeographicLib/Geodesic.hpp>
#include <iostream>
#include <string>

Class GeocodingService {
public:
        GeocodingService(const std::string& apiKey) : apiKey(apiKey) {}
        
}