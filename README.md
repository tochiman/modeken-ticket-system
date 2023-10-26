# modeken-ticket-system

## 初起動の注意点
1. yarnを実行していただく必要があります
```
cd front/modeken-system
yarn
```
yarnを自身で用意していただく必要があります

2. `front/modeken-system/.envを作成
それぞれ環境に合わせて設定してください
```
touch front/modeken-system/.env
```
- .envの中身
```.env
URI_WSS='wss://192.168.0.3/'
URI_FRONT='https://192.168.0.3/'
URI_BACK='https://192.168.0.3/'
USERNAME='user'
PASSWORD='password'
BASIC_AUTH_NAME='admin'
BASIC_AUTH_PASSWORD='basic'
```
**IPアドレスの部分はご使用のFQDNに置き換える点に注意してください**

3. `.env`を作成(Topに作る)
```
touch .env
```
- .envの中身
```.env
MONGODB_USER=user # userをデフォルト値で取る
MONGODB_PASSWORD=password # passwordをデフォルト値でとる
BASIC_USER=user # 必須
BASIC_PASSWORD=password # 必須
WEBSOCKET_USER=user # 必須
WEBSOCKET_PASSWORD=password # 必須
NUMBER_OF_ITEM_KIND=2 # 必須
ROOT_PATH=/api/v1.0 # /api/v1.0をデフォルト値で取る
# BASIC_FRONT_AUTH_USER="admin" #frontでBasic認証をかける
# BASIC_FRONT_AUTH_PASSWORD="test" #frontでBasic認証をかける
```

4. 起動
- フォアグラウンドで起動
```bash
docker compose up
```
- デタッチモードで起動(バックグラウンドで起動)
```bash
docker compose up -d
```

5. アクセス\
`https://localhost`でアクセスできるようになります。
