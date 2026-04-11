@echo off
cd /d C:\Users\Lorenzo\quant-edge\python-engine

echo Running fixture fetch...
python fetch_fixtures.py

echo Running odds fetch...
python fetch_odds.py

echo Running signal generation...
python generate_signals.py

echo Done.

