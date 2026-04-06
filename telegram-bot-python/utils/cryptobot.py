"""
CryptoBot API client
"""
import os
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

CRYPTOBOT_API_TOKEN = os.getenv('CRYPTOBOT_API_TOKEN')
CRYPTOBOT_API_URL = "https://pay.crypt.bot/api"


def create_invoice(
    amount: float,
    currency: str,
    description: str,
    payload: str
) -> Optional[Dict[str, Any]]:
    """Create CryptoBot invoice"""
    url = f"{CRYPTOBOT_API_URL}/createInvoice"
    headers = {"Crypto-Pay-API-Token": CRYPTOBOT_API_TOKEN}
    data = {
        "asset": currency,
        "amount": str(amount),
        "description": description,
        "payload": payload,
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error creating invoice: {e}")
        return None


def get_invoice(invoice_id: str) -> Optional[Dict[str, Any]]:
    """Get invoice status"""
    url = f"{CRYPTOBOT_API_URL}/getInvoices"
    headers = {"Crypto-Pay-API-Token": CRYPTOBOT_API_TOKEN}
    params = {"invoice_ids": invoice_id}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error getting invoice: {e}")
        return None
