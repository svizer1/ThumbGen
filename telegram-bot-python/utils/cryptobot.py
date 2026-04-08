"""
CryptoBot API client
"""
import os
import logging
import requests
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

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
        response = requests.post(url, headers=headers, json=data, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        logger.error("CryptoBot API timeout")
        return None
    except requests.RequestException as e:
        logger.error(f"CryptoBot API error: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in create_invoice: {e}")
        return None


def get_invoice(invoice_id: str) -> Optional[Dict[str, Any]]:
    """Get invoice status"""
    url = f"{CRYPTOBOT_API_URL}/getInvoices"
    headers = {"Crypto-Pay-API-Token": CRYPTOBOT_API_TOKEN}
    params = {"invoice_ids": invoice_id}
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.Timeout:
        logger.error("CryptoBot API timeout")
        return None
    except requests.RequestException as e:
        logger.error(f"CryptoBot API error: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in get_invoice: {e}")
        return None
