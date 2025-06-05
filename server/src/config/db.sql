CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE login_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT REFERENCES users(user_id),
    token TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE password_reset_tokens (
    token UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INT REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
);

CREATE TABLE stations (
  station_id SERIAL PRIMARY KEY,
  station_name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE minigames (
  minigame_id SERIAL PRIMARY KEY,
  station_id INT REFERENCES stations(station_id),
  game_name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE user_progress (
  progress_id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
  station_id INT REFERENCES stations(station_id),
  minigame_id INT REFERENCES minigames(minigame_id),
  completed BOOLEAN DEFAULT FALSE,
  score INT,
  completed_at TIMESTAMP
);

