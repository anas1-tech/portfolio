import os
import sys

# Make the backend root importable (this file lives in backend/api/).
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

from config.wsgi import application  # noqa: E402

# Vercel's Python runtime serves the WSGI callable named "app".
app = application
