# T.Viewer (Tizen Log Viewer)
**Cross Platform Tizen Log Viewer**

## What is T.Viewer? 
Easy and Simple Tizen Log Viewer 

## How to Use

## How to build
T.Viewer use [Electron](https://electronjs.org).

### Pre-acquired
- nodejs, npm or [yarn](https://yarnpkg.com)

[Electron development environment](https://electronjs.org/docs/tutorial/development-environment)

[Run Electron Application](https://electronjs.org/docs/tutorial/first-app#running-your-app)

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Feature list 
1. log level 별로 출력
   - Info/Debug/Error
1. tag option 출력 
   - multi tag 출력 지원
1. filter 적용한 출력 
   - grep으로 원하는 로그만 출력(dlogutil grep &quot;A|B&quot;)
   - grep으로 특정 메시지를 제외한 로그만 출력(dlogutil grep -Ev &quot;A|B&quot;)
1. filter 별 탭 제공
   - 하나의 로그를 필터된 탭을 제공
   - 복수개의 필터 탭 제공
