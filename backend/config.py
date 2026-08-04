from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv(".env.local")
load_dotenv()
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR / "output"
OUTPUT_EXCEL = OUTPUT_DIR / "empresas.xlsx"
LOG_FILE = OUTPUT_DIR / "logs.txt"

DUCKDUCKGO_MAX_RESULTS = 5
SEARCH_SUFFIX = "site oficial"

DEFAULT_MAPS_QUERY = "Empresas de Tecnologia em São Paulo"
DEFAULT_MAPS_LIMIT = 10
MAPS_SCROLL_DELAY_SEC = 1.5

# Concurrency for HTTP requests (lightweight, can be higher)
MAX_CONCURRENT_REQUESTS = 5

# Timeout for Playwright page loads (ms)
PAGE_TIMEOUT_MS = 15000

# Timeout for HTTP detail fetches (seconds)
DETAIL_TIMEOUT_SEC = 10

# Timeout for HTTP site crawls (seconds)
CRAWL_TIMEOUT_SEC = 8

CANDIDATE_PATHS = [
    "/",
    "/contato",
    "/contact",
    "/sobre",
]

# User agent for HTTP requests
HTTP_USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
