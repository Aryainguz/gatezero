use std::sync::Arc;
use chrono::Utc;
use crate::models::{HealthCheck, HealthResponse};
use crate::db::MongoClient;
use anyhow::Result;

pub struct HealthService {
    mongo: Arc<MongoClient>,
    start_time: std::time::Instant,
}

impl HealthService {
    pub fn new(mongo: Arc<MongoClient>) -> Self {
        Self {
            mongo,
            start_time: std::time::Instant::now(),
        }
    }

    pub async fn check_health(&self) -> Result<HealthResponse> {
        let is_connected = self.mongo.is_connected().await;
        let db_status = if is_connected { "connected" } else { "disconnected" };
        
        let uptime = self.start_time.elapsed().as_secs();

        // Log health check to database if connected
        if is_connected {
            let health_check = HealthCheck {
                id: None,
                service: "router".to_string(),
                status: "healthy".to_string(),
                timestamp: Utc::now(),
                details: Some(serde_json::json!({
                    "database": db_status,
                    "uptime": uptime
                })),
            };

            let collection = self.mongo.health_collection();
            let _ = collection.insert_one(health_check, None).await;
        }

        Ok(HealthResponse {
            status: if is_connected { "healthy".to_string() } else { "unhealthy".to_string() },
            timestamp: Utc::now().to_rfc3339(),
            database: db_status.to_string(),
            uptime,
        })
    }
}