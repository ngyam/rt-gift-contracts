#!/usr/bin/env bash

ganache_running() {
  nc -z localhost "$1"
}

GANACHE_PORT=${GANACHE_PORT:-8545}

if ganache_running ${GANACHE_PORT}; then
    lsof -i tcp:${GANACHE_PORT} | awk 'NR!=1 {print $2}' | xargs kill
fi