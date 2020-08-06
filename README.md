# T.Viewer - Tizen Log Viewer

[![Travis](https://travis-ci.org/msaltnet/T.Viewer.svg?branch=master&style=flat-square&colorB=green)](https://travis-ci.org/msaltnet/T.Viewer)
[![license](https://img.shields.io/github/license/msaltnet/T.Viewer.svg?style=flat-square)](https://github.com/msaltnet/T.Viewer/blob/master/LICENSE)
![language](https://img.shields.io/github/languages/top/msaltnet/T.Viewer.svg?style=flat-square&colorB=green)

Cross Platform Tizen Log Viewer T.Viewer를 소개합니다. **타이젠의 `dlog` 메시지를 보다 쉽고 편하게 확인 할 수 있는 데스크탑 어플리케이션입니다.** 사용중 불편 사항, 개선 의견, 버그 신고는 [이슈](https://github.com/msaltnet/T.Viewer/issues)를 생성해 주세요. 소스 코드는 MIT 라이센스로 모두에게 공개되어 있습니다. 

![T.Viewer Screenshot](https://user-images.githubusercontent.com/9311990/89435285-a35fbb80-d77f-11ea-9b78-02d1e29a2390.PNG)

## 설치하기
### 리눅스
`tviewer-setup-{version}.AppImage` 다운로드 후 실행

### 윈도우
`tviewer-setup-{version}.exe` 다운로드 후 실행하여 설치 후 실행

[주요 기능 및 사용법](https://github.com/msaltnet/T.Viewer/wiki/%EC%A3%BC%EC%9A%94-%EA%B8%B0%EB%8A%A5-%EB%B0%8F-%EC%82%AC%EC%9A%A9%EB%B2%95)

## 사용법
❗ **타겟 디바이스와의 SDB 연결을 먼저 확인하세요!**

![](https://user-images.githubusercontent.com/9311990/89434866-0ac93b80-d77f-11ea-8edf-dcea680d6055.gif)

1. Connection State Indicator
   - 전원 스위치와 연계 동작
1. Log Level Filter
   - Verbose/Debug/Info/Warning/Error/Fatal
   - 선택된 level을 포함한 상위 level을 출력
   - Log Level에 따른 다른 색상 출력
1. Tag Filter
   - 일치하는 Tag를 출력
   - 정규식 지원
1. Message Filter
   - 해당 메시지를 포함하는 로그 출력
   - 정규식 지원
1. Multi-Tab View
   - 각각의 독립된 탭 뷰 제공
1. Setting
   - 글자 크기 조절
   - dlog 버퍼 삭제 후 실행
   - dlog timestamp 출력

## 프로젝트 참여 방법
다양한 방법으로 프로젝트에 참여가 가능합니다.
- [이슈등록](https://github.com/msaltnet/T.Viewer/issues)을 해주셔도 되고, 등록된 이슈를 확인해 주셔도 됩니다.
- [등록 요청된 코드](https://github.com/msaltnet/T.Viewer/pulls)을 코드 리뷰해 주셔도 됩니다.

직접 코드를 수정하시고 싶으시다면, 아래 가이드를 참고해주세요.
- [빌드하기](https://github.com/msaltnet/T.Viewer/wiki/%EB%B9%8C%EB%93%9C%ED%95%98%EA%B8%B0)

![Test Result](https://user-images.githubusercontent.com/9311990/89435160-77443a80-d77f-11ea-8b32-338b8bdfbc3d.PNG)

## 라이센스
본 프로젝트는 [MIT 라이센스](https://github.com/msaltnet/T.Viewer/blob/master/LICENSE)의 오픈소스 프로젝트 입니다.

## Installation
### Linux
`tviewer-setup-{version}.AppImage` download and run

### Windows
`tviewer-setup-{version}.exe` download and install
[Features and User Guide](https://github.com/msaltnet/T.Viewer/wiki/Features-and-User-Guide)

## User Guide
❗ Check SDB connection with target device first.

1. Connection State Indicator
   - Connected also with power switch
1. Log Level Filter
   - Verbose/Debug/Info/Warning/Error/Fatal
   - Output the upper level including the selected level
   - Different color output according to log level
1. Tag Filter
   - Output matched tag log
   - Regular expression support
1. Message Filter
   - Output log containing the message
   - Regular expression support
1. Multi-Tab View
   - Independent filter option for each tab
1. Setting
   - Font size
   - After clear dlog buffer
   - dlog timestamp print

## Contributing
There are many ways in which you can participate in the project, for example:

- [Submit bugs and feature requests](https://github.com/msaltnet/T.Viewer/issues), and help us verify as they are checked in
- Review [source code changes]((https://github.com/msaltnet/T.Viewer/pulls))

If you are interested in fixing issues and contributing directly to the code base, please see the following:
- [Build and Run](https://github.com/msaltnet/T.Viewer/wiki/Build-and-Run)

## License
Licensed under the MIT license.
