import importlib
import os
import sys
import unittest


def _options_from_entry(entry):
    """Extract a dict of options from a middleware entry if possible.

    Supports tuple/list entries like (cls, options), attribute-based options
    (options/kwargs/opts), and a last-resort inspection of __dict__ values.
    """
    if isinstance(entry, (list, tuple)) and len(entry) >= 2 and isinstance(entry[1], dict):
        return entry[1]

    for attr in ("options", "kwargs", "opts"):
        val = getattr(entry, attr, None)
        if isinstance(val, dict):
            return val

    md = getattr(entry, "__dict__", None)
    if isinstance(md, dict):
        for v in md.values():
            if isinstance(v, dict):
                return v

    return None


def _scan_list_for_origins(lst):
    for entry in lst or []:
        opts = _options_from_entry(entry)
        if opts and "allow_origins" in opts:
            return opts["allow_origins"]
    return None


def _find_cors_origins(app):
    """Return the configured `allow_origins` from FastAPI/Starlette middleware.

    This function delegates extraction to small helpers to keep its
    cognitive complexity low for static analysis tools.
    """
    origins = _scan_list_for_origins(getattr(app, "user_middleware", []))
    if origins:
        return origins

    return _scan_list_for_origins(getattr(app, "middleware", []))


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
