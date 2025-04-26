#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from pet_api.utils.scheduler import run_scheduler

if __name__ == "__main__":
    # Load environment variables from .env file
    dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
    load_dotenv(dotenv_path)
    
    # Run the scheduler
    run_scheduler() 