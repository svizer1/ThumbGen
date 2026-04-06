"""
Firebase operations for Telegram bot
"""
import os
from datetime import datetime
from typing import Optional, Dict, Any
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin
cred_dict = {
    "type": "service_account",
    "project_id": os.getenv('FIREBASE_ADMIN_PROJECT_ID'),
    "private_key_id": "4b56f0d78f",
    "private_key": os.getenv('FIREBASE_ADMIN_PRIVATE_KEY').replace('\\n', '\n'),
    "client_email": os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL'),
    "client_id": "324938535273",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.getenv('FIREBASE_ADMIN_CLIENT_EMAIL')}"
}

try:
    cred = credentials.Certificate(cred_dict)
    firebase_admin.initialize_app(cred)
except ValueError:
    # Already initialized
    pass

db = firestore.client()


def get_or_create_user(telegram_id: int, first_name: str, username: Optional[str]) -> Dict[str, Any]:
    """Get or create telegram user in Firestore"""
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        user_data = {
            'telegramId': telegram_id,
            'username': username,
            'firstName': first_name,
            'language': 'ru',
            'createdAt': datetime.now(),
            'lastInteraction': datetime.now(),
            'firebaseUid': None,
        }
        user_ref.set(user_data)
        return user_data
    else:
        user_ref.update({'lastInteraction': datetime.now()})
        return user_doc.to_dict()


def get_user_balance(telegram_id: int) -> int:
    """Get user's credit balance"""
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        return 0
    
    firebase_uid = user_doc.to_dict().get('firebaseUid')
    if not firebase_uid:
        return 0
    
    firebase_user_ref = db.collection('users').document(firebase_uid)
    firebase_user_doc = firebase_user_ref.get()
    
    if not firebase_user_doc.exists:
        return 0
    
    return firebase_user_doc.to_dict().get('credits', 0)


def get_user_subscription(telegram_id: int) -> Optional[Dict[str, Any]]:
    """Get user's subscription info"""
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        return None
    
    firebase_uid = user_doc.to_dict().get('firebaseUid')
    if not firebase_uid:
        return None
    
    firebase_user_ref = db.collection('users').document(firebase_uid)
    firebase_user_doc = firebase_user_ref.get()
    
    if not firebase_user_doc.exists:
        return None
    
    return firebase_user_doc.to_dict().get('subscription')


def is_account_linked(telegram_id: int) -> bool:
    """Check if Telegram account is linked to website"""
    user_ref = db.collection('telegram_users').document(str(telegram_id))
    user_doc = user_ref.get()
    
    if not user_doc.exists:
        return False
    
    firebase_uid = user_doc.to_dict().get('firebaseUid')
    return firebase_uid is not None


def link_account(telegram_id: int, link_token: str) -> bool:
    """Link Telegram account using token from website"""
    # Get token from Firestore
    token_ref = db.collection('link_tokens').document(link_token)
    token_doc = token_ref.get()
    
    if not token_doc.exists:
        return False
    
    token_data = token_doc.to_dict()
    
    # Check if already used
    if token_data.get('used'):
        return False
    
    # Check expiration
    expires_at = token_data.get('expiresAt')
    if expires_at and expires_at < datetime.now():
        return False
    
    firebase_uid = token_data.get('userId')
    
    # Link accounts
    telegram_user_ref = db.collection('telegram_users').document(str(telegram_id))
    telegram_user_ref.set({
        'firebaseUid': firebase_uid,
        'linkedAt': datetime.now(),
    }, merge=True)
    
    # Update website user
    user_ref = db.collection('users').document(firebase_uid)
    user_ref.update({
        'telegramId': telegram_id,
    })
    
    # Mark token as used
    token_ref.update({'used': True})
    
    return True


def get_all_users() -> list:
    """Get all telegram users"""
    users_ref = db.collection('telegram_users')
    docs = users_ref.stream()
    return [doc.to_dict() for doc in docs]


def get_statistics() -> Dict[str, int]:
    """Get bot statistics"""
    users = get_all_users()
    total_users = len(users)
    linked_users = sum(1 for u in users if u.get('firebaseUid'))
    
    return {
        'total_users': total_users,
        'linked_users': linked_users,
        'unlinked_users': total_users - linked_users
    }


def get_user_info(telegram_id: int) -> Optional[Dict[str, Any]]:
    """Get full user info including website data"""
    telegram_user_ref = db.collection('telegram_users').document(str(telegram_id))
    telegram_user_doc = telegram_user_ref.get()
    
    if not telegram_user_doc.exists:
        return None
    
    telegram_data = telegram_user_doc.to_dict()
    firebase_uid = telegram_data.get('firebaseUid')
    
    if not firebase_uid:
        return telegram_data
    
    # Get website user data
    user_ref = db.collection('users').document(firebase_uid)
    user_doc = user_ref.get()
    
    if user_doc.exists:
        website_data = user_doc.to_dict()
        telegram_data['credits'] = website_data.get('credits', 0)
        telegram_data['subscription'] = website_data.get('subscription')
        telegram_data['totalGenerations'] = website_data.get('totalGenerations', 0)
    
    return telegram_data
