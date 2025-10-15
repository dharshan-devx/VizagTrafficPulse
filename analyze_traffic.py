#!/usr/bin/env python3
"""
High-Accuracy Traffic Analysis CLI
Uses scikit-learn and pandas for precise ML performance metrics
"""

import argparse
import json
import sys
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import LabelEncoder

# === Debug info for Render logs ===
print(">>> Python executable:", sys.executable, file=sys.stderr)
print(">>> Python version:", sys.version, file=sys.stderr)
print(">>> sys.path:", sys.path, file=sys.stderr)
print(">>> Current working directory:", os.getcwd(), file=sys.stderr)

def load_and_process_data(csv_path):
    """
    Load and process traffic data with flexible column name handling
    Based on the high-accuracy Python notebook implementation
    """
    try:
        df = pd.read_csv(csv_path)
        
        # Handle flexible column names for different CSV files
        column_mapping = {
            # Standard names that might appear in CSVs
            "Accidents_Reported": "Accidents",
            "Queue_Density": "Queue", 
            "Stop_Density": "StopDensity",
            # Alternative names
            "accidents_reported": "Accidents",
            "queue_density": "Queue",
            "stop_density": "StopDensity",
            "accidents": "Accidents",
            "queue": "Queue",
            "stopdensity": "StopDensity",
            "fatalities": "Fatalities"
        }
        
        # Apply column renaming
        df = df.rename(columns=column_mapping)
        
        # Ensure required columns exist, set defaults if missing
        required_columns = {
            "Date": pd.Timestamp.now(),
            "Hour": 0,
            "Location": "Unknown",
            "Queue": 0.0,
            "StopDensity": 0.0,
            "Accidents": 0,
            "Fatalities": 0
        }
        
        for col, default_val in required_columns.items():
            if col not in df.columns:
                if isinstance(default_val, (int, float)):
                    df[col] = default_val
                else:
                    df[col] = "Unknown"
        
        # Parse dates
        df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
        
        # Convert numeric columns
        numeric_columns = ["Hour", "Queue", "StopDensity", "Accidents", "Fatalities"]
        for col in numeric_columns:
            df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
        
        # Encode categorical variables
        le = LabelEncoder()
        df["Location_enc"] = le.fit_transform(df["Location"].astype(str))
        
        # Congestion score calculation (high-accuracy method from notebook)
        # Use Queue as primary metric, fallback to StopDensity
        if df["Queue"].sum() > 0:
            base = df["Queue"]
        elif df["StopDensity"].sum() > 0:
            base = df["StopDensity"]
        else:
            base = pd.Series(0, index=df.index)
        
        # Calculate percentiles using pandas (more accurate than JS approximation)
        p1, p99 = base.quantile([0.01, 0.99])
        if p99 == p1:
            df["congestion_score"] = 0.0
        else:
            df["congestion_score"] = ((base - p1) / (p99 - p1)).clip(0, 1)
        
        # Congestion levels
        df["congestion_level"] = df["congestion_score"].apply(
            lambda x: "Green (Low)" if x < 0.33 else ("Yellow (Medium)" if x < 0.66 else "Red (High)")
        )
        
        return df, len(df)
        
    except Exception as e:
        return None, str(e)

def train_ml_models(df):
    """
    Train high-accuracy ML models using scikit-learn
    Returns precise RMSE and R² metrics
    """
    try:
        # Features as defined in the high-accuracy notebook
        features = ["Hour", "Queue", "StopDensity", "Accidents", "Fatalities", "Location_enc"]
        target = "congestion_score"
        
        # Check if we have enough data
        if len(df) < 10:
            return {
                "Linear Regression": {"RMSE": 0.0, "R2": 0.0},
                "Decision Tree": {"RMSE": 0.0, "R2": 0.0}, 
                "Random Forest": {"RMSE": 0.0, "R2": 0.0}
            }
        
        X = df[features]
        y = df[target]
        
        # Remove any NaN values
        mask = ~(X.isna().any(axis=1) | y.isna())
        X = X[mask]
        y = y[mask]
        
        if len(X) < 5:  # Need minimum data for train/test split
            return {
                "Linear Regression": {"RMSE": 0.0, "R2": 0.0},
                "Decision Tree": {"RMSE": 0.0, "R2": 0.0},
                "Random Forest": {"RMSE": 0.0, "R2": 0.0}
            }
        
        # Train/test split (80/20) with random_state for reproducibility
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Initialize models with same parameters as high-accuracy notebook
        models = {
            "Linear Regression": LinearRegression(),
            "Decision Tree": DecisionTreeRegressor(random_state=42),
            "Random Forest": RandomForestRegressor(n_estimators=100, random_state=42)
        }
        
        results = {}
        for name, model in models.items():
            try:
                # Train the model
                model.fit(X_train, y_train)
                
                # Make predictions
                preds = model.predict(X_test)
                
                # Calculate metrics
                rmse = np.sqrt(mean_squared_error(y_test, preds))
                r2 = r2_score(y_test, preds)
                
                # Round to 3 decimal places for consistency
                results[name] = {
                    "RMSE": round(float(rmse), 3),
                    "R2": round(float(r2), 3)
                }
                
            except Exception as model_error:
                # Fallback to zero if individual model fails
                results[name] = {"RMSE": 0.0, "R2": 0.0}
        
        return results
        
    except Exception as e:
        # Return zero metrics if training fails
        return {
            "Linear Regression": {"RMSE": 0.0, "R2": 0.0},
            "Decision Tree": {"RMSE": 0.0, "R2": 0.0},
            "Random Forest": {"RMSE": 0.0, "R2": 0.0}
        }

def calculate_indicators(df):
    """Calculate key traffic indicators"""
    try:
        return {
            "totalAccidents": int(df["Accidents"].sum()),
            "totalFatalities": int(df["Fatalities"].sum()),
            "avgCongestion": round(float(df["congestion_score"].mean()), 3)
        }
    except:
        return {
            "totalAccidents": 0,
            "totalFatalities": 0,
            "avgCongestion": 0.0
        }

def main():
    parser = argparse.ArgumentParser(description="High-Accuracy Traffic Analysis")
    parser.add_argument("--csv", required=True, help="Path to CSV file")
    parser.add_argument("--mode", default="metrics", choices=["metrics", "full"], 
                       help="Output mode: metrics only or full data")
    
    args = parser.parse_args()
    
    try:
        # Load and process data
        df, result = load_and_process_data(args.csv)
        
        if df is None:
            # Error loading data
            output = {
                "success": False,
                "error": f"Failed to load CSV: {result}",
                "mlPerformance": {
                    "Linear Regression": {"RMSE": 0.0, "R2": 0.0},
                    "Decision Tree": {"RMSE": 0.0, "R2": 0.0},
                    "Random Forest": {"RMSE": 0.0, "R2": 0.0}
                },
                "indicators": {
                    "totalAccidents": 0,
                    "totalFatalities": 0,
                    "avgCongestion": 0.0
                },
                "recordsProcessed": 0
            }
        else:
            # Successful processing
            ml_performance = train_ml_models(df)
            indicators = calculate_indicators(df)
            
            output = {
                "success": True,
                "mlPerformance": ml_performance,
                "indicators": indicators,
                "recordsProcessed": len(df),
                "message": f"High-accuracy analysis completed for {len(df)} records"
            }
            
            # Include processed data if full mode requested
            if args.mode == "full":
                output["processedData"] = df.to_dict('records')
        
        # Output JSON to stdout
        print(json.dumps(output, indent=2))
        
    except Exception as e:
        # Fallback error output
        error_output = {
            "success": False,
            "error": str(e),
            "mlPerformance": {
                "Linear Regression": {"RMSE": 0.0, "R2": 0.0},
                "Decision Tree": {"RMSE": 0.0, "R2": 0.0},
                "Random Forest": {"RMSE": 0.0, "R2": 0.0}
            },
            "indicators": {
                "totalAccidents": 0,
                "totalFatalities": 0,
                "avgCongestion": 0.0
            },
            "recordsProcessed": 0
        }
        print(json.dumps(error_output, indent=2))
        sys.exit(1)

if __name__ == "__main__":
    main()
