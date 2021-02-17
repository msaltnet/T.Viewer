# How to Build (Korean)

T.Viewer는 [Electron](https://electronjs.org), [Vuetify](https://vuetifyjs.com/) 그리고 [Ace Editor](https://ace.c9.io/)을 사용하였습니다.

## 사전준비
T.Viewer 빌드를 위해서 필요한 툴은 다음과 같습니다.

- Git
- Node.JS
- Yarn or NPM

repogitory clone 후에 NPM 명령어를 통해서 의존성을 갖는 패키지들을 설치할 수 있습니다.

```
cd T.Viewer
npm install
```

## 빌드
개발 중에는 아래 커맨드를 통해서 빌드, 실행이 가능합니다. 수정 사항을 감지해 자동으로 적용됩니다.

```
cd T.Viewer
npm run serve
```

특히, 연결 기기가 없이 개발 중에는 아래 명령어를 통해, Fake 로그 생성기를 사용해서 Tizen 기기와 연결 없이도 계발할 수 있습니다.

```
npm run serve-fake
```

최종 산출물을 생성하기 위해서는 아래의 명령어를 사용하여 빌드하셔도 됩니다.
```
cd T.Viewer
npm run build
```
![Build Result](https://user-images.githubusercontent.com/9311990/89435151-73b0b380-d77f-11ea-83dd-343c39ec2041.PNG)

## 단위 테스트
단위 테스트는 명령어 창에서 `npm run test:unit` 명령어를 통해서 간단하게 실행할 수 있습니다.

![Test Result](https://user-images.githubusercontent.com/9311990/89435160-77443a80-d77f-11ea-8b32-338b8bdfbc3d.PNG)

## Linting
Linting을 위해서 eslint를 사용하고 있습니다. 명령어 창에서 `npm run lint` 명령어로 실행 가능합니다.

## Continuous Integration
[travis-ci T.Viewer](https://travis-ci.org/github/msaltnet/T.Viewer)에서 CI가 작동하고 있습니다.

![T.Viewr Travis CI](https://user-images.githubusercontent.com/9311990/89435221-8f1bbe80-d77f-11ea-8c51-d69aaff47bfd.PNG)

# How to Build (English)
T.Viewer use [Electron](https://electronjs.org), [Vuetify](https://vuetifyjs.com/) and [Ace Editor](https://ace.c9.io/).

## Prerequisites
In order to download necessary tools, clone the repository, and install dependencies via `yarn` or `npm` you need network access.

You'll need the following tools:

- Git
- Node.JS
- Yarn or NPM

Install and build all of the dependencies using NPM:
```
cd T.Viewer
npm install
```

## Build
To test the changes you launch a development version of T.Viewer on the workspace T.Viewer, which you are currently editing.
```
cd T.Viewer
npm run serve
```

Especially, Without Tizen target device, to test application with fake log generator you can launch fake mode.
```
npm run serve-fake
```

To create excutable production.
```
cd T.Viewer
npm run build
```

![Build Result](https://user-images.githubusercontent.com/9311990/89435151-73b0b380-d77f-11ea-83dd-343c39ec2041.PNG)

## Lints and run unit test
To verify source code, run test by bellow command simply.
```
npm run test
```

## Unit Testing
Run the tests directly from a terminal by running `npm run test:unit` from the T.Viewer folder.

![Test Result](https://user-images.githubusercontent.com/9311990/89435160-77443a80-d77f-11ea-8b32-338b8bdfbc3d.PNG)

## Linting
We use eslint for linting our sources. You can run eslint across the sources by calling `npm run lint` from a terminal or command prompt.

To lint the source as you make changes you can install the eslint extension.

## Continuous Integration
[travis-ci T.Viewer](https://travis-ci.org/github/msaltnet/T.Viewer) is working with the repository.

![T.Viewr Travis CI](https://user-images.githubusercontent.com/9311990/89435221-8f1bbe80-d77f-11ea-8c51-d69aaff47bfd.PNG)
