#!/usr/bin/env python3
"""
Fetch WebArena leaderboard data from Google Sheets and save as JSON.
"""

import pandas as pd
import json
from datetime import datetime

# Google Sheets CSV export URL
SPREADSHEET_ID = "1M801lEpBbKSNwP-vDBkC_pF7LdyGU1f_ufZb_NWNBZQ"
GID = "0"
CSV_URL = f"https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/export?format=csv&gid={GID}"

def fetch_and_save_leaderboard():
    """Fetch leaderboard data and save as JSON."""
    try:
        # Read CSV from Google Sheets
        df = pd.read_csv(CSV_URL)

        # Clean up data: remove rows where Model is NaN or empty
        df_clean = df[df['Model'].notna() & (df['Model'].str.strip() != '')]

        # Remove rows with NaN Success Rate (these are usually headers/notes)
        df_clean = df_clean[df_clean['Success Rate (%)'].notna()]

        # Replace NaN with None for JSON serialization
        df_clean = df_clean.where(pd.notna(df_clean), None)

        # Convert to JSON format
        data = {
            "last_updated": datetime.utcnow().isoformat() + "Z",
            "leaderboard": df_clean.to_dict('records')
        }

        # Save to file
        with open('data/leaderboard.json', 'w') as f:
            json.dump(data, f, indent=2)

        print(f"✅ Successfully fetched {len(df_clean)} entries")
        print(f"📊 Columns: {list(df_clean.columns)}")

    except Exception as e:
        print(f"❌ Error fetching data: {e}")
        raise

if __name__ == "__main__":
    fetch_and_save_leaderboard()
