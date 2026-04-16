import importlib
import os
import sys


def _find_cors_origins(app):
    for m in getattr(app, "user_middleware", []):
        opts = getattr(m, "options", None)
        if isinstance(opts, dict) and "allow_origins" in opts:
            return opts["allow_origins"]
    return None


def test_main_default_origins():
    # Ensure main uses localhost default when ALLOWED_ORIGINS not set
    if "main" in sys.modules:
        del sys.modules["main"]
    os.environ.pop("ALLOWED_ORIGINS", None)
    import main as main_mod
    importlib.reload(main_mod)

    origins = _find_cors_origins(main_mod.app)
    assert origins == ["http://localhost:3000"]


def test_main_custom_origins():
    if "main" in sys.modules:
        del sys.modules["main"]
    os.environ["ALLOWED_ORIGINS"] = "http://a.com, http://b.com"
    import main as main_mod
    importlib.reload(main_mod)

    origins = _find_cors_origins(main_mod.app)
    assert origins == ["http://a.com", "http://b.com"]
