# Traffic Light Recognition AI

스마트폰 카메라로 횡단보도 보행자 신호등을 촬영하고, YOLOv5 모델로 신호등을 탐지해 결과 이미지를 보여주는 프로토타입입니다. 시각 장애인이 보행 신호를 확인하는 데 도움을 주는 것을 목표로 합니다.

> 현재 저장소에는 음성 안내 기능이 없습니다. 모델 가중치 파일도 포함되어 있지 않으므로, 추론을 실행하려면 별도로 준비해야 합니다.

## 주요 기능

- Expo 카메라 권한 요청 및 사진 촬영
- 촬영한 이미지를 Base64 형식으로 변환해 서버에 전송
- Flask-SocketIO를 통한 클라이언트와 서버 간 이미지 송수신
- 서버에서 입력 이미지를 전처리한 뒤 YOLOv5 탐지 실행
- 탐지 결과 이미지에 바운딩 박스를 표시해 앱에 반환
- 촬영 결과 확인 후 다시 촬영

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| 앱 | React Native, Expo, TypeScript |
| 카메라 | Expo Camera |
| 실시간 통신 | Socket.IO, Flask-SocketIO |
| 서버 | Python, Flask |
| 이미지 처리 | Pillow, NumPy |
| 객체 탐지 | PyTorch, YOLOv5 |

## 동작 구조

```text
스마트폰 카메라
  └─ Expo 앱에서 사진 촬영 및 Base64 인코딩
       └─ Socket.IO 이벤트 `image`
            └─ Flask-SocketIO 서버
                 ├─ 이미지 방향 보정 및 608 × 608 리사이즈
                 ├─ YOLOv5 탐지 실행
                 └─ 바운딩 박스가 그려진 결과 이미지를 `bbox` 이벤트로 반환
```

앱은 결과 이미지를 받아 화면에 표시합니다. 현재 구현은 이미지 기반 촬영 및 탐지 흐름이며, 연속 실시간 영상 분석이나 음성 안내를 제공하지 않습니다.

## 저장소 구조

```text
.
├── app/                         # Expo 앱 화면
├── components/                  # 공통 UI 컴포넌트
├── hooks/                       # 앱 훅
├── constants/                   # 테마 등 상수
└── flask-server/
    ├── app.py                   # Flask-SocketIO 서버 및 탐지 처리
    └── yolov5-master/           # YOLOv5 코드
```

## 실행 방법

### 사전 준비

- Node.js 및 npm
- Python 환경
- YOLOv5가 지원하는 PyTorch 및 Python 의존성
- 프로젝트에 맞게 학습된 YOLOv5 체크포인트

### 1. 모델 파일 준비

서버 코드는 다음 경로의 모델 파일을 사용합니다.

```text
flask-server/yolov5-master/best.pt
```

체크포인트는 저장소에 포함되어 있지 않습니다. 직접 학습한 모델 또는 사용 권한이 있는 호환 체크포인트를 준비해 위 경로에 배치하세요.

### 2. Flask 서버 실행

```bash
cd flask-server
python -m venv .venv
```

가상 환경을 활성화한 뒤 의존성을 설치합니다.

```bash
pip install -r yolov5-master/requirements.txt
pip install flask flask-cors flask-socketio pillow numpy
```

서버를 실행합니다.

```bash
python app.py
```

서버는 `0.0.0.0:5000`에서 Socket.IO 연결을 기다립니다. PyTorch 설치 방법은 실행 환경의 OS와 CPU/GPU에 맞춰 [PyTorch 설치 안내](https://pytorch.org/get-started/locally/)를 확인하세요.

### 3. 앱 실행

별도 터미널에서 저장소 루트로 이동해 실행합니다.

```bash
npm install
npm start
```

Expo 안내에 따라 웹 또는 모바일 기기에서 앱을 실행하세요. 앱과 Flask 서버가 서로 연결 가능한 네트워크에 있어야 합니다. 현재 Socket.IO 주소는 앱이 실행되는 호스트명과 포트 `5000`을 사용하므로, 실제 모바일 기기에서 연결할 때는 서버 주소 설정을 기기 네트워크 환경에 맞춰야 합니다.

## 현재 한계와 개선 방향

- **음성 안내 미구현:** 탐지 결과를 음성으로 전달하는 TTS 기능이 필요합니다.
- **모델 가중치 별도 준비:** `best.pt`가 저장소에 포함되어 있지 않아 별도 배포나 학습 절차가 필요합니다.
- **인식 성능 검증 미기재:** 저장소에 정량 평가 결과가 없어 정확도 수치를 제시하지 않습니다. 다양한 조명, 거리, 가림 조건에서 평가가 필요합니다.
- **실시간 영상 미지원:** 현재는 카메라 영상 스트림이 아니라 촬영한 단일 이미지를 서버로 보내 처리합니다.
- **보행자 신호 상태 전달:** 코드에서 확인되는 동작은 탐지 결과 이미지 반환입니다. 색상 상태를 별도 데이터로 분류·전달하는 기능은 문서화하지 않았습니다.

## 라이선스 및 모델 출처

저장소에는 YOLOv5 코드가 포함되어 있으므로, 재사용하거나 배포할 때는 해당 코드의 라이선스와 사용한 모델 체크포인트의 라이선스를 각각 확인하세요.
