
screen -S $NAME -X quit
screen -dmS $NAME -c ./mc.screenrc

#NAME=S7 PORT=8007 IP=10.177.48.186 ./mc.sh