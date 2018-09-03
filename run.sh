control_c() {
    pkill node server.js
    exit
}

trap control_c SIGINT

heroku local &
yarn client

