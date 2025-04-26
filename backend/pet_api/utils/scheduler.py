#!/usr/bin/env python3
import os
import logging
import requests
import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("scheduler.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("appointment_scheduler")

# API base URL (can be overridden by environment variables)
API_BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:5000")

def send_appointment_reminders():
    """
    Send reminders for appointments scheduled for the next day.
    This function runs at 9:00 AM daily.
    """
    try:
        logger.info("Running appointment reminder job")
        
        # Calculate tomorrow's date
        tomorrow = datetime.date.today() + datetime.timedelta(days=1)
        tomorrow_str = tomorrow.strftime("%Y-%m-%d")
        
        # Get appointments for tomorrow
        response = requests.get(f"{API_BASE_URL}/api/appointments/date/{tomorrow_str}")
        
        if response.status_code != 200:
            logger.error(f"Failed to fetch appointments: {response.status_code} - {response.text}")
            return
            
        appointments = response.json()
        
        if not appointments:
            logger.info(f"No appointments scheduled for tomorrow ({tomorrow_str})")
            return
            
        # Send reminder for each appointment
        for appointment in appointments:
            appointment_id = appointment.get("id")
            patient_id = appointment.get("patient_id")
            
            if not appointment_id or not patient_id:
                logger.warning(f"Invalid appointment data: {appointment}")
                continue
                
            # Get patient details to send reminder
            patient_response = requests.get(f"{API_BASE_URL}/api/patients/{patient_id}")
            
            if patient_response.status_code != 200:
                logger.error(f"Failed to fetch patient details: {patient_response.status_code}")
                continue
                
            patient = patient_response.json()
            
            # Send reminder (in a real system, this would integrate with SMS/email service)
            logger.info(f"Sending reminder to {patient.get('name')} for appointment on {tomorrow_str}")
            
            # Update appointment status to indicate reminder was sent
            update_response = requests.put(
                f"{API_BASE_URL}/api/appointments/{appointment_id}/reminder_sent",
                json={"reminder_sent": True}
            )
            
            if update_response.status_code != 200:
                logger.error(f"Failed to update reminder status: {update_response.status_code}")
            else:
                logger.info(f"Successfully updated reminder status for appointment {appointment_id}")
                
        logger.info(f"Processed reminders for {len(appointments)} appointments")
            
    except Exception as e:
        logger.error(f"Error sending appointment reminders: {str(e)}")

def update_appointment_statuses():
    """
    Update status of past appointments to COMPLETED if they haven't been marked yet.
    This job runs daily at midnight.
    """
    try:
        logger.info("Running appointment status update job")
        
        # Get yesterday's date
        yesterday = datetime.date.today() - datetime.timedelta(days=1)
        yesterday_str = yesterday.strftime("%Y-%m-%d")
        
        # Get appointments from yesterday that aren't marked as completed
        response = requests.get(f"{API_BASE_URL}/api/appointments/pending/{yesterday_str}")
        
        if response.status_code != 200:
            logger.error(f"Failed to fetch pending appointments: {response.status_code} - {response.text}")
            return
            
        appointments = response.json()
        
        if not appointments:
            logger.info(f"No pending appointments to update for {yesterday_str}")
            return
            
        # Update each appointment status
        for appointment in appointments:
            appointment_id = appointment.get("id")
            
            if not appointment_id:
                logger.warning(f"Invalid appointment data: {appointment}")
                continue
                
            # Update appointment status to COMPLETED
            update_response = requests.put(
                f"{API_BASE_URL}/api/appointments/{appointment_id}/status",
                json={"status": "COMPLETED"}
            )
            
            if update_response.status_code != 200:
                logger.error(f"Failed to update appointment status: {update_response.status_code}")
            else:
                logger.info(f"Successfully updated status to COMPLETED for appointment {appointment_id}")
                
        logger.info(f"Updated status for {len(appointments)} past appointments")
            
    except Exception as e:
        logger.error(f"Error updating appointment statuses: {str(e)}")

def run_scheduler():
    """
    Initialize and run the appointment scheduler.
    This function sets up two scheduled jobs:
    1. Daily at 9:00 AM: Send reminders for next day's appointments
    2. Daily at midnight: Update status of past appointments
    """
    logger.info("Starting appointment scheduler")
    
    scheduler = BackgroundScheduler()
    
    # Schedule appointment reminders (daily at 9:00 AM)
    scheduler.add_job(
        send_appointment_reminders,
        CronTrigger(hour=9, minute=0),
        id="appointment_reminders",
        replace_existing=True
    )
    
    # Schedule status updates (daily at midnight)
    scheduler.add_job(
        update_appointment_statuses,
        CronTrigger(hour=0, minute=0),
        id="appointment_status_updates",
        replace_existing=True
    )
    
    # Start the scheduler
    scheduler.start()
    logger.info("Appointment scheduler is running. Press Ctrl+C to exit.")
    
    try:
        # Keep the main thread alive
        while True:
            pass
    except (KeyboardInterrupt, SystemExit):
        logger.info("Shutting down appointment scheduler")
        scheduler.shutdown()

if __name__ == "__main__":
    run_scheduler() 