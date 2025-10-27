import requests
import os

def lambda_handler(event, context):
    ec2_url = os.environ.get("EC2_URL", "http://localhost:5500/api/v1/subscriptions/upcoming-renewals")
    try:
        response = requests.get(ec2_url)
        return {
            "statusCode": response.status_code,
            "body": response.text
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": f"Error: {str(e)}"
        }