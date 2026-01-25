import "./IntroPage.css";

interface IntroPageProps {
  onStart: () => void;
}

export default function IntroPage({ onStart }: IntroPageProps) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="intro-page">
      {/* Bouton Plein écran en haut à droite */}
      <button
        onClick={toggleFullscreen}
        className="intro-fullscreen-button"
        aria-label="Plein écran"
      >
        ⛶
      </button>

      {/* Annotation pour le bouton plein écran */}
      <div className="fullscreen-annotation">
        <p className="annotation-text">Pensez à mettre en plein écran !</p>
        <svg
          className="arrow-annotation"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arc de cercle (quart droit) */}
          <path
            d="M 10 90 Q 10 20, 80 10"
            stroke="#667eea"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          {/* Ailettes de la flèche */}
          <path
            d="M 80 10 L 70 8"
            stroke="#667eea"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 80 10 L 75 18"
            stroke="#667eea"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div className="intro-content">
        <p className="intro-welcome">
          Bienvenue dans le karaoké du morceau <strong>Métro</strong> (piste 6)
          de l'album <strong>Hawaï</strong> de <strong>Java</strong>.
        </p>

        <div className="intro-image-container" onClick={onStart}>
          <img
            src="/JAVA - HAWAÏ Jacket.jpg"
            alt="Java - Album Hawaï"
            className="intro-image"
          />
          <button
            className="intro-play-button"
            aria-label="Démarrer le karaoké"
          >
            <svg viewBox="0 0 24 24" className="play-icon">
              <path fill="currentColor" d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="intro-text">
          <div className="streaming-links">
            <p className="streaming-title">
              Allez écouter sur les plateformes :
            </p>
            <div className="streaming-buttons">
              <a
                href="https://www.deezer.com/us/album/101421"
                target="_blank"
                rel="noopener noreferrer"
                className="streaming-button deezer"
              >
                <svg viewBox="0 0 32 32" className="streaming-logo">
                  <path
                    fill="currentColor"
                    d="M15 30c0.5-0.5 1-2 1.5-4 0.5-2.5 1-5.5 1-8s-0.5-5.5-1-8c-0.5-2-1-3.5-1.5-4-0.5 0.5-1 2-1.5 4-0.5 2.5-1 5.5-1 8s0.5 5.5 1 8c0.5 2 1 3.5 1.5 4zM10.5 26c0.5-0.5 0.5-1.5 1-3.5 0.5-2 0.5-4.5 0.5-6.5s0-4.5-0.5-6.5c-0.5-2-0.5-3-1-3.5-0.5 0.5-0.5 1.5-1 3.5-0.5 2-0.5 4.5-0.5 6.5s0 4.5 0.5 6.5c0.5 2 0.5 3 1 3.5zM20.5 26c0.5-0.5 0.5-1.5 1-3.5 0.5-2 0.5-4.5 0.5-6.5s0-4.5-0.5-6.5c-0.5-2-0.5-3-1-3.5-0.5 0.5-0.5 1.5-1 3.5-0.5 2-0.5 4.5-0.5 6.5s0 4.5 0.5 6.5c0.5 2 0.5 3 1 3.5zM6 22c0.5-0.5 0.5-1.5 0.5-3 0.5-1.5 0.5-3 0.5-5s0-3.5-0.5-5c0-1.5-0.5-2.5-0.5-3-0.5 0.5-0.5 1.5-0.5 3 0 1.5-0.5 3-0.5 5s0 3.5 0.5 5c0.5 1.5 0.5 2.5 0.5 3zM25 22c0.5-0.5 0.5-1.5 0.5-3 0.5-1.5 0.5-3 0.5-5s0-3.5-0.5-5c0-1.5-0.5-2.5-0.5-3-0.5 0.5-0.5 1.5-0.5 3-0.5 1.5-0.5 3-0.5 5s0 3.5 0.5 5c0 1.5 0.5 2.5 0.5 3z"
                  />
                </svg>
                <span>Deezer</span>
              </a>

              <a
                href="https://open.spotify.com/album/4QLzc3ptCQ6XhVQD3MjkMV"
                target="_blank"
                rel="noopener noreferrer"
                className="streaming-button spotify"
              >
                <svg viewBox="0 0 24 24" className="streaming-logo">
                  <path
                    fill="currentColor"
                    d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
                  />
                </svg>
                <span>Spotify</span>
              </a>
            </div>
          </div>

          <div className="intro-credits">
            <p>
              Sur une idée originale et une implémentation de{" "}
              <a
                href="https://github.com/Mistouf/java-metro-karaoke"
                target="_blank"
                rel="noopener noreferrer"
              >
                Lionel Jourdan
              </a>
              .
            </p>
            <p className="intro-authorization">
              La demande auprès du groupe Java est en cours pour demander
              l'autorisation de diffusion sur ce site dédié...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
