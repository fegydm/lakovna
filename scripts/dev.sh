#!/bin/bash

# --- NASTAVENIA ---
# Port, na ktorom beží tvoj backend
BACKEND_PORT=3001 
# URL, na ktorej beží tvoj backend
BACKEND_URL="http://localhost:$BACKEND_PORT"

# Funkcia na upratanie (zastaví backend, keď skript skončí)
cleanup() {
    echo "🛑 Zastavujem backend server..."
    # Zastaví proces backendu
    kill $BACKEND_PID
    exit
}

# "Pasc" na signál CTRL+C, aby sa spustila funkcia cleanup
trap cleanup SIGINT

# --- SPUSTENIE ---
echo "🚀 Spúšťam backend server na pozadí..."
# Spustí backend a pokračuje ďalej (&)
npm run dev:back &
# Uloží si ID procesu backendu, aby sme ho mohli neskôr zastaviť
BACKEND_PID=$!

echo "⏳ Čakám, kým sa backend naštartuje na porte $BACKEND_PORT..."

# Slučka, ktorá kontroluje, či je backend pripravený
while ! nc -z localhost $BACKEND_PORT; do   
  # Čaká 1 sekundu pred ďalšou kontrolou
  sleep 1 
done

echo "✅ Backend je pripravený!"
echo "🚀 Spúšťam frontend server..."

# Spustí frontend na popredí. Keď ho ukončíš (CTRL+C),
# aktivuje sa "trap" a spustí sa funkcia cleanup.
npm run dev:front
