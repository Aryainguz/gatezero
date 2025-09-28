mod db;
mod models;
mod routes;
mod services;

use std::sync::Arc;
use std::env;
use axum::{
    routing::get,
    Router,
};
use tower_http::cors::CorsLayer;
use tracing_subscriber;

use db::MongoClient;
use routes::health_check;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables from .env file
    dotenv::dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Load environment variables
    let mongo_uri = env::var("MONGO_URI")
        .unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    let db_name = env::var("DB_NAME")
        .unwrap_or_else(|_| "gatezero_db".to_string());
    let port = env::var("LOOKUP_PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse::<u16>()
        .unwrap_or(3001);

    // Initialize MongoDB connection
    let mongo_client = Arc::new(MongoClient::new(&mongo_uri, &db_name).await?);

    // Create the application router
    let app = Router::new()
        .route("/health", get(health_check))
        .layer(CorsLayer::permissive())
        .with_state(mongo_client);

    // Start the server
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await?;
    
    tracing::info!("Router Service running on port {}", port);
    
    axum::serve(listener, app).await?;

    Ok(())
}