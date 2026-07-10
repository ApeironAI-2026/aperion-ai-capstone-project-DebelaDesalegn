from fastapi.testclient import TestClient

from backend.main import app
import backend.auth as auth
import backend.config as config


def test_login_and_access_protected_route(monkeypatch):
    monkeypatch.setattr(config, "ADMIN_USERNAME", "admin")
    monkeypatch.setattr(config, "ADMIN_PASSWORD", "secret123")
    monkeypatch.setattr(config, "JWT_SECRET", "test-secret-key-for-jwt")
    monkeypatch.setattr(config, "ADMIN_API_KEY", "")
    monkeypatch.setattr(config, "JWT_EXPIRE_HOURS", 12)

    monkeypatch.setattr(auth, "ADMIN_USERNAME", "admin")
    monkeypatch.setattr(auth, "ADMIN_PASSWORD", "secret123")
    monkeypatch.setattr(auth, "JWT_SECRET", "test-secret-key-for-jwt")
    monkeypatch.setattr(auth, "ADMIN_API_KEY", "")
    monkeypatch.setattr(auth, "JWT_EXPIRE_HOURS", 12)

    with TestClient(app) as client:
        denied = client.get("/attendance/all")
        assert denied.status_code == 401

        bad = client.post(
            "/auth/login",
            json={"username": "admin", "password": "wrong"},
        )
        assert bad.status_code == 401

        login = client.post(
            "/auth/login",
            json={"username": "admin", "password": "secret123"},
        )
        assert login.status_code == 200
        token = login.json()["access_token"]

        ok = client.get(
            "/attendance/all",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert ok.status_code == 200
        assert "records" in ok.json()

        me = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )
        assert me.status_code == 200
        assert me.json()["role"] == "admin"
