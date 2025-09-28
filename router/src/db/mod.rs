use std::sync::Arc;
use mongodb::{Client, Database, Collection};
use anyhow::Result;
use crate::models::HealthCheck;

#[derive(Clone)] 
pub struct MongoClient {
    pub database: Database,
}

impl MongoClient {
    pub async fn new(uri: &str, db_name: &str) -> Result<Self> {
        let client = Client::with_uri_str(uri).await?;
        
        // Test the connection
        client
            .database("admin")
            .run_command(mongodb::bson::doc! {"ping": 1}, None)
            .await?;

        let database = client.database(db_name);

        Ok(MongoClient { database })
    }

    pub fn health_collection(&self) -> Collection<HealthCheck> {
        self.database.collection("health_checks")
    }

    pub async fn is_connected(&self) -> bool {
        self.database
            .run_command(mongodb::bson::doc! {"ping": 1}, None)
            .await
            .is_ok()
    }
}

pub type AppState = Arc<MongoClient>;