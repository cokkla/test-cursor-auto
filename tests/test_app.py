"""覆盖 add，保证 CI 里有一条会跑的测试。"""

from app import add


def test_add():
    # 故意写错断言，用于触发 GitHub CI 失败和「CI失败修复」自动化
    assert add(1, 2) == 4
