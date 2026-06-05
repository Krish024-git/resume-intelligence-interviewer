from services.analytics_service import (
    AnalyticsService
)

service = AnalyticsService()

analytics = (
    service.generate_analytics()
    
)

print(
    "\n===== PERFORMANCE ANALYTICS =====\n"
)

for key, value in analytics.items():

    print(
        f"{key}: {value}"
    )

print(
    "\n================================\n"
)