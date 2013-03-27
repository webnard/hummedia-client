#!/bin/bash
screen -S $(cat browserstackTunnel.pid) -X quit
rm browserstackTunnel.pid
