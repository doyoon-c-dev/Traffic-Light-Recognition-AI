## 📌 Traffic Light Recognition AI (Prototype)

An AI-based system that detects traffic light states (red/green) from images.
이미지를 통해 신호등 적색, 녹색 State를 찾아내는 AI 기반 인식 시스템

## 🧩 목표
이 프로젝트는 모바일 카메라를 사용하여 보행자 교통 신호를 인식함으로써 시각 장애인 사용자를 돕는 것을 목표로 합니다.


## ✨ 특징
- 모바일 카메라를 통한 사진 촬영
- YOLOv5를 사용한 신호등 탐지
- 신호 구분 (적색 / 녹색)
- Bounding Box로 시각화하여 출력

## 🛠 기술 스택
- React Native
- Flask
- YOLOv5

## ⚙️ 설계
- 물체 탐지와 구별을 위해 Yolov5 사용
- 이미지 처리 및 추론을 위한 Flask API 구축
- 데이터 흐름을 위한 백엔드 모바일 프론트엔드와 연결

## 💡 배운 점
- 모바일 프론트엔드, 백엔드, AI모델 통합
- 클라이언트와 서버 간 이미지 데이터 흐름 제어
- 실제 사용 사례에 객체 탐지 적용

## 🚧 한계점
- 음성 안내 기능 부재
- 환경 전반에 걸친 제한된 성능 검증

## 📊 개선할 점
- TTS 기반 음성 안내 기능 추가
- 더 다양한 데이터로 모델 정확도 향상
- 실시간 영상 인식으로 확장
