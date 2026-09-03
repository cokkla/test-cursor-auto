"""覆盖 add，保证 CI 里有一条会跑的测试。"""

from app import add


def test_add():
    # 1 + 2 应为 3
    assert add(1, 2) == 3
