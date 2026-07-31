from pathlib import Path
from dotenv import load_dotenv
import os

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

MAX_CONCURRENT_PAGES = 2
PAGE_TIMEOUT_MS = 15000

CANDIDATE_PATHS = [
    "/",
    "/contato",
    "/contact",
    "/sobre",
]
