# Appointment Scheduler

The appointment scheduler is a background service that automates two key functions:
1. Sending reminders for upcoming appointments
2. Updating the status of past appointments

## Features

### Appointment Reminders
- Automatically sends reminders at 9:00 AM for all appointments scheduled for the next day
- Prevents duplicate reminders by tracking which reminders have already been sent
- Logs reminder activities for audit and debugging purposes

### Status Updates
- Automatically updates the status of appointments to "COMPLETED" once the appointment date has passed
- Runs daily at midnight to ensure timely updates
- Only updates appointments that haven't been manually marked with a different status

## Setup and Configuration

### Prerequisites
- Python 3.8 or higher
- Running instance of the Pet Clinic API
- Network access to the API endpoints

### Environment Variables
Create or update the `.env` file in the backend directory with these variables:

```
API_BASE_URL=http://localhost:8000  # Base URL of your API
REMINDER_ENDPOINT=/api/appointments/reminder  # Endpoint for sending reminders
STATUS_UPDATE_ENDPOINT=/api/appointments/update-status  # Endpoint for updating statuses
LOG_LEVEL=INFO  # Optional: Set to DEBUG for more detailed logs
```

### Installation
Install the required dependencies:

```bash
pip install apscheduler python-dotenv requests
```

## Running the Scheduler

### Starting the Scheduler
To run the scheduler:

```bash
python backend/run_scheduler.py
```

The scheduler will start in the foreground and display logs in the console.

### Running as a Background Service
For production environments, we recommend setting up the scheduler as a service:

#### Linux (systemd)
Create a service file at `/etc/systemd/system/appointment-scheduler.service`:

```
[Unit]
Description=Pet Clinic Appointment Scheduler
After=network.target

[Service]
User=<your_user>
WorkingDirectory=/path/to/project
ExecStart=/usr/bin/python3 /path/to/project/backend/run_scheduler.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl enable appointment-scheduler.service
sudo systemctl start appointment-scheduler.service
```

## Logging

Logs are saved to a file named `scheduler.log` in the same directory as the scheduler script and displayed in the console. These logs contain information about:

- Reminders sent to patients
- Appointment status updates
- API connection issues
- Scheduler start/stop events
- Any errors encountered during operation

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify the API is running
   - Check that the URL in `.env` is correct
   - Ensure network connectivity between scheduler and API

2. **No Reminders Being Sent**
   - Check if there are any upcoming appointments in the system
   - Verify the time on the server (reminders are sent at 9:00 AM)
   - Look for error messages in the logs

3. **Status Not Updating**
   - Ensure the scheduler has been running for at least 24 hours
   - Check if the endpoint for updating statuses is working correctly
   - Verify that appointments exist in the system

For persistent issues, consult the logs for detailed error messages and timestamps. 