# 소스코드를 빌드하기 위한 베이스
FROM node:24-alpine AS builder

# 작업할 디렉토리 설정
WORKDIR /app

# yarn v4 활성화
RUN npm i -g corepack
RUN corepack enable

# 의존성 파일 복사
COPY package.json yarn.lock .yarnrc.yml ./

# 의존성 설치
RUN yarn install --immutable

# 소스코드 복사
COPY . .

# 환경변수
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# 빌드
RUN yarn build

###############################

# 실제 이미지에 들어갈 베이스
FROM nginx:alpine AS production

# 빌드 결과 가져오기(위에서 설정한 AS '~'와 동일해야 함)
COPY --from=builder /app/dist /usr/share/nginx/html

# 컨테이너에서 열어줘야할 포트
EXPOSE 80

# 이미지가 컨테이너로 동작할 때 실행할 명령어
# 리스트를 이용해서 명령어, 옵션, parameter를 입력
CMD ["nginx", "-g", "daemon off;"]