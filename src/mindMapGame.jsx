import React, { useState, useRef, useEffect } from "react";
import "./index.css";

const translations = {
  title: {
    en: "Let's Make a Mind Map!",
    es: "¡Hagamos un mapa mental!",
  },
  instructions: {
    en: "Instructions:",
    es: "Instrucciones:",
  },
  step1: {
    en: "Think about what might happen in the story.",
    es: "Piensa en lo que podría pasar en la historia.",
  },
  step2: {
    en: "Write your ideas in the box below.",
    es: "Escribe tus ideas en el cuadro de abajo.",
  },
  step3: {
    en: 'Click "Add" to put your idea on the map.',
    es: 'Haz clic en "Agregar" para poner tu idea en el mapa.',
  },
  step4: {
    en: "Make as many predictions as you want!",
    es: "¡Haz tantas predicciones como quieras!",
  },
  gotIt: {
    en: "Got it!",
    es: "¡Entendido!",
  },
  inputPlaceholder: {
    en: "Write your prediction here",
    es: "Escribe tu predicción aquí",
  },
  add: {
    en: "Add",
    es: "Agregar",
  },
  centerBubble: {
    en: "Charlie in Colby",
    es: "Charlie en Colby",
  },
  emojiHints: {
    en: "Emoji Hints:",
    es: "Pistas de emojis:",
  },
  translate: {
    en: "Traducir al español",
    es: "Translate to English",
  },
  connect: {
    en: "Connect ideas",
    es: "Conectar ideas",
  },
  stopConnecting: {
    en: "Stop connecting",
    es: "Dejar de conectar",
  },
  useEmojiHint: {
    en: "Hover over the emojis for story clues. Use these to make your predictions!",
    es: "Pasa el cursor sobre los emojis para ver pistas de la historia. ¡Úsalas para hacer tus predicciones!",
  },
  emojiConcepts: {
    "👨‍👩‍👧": {
      en: "Charlie's family has problems",
      es: "La familia de Charlie tiene problemas",
    },
    "🏠": {
      en: "Charlie moves to a new home",
      es: "Charlie se muda a una nueva casa",
    },
    "🏫": {
      en: "Charlie starts at a new school",
      es: "Charlie comienza en una nueva escuela",
    },
    "👫": {
      en: "Charlie might make new friends",
      es: "Charlie podría hacer nuevos amigos",
    },
    "🌄": {
      en: "Charlie has new adventures",
      es: "Charlie tiene nuevas aventuras",
    },
  },
};

const MindMapGame = () => {
  const [predictions, setPredictions] = useState([]);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [language, setLanguage] = useState("en");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connections, setConnections] = useState([]);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const [hoveredEmoji, setHoveredEmoji] = useState(null);

  const mindMapRef = useRef(null);
  const linesRef = useRef(null);

  const handleAddPrediction = () => {
    if (currentPrediction.trim()) {
      setPredictions([
        ...predictions,
        {
          id: Date.now(),
          text: currentPrediction.trim(),
          x: 50,
          y: 50,
        },
      ]);
      setCurrentPrediction("");
    }
  };

  const handleRemovePrediction = (id) => {
    setPredictions(predictions.filter((pred) => pred.id !== id));
    setConnections(
      connections.filter((conn) => conn.from !== id && conn.to !== id)
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "es" : "en");
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
  };

  const handleDrag = (e, id) => {
    if (mindMapRef.current) {
      const rect = mindMapRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setPredictions(
        predictions.map((pred) => (pred.id === id ? { ...pred, x, y } : pred))
      );
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData("text"));
    const rect = mindMapRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPredictions(
      predictions.map((pred) => (pred.id === id ? { ...pred, x, y } : pred))
    );
  };

  const toggleConnecting = () => {
    setIsConnecting(!isConnecting);
    setConnectingFrom(null);
  };

  const handlePredictionClick = (id) => {
    if (isConnecting) {
      if (connectingFrom === null) {
        setConnectingFrom(id);
      } else if (connectingFrom !== id) {
        setConnections([...connections, { from: connectingFrom, to: id }]);
        setConnectingFrom(null);
      }
    }
  };

  useEffect(() => {
    const drawLines = () => {
      const canvas = linesRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "#4b0082";
      ctx.lineWidth = 2;

      connections.forEach((conn) => {
        const from = predictions.find((p) => p.id === conn.from);
        const to = predictions.find((p) => p.id === conn.to);
        if (from && to) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.stroke();
        }
      });
    };

    drawLines();
  }, [connections, predictions]);

  return (
    <div className="mind-map-game">
      <h1>{translations.title[language]}</h1>

      <button onClick={toggleLanguage} className="language-toggle">
        {translations.translate[language]}
      </button>

      {showInstructions && (
        <div className="instructions">
          <h2>{translations.instructions[language]}</h2>
          <ol>
            <li>{translations.step1[language]}</li>
            <li>{translations.step2[language]}</li>
            <li>{translations.step3[language]}</li>
            <li>{translations.step4[language]}</li>
          </ol>
          <button onClick={() => setShowInstructions(false)}>
            {translations.gotIt[language]}
          </button>
        </div>
      )}

      <div className="prediction-input">
        <input
          type="text"
          value={currentPrediction}
          onChange={(e) => setCurrentPrediction(e.target.value)}
          placeholder={translations.inputPlaceholder[language]}
        />
        <button onClick={handleAddPrediction}>
          {translations.add[language]}
        </button>
      </div>

      <button onClick={toggleConnecting} className="connect-toggle">
        {isConnecting
          ? translations.stopConnecting[language]
          : translations.connect[language]}
      </button>

      <div
        className="mind-map"
        ref={mindMapRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <canvas ref={linesRef} className="connections-canvas" />

        <div className="center-bubble">
          {translations.centerBubble[language]}
        </div>
        {predictions.map((prediction) => (
          <div
            key={prediction.id}
            className="prediction-bubble"
            style={{ left: prediction.x, top: prediction.y }}
            draggable
            onDragStart={(e) => handleDragStart(e, prediction.id)}
            onDrag={(e) => handleDrag(e, prediction.id)}
            onClick={() => handlePredictionClick(prediction.id)}
          >
            {prediction.text}
            <button onClick={() => handleRemovePrediction(prediction.id)}>
              ✖️
            </button>
          </div>
        ))}
      </div>

      <div className="emoji-hints">
        <p>Pistas de emojis (Emoji Hints):</p>
        <span role="img" aria-label="family">
          👨‍👩‍👧
        </span>
        <span role="img" aria-label="house">
          🏠
        </span>
        <span role="img" aria-label="school">
          🏫
        </span>
        <span role="img" aria-label="friends">
          👫
        </span>
        <span role="img" aria-label="adventure">
          🌄
        </span>
      </div>

      <div className="emoji-hints">
        <p>{translations.emojiHints[language]}</p>
        <p className="emoji-instruction">
          {translations.useEmojiHint[language]}
        </p>
        <div className="emoji-container">
          {Object.entries(translations.emojiConcepts).map(
            ([emoji, concept]) => (
              <div
                key={emoji}
                className="emoji-item"
                onMouseEnter={() => setHoveredEmoji(emoji)}
                onMouseLeave={() => setHoveredEmoji(null)}
              >
                <span role="img" aria-label={concept[language]}>
                  {emoji}
                </span>
                {hoveredEmoji === emoji && (
                  <div className="emoji-tooltip">{concept[language]}</div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMapGame;
