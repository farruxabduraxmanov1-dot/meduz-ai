import pytest


def pytest_collection_modifyitems(config, items):
    # Auto-mark async tests
    for item in items:
        if "asyncio" in item.keywords:
            continue
        if hasattr(item, "function") and getattr(item.function, "__code__", None):
            if item.function.__code__.co_flags & 0x100:  # CO_COROUTINE
                item.add_marker(pytest.mark.asyncio)
