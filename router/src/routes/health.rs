use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
};
use crate::db::AppState;
use crate::services::HealthService;
use crate::models::HealthResponse;

pub async fn health_check(
    State(app_state): State<AppState>,
) -> Result<Json<HealthResponse>, (StatusCode, Json<serde_json::Value>)> {
    let health_service = HealthService::new(app_state);
    
    match health_service.check_health().await {
        Ok(health_data) => Ok(Json(health_data)),
        Err(err) => {
            tracing::error!("Health check failed: {}", err);
            Err((
                StatusCode::SERVICE_UNAVAILABLE,
                Json(serde_json::json!({
                    "status": "unhealthy",
                    "timestamp": chrono::Utc::now().to_rfc3339(),
                    "error": err.to_string()
                }))
            ))
        }
    }
}