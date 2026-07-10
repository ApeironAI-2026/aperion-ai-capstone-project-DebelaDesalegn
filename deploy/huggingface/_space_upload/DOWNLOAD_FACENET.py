"""Download FaceNet512 ONNX model into models_local/."""

from pathlib import Path
import shutil
import subprocess
import sys
import urllib.request

ROOT = Path(__file__).resolve().parent
TARGET = ROOT / "models_local" / "facenet512.onnx"

# Public FaceNet512 ONNX (NCHW, 160x160, 512-d output)
HF_URL = "https://huggingface.co/haikalmumtaz/facenet-onnx/resolve/main/facenet.onnx"


def _download_huggingface() -> None:
    print(f"Downloading FaceNet ONNX from Hugging Face...\n  {HF_URL}")
    TARGET.parent.mkdir(parents=True, exist_ok=True)
    tmp = TARGET.with_suffix(".onnx.partial")
    urllib.request.urlretrieve(HF_URL, tmp)
    tmp.replace(TARGET)
    print(f"Saved model to {TARGET} ({TARGET.stat().st_size:,} bytes)")


def _download_kaggle() -> bool:
    print("Attempting Kaggle download (requires kaggle CLI + credentials)...")
    try:
        subprocess.run(
            [
                "kaggle",
                "kernels",
                "output",
                "ruicampos/facenet512",
                "-p",
                str(TARGET.parent),
            ],
            check=True,
        )
        downloaded = next(TARGET.parent.glob("*.onnx"), None)
        if downloaded and downloaded != TARGET:
            shutil.move(str(downloaded), str(TARGET))
        if TARGET.exists():
            print(f"Saved model to {TARGET}")
            return True
    except Exception as exc:
        print(f"Kaggle download failed: {exc}")
    return False


def main() -> None:
    TARGET.parent.mkdir(parents=True, exist_ok=True)

    if TARGET.exists() and TARGET.stat().st_size > 1_000_000:
        print(f"Model already exists at {TARGET}")
        return

    try:
        _download_huggingface()
        return
    except Exception as hf_exc:
        print(f"Hugging Face download failed: {hf_exc}")

    if _download_kaggle():
        return

    print(
        "\nManual steps:\n"
        "1. Download facenet.onnx from:\n"
        f"   {HF_URL}\n"
        "   or Kaggle: ruicampos/facenet512\n"
        f"2. Place it at: {TARGET}\n"
    )
    sys.exit(1)


if __name__ == "__main__":
    main()
