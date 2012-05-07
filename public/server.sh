#!/bin/bash

PORT=2600
if [[ $1 =~ ^[0-9]+$ ]]
  then PORT=$1
fi

python -m SimpleHTTPServer $PORT
