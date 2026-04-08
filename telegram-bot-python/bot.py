"""
ThumbnailGen Telegram Bot
Main entry point with webhook support for Render.com
"""
import os
import sys
import signal
import logging
import asyncio
from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.webhook.aiohttp_server import SimpleRequestHandler, setup_application
from aiohttp import web, ClientSession
from dotenv import load_dotenv

# Import handlers
from handlers import start, balance, purchase, admin, broadcast

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Configuration
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
PORT = int(os.getenv('PORT', 0))
WEBHOOK_URL = os.getenv('WEBHOOK_URL', '')
WEBHOOK_PATH = os.getenv('WEBHOOK_PATH', '/webhook')

# Initialize bot and dispatcher
bot = Bot(token=TELEGRAM_BOT_TOKEN, parse_mode=ParseMode.HTML)
storage = MemoryStorage()
dp = Dispatcher(storage=storage)

# Register routers
dp.include_router(start.router)
dp.include_router(balance.router)
dp.include_router(purchase.router)
dp.include_router(admin.router)
dp.include_router(broadcast.router)

# Global variables
keep_alive_task = None
shutdown_event = asyncio.Event()


async def health_check(request):
    """Health check endpoint for Render"""
    return web.json_response({
        'status': 'ok',
        'bot': 'ThumbnailGen',
        'mode': 'webhook' if PORT else 'polling'
    })


async def root_handler(request):
    """Root endpoint"""
    return web.Response(text='ThumbnailGen Telegram Bot is running!')


async def keep_alive():
    """Keep-alive task to prevent Render from sleeping"""
    await asyncio.sleep(60)  # Wait 1 minute after start
    
    while not shutdown_event.is_set():
        try:
            async with ClientSession() as session:
                url = f"{WEBHOOK_URL}/health" if WEBHOOK_URL else f"http://localhost:{PORT}/health"
                async with session.get(url, timeout=10) as resp:
                    if resp.status == 200:
                        logger.info(f"Keep-alive ping successful to {url}")
                    else:
                        logger.warning(f"Keep-alive ping failed: {resp.status}")
        except Exception as e:
            logger.error(f"Keep-alive error: {e}")
        
        # Wait 10 minutes
        try:
            await asyncio.wait_for(shutdown_event.wait(), timeout=600)
            break
        except asyncio.TimeoutError:
            continue


async def on_startup():
    """Setup webhook on startup"""
    if PORT and WEBHOOK_URL:
        webhook_url = f"{WEBHOOK_URL}{WEBHOOK_PATH}"
        await bot.set_webhook(webhook_url, drop_pending_updates=True)
        logger.info(f"Webhook set to: {webhook_url}")
        
        # Start keep-alive task
        global keep_alive_task
        keep_alive_task = asyncio.create_task(keep_alive())
        logger.info("Keep-alive task started")
    else:
        logger.info("Starting in polling mode")


async def on_shutdown():
    """Cleanup on shutdown"""
    logger.info("Shutting down...")
    
    # Stop keep-alive
    if keep_alive_task:
        shutdown_event.set()
        try:
            await asyncio.wait_for(keep_alive_task, timeout=5)
        except asyncio.TimeoutError:
            keep_alive_task.cancel()
    
    # Delete webhook
    if PORT and WEBHOOK_URL:
        try:
            await bot.delete_webhook()
            logger.info("Webhook deleted")
        except Exception as e:
            logger.error(f"Error deleting webhook: {e}")
    
    # Close bot session
    try:
        await bot.session.close()
        logger.info("Bot session closed")
    except Exception as e:
        logger.error(f"Error closing bot session: {e}")


def signal_handler(signum, frame):
    """Handle shutdown signals"""
    logger.info(f"Received signal {signum}")
    sys.exit(0)


async def main_webhook():
    """Run bot in webhook mode"""
    app = web.Application()
    
    # Setup webhook handler
    webhook_handler = SimpleRequestHandler(dispatcher=dp, bot=bot)
    webhook_handler.register(app, path=WEBHOOK_PATH)
    
    # Add routes
    app.router.add_get('/health', health_check)
    app.router.add_get('/', root_handler)
    
    # Setup application
    setup_application(app, dp, bot=bot)
    
    # Startup
    await on_startup()
    
    # Run web server
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PORT)
    
    logger.info(f"Starting webhook server on port {PORT}")
    await site.start()
    
    # Keep running
    try:
        await asyncio.Event().wait()
    finally:
        await on_shutdown()


async def main_polling_with_web():
    """Run bot in polling mode but with a web server for Render health checks"""
    app = web.Application()
    app.router.add_get('/health', health_check)
    app.router.add_get('/', root_handler)
    
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PORT)
    
    logger.info(f"Starting health check server on port {PORT}")
    await site.start()
    
    logger.info("Bot started in polling mode!")
    try:
        # Start keep-alive task
        global keep_alive_task
        keep_alive_task = asyncio.create_task(keep_alive())
        
        await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
    finally:
        await bot.session.close()
        await runner.cleanup()

async def main():
    """Main function with webhook support"""
    if PORT and WEBHOOK_URL:
        await main_webhook()
    elif PORT:
        await main_polling_with_web()
    else:
        logger.info("Bot started in polling mode!")
        try:
            await dp.start_polling(bot, allowed_updates=dp.resolve_used_update_types())
        finally:
            await bot.session.close()


if __name__ == '__main__':
    # Setup signal handlers
    signal.signal(signal.SIGTERM, signal_handler)
    signal.signal(signal.SIGINT, signal_handler)
    
    # Auto-restart loop
    restart_count = 0
    
    while True:
        try:
            logger.info(f"Bot starting... (restart #{restart_count})")
            asyncio.run(main())
            break  # Normal exit
        except KeyboardInterrupt:
            logger.info("Bot stopped by user")
            break
        except Exception as e:
            restart_count += 1
            logger.error(f"Bot crashed (restart #{restart_count}): {e}", exc_info=True)
            logger.info("Restarting in 5 seconds...")
            asyncio.run(asyncio.sleep(5))
