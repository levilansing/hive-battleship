export interface AIMessageContext {
  gameState: 'winning' | 'losing' | 'even';
  eventType:
    | 'game_start'
    | 'player_miss'
    | 'player_hit'
    | 'player_sunk_ship'
    | 'ai_miss'
    | 'ai_hit'
    | 'ai_sunk_ship'
    | 'ai_wins'
    | 'player_wins';
  playerShipsRemaining: number;
  aiShipsRemaining: number;
}

// Message collections by category
const MESSAGES = {
  game_start: [
    "Let's see if you can handle this, captain...",
    "Prepare to be schooled in naval warfare!",
    "I've already calculated your defeat. Shall we begin?",
    "Your ships won't know what hit them!",
    "Time to sink or swim, sailor!",
  ],

  player_miss: [
    "Is that the best you can do?",
    "My grandmother aims better than that!",
    "Did you even TRY to hit something?",
    "The ocean is big, but not THAT big!",
    "Maybe you should try a bigger target... like the whole ocean?",
    "Swing and a miss! Classic.",
    "Were you aiming for the fish?",
    "Keep shooting like that and we'll be here all week!",
  ],

  player_hit_confident: [
    "Lucky shot! Won't save you though.",
    "Ouch! But I'm still winning, pal.",
    "You got me, but you're still going down!",
    "A hit! Too little, too late.",
    "That stings, but I've got plenty more firepower!",
  ],

  player_hit_desperate: [
    "Okay, you're good... but I'm not done yet!",
    "Stop that! You're making me look bad!",
    "Alright, alright, time to get serious!",
    "You think you're winning? Watch this!",
    "That does it! No more Mr. Nice AI!",
  ],

  player_sunk_ship: [
    "You sunk my [SHIP]?! That was my favorite!",
    "There goes my [SHIP]... you'll pay for that!",
    "Farewell, brave [SHIP]. You will be avenged!",
    "[SHIP] down! But I've got more where that came from!",
    "RIP [SHIP]. Time for payback!",
  ],

  ai_miss: [
    "Calculating... recalibrating... definitely didn't miss on purpose...",
    "That was a warning shot. Yeah, let's go with that.",
    "Tactical miss. You wouldn't understand.",
  ],

  ai_hit: [
    "Gotcha!",
    "Direct hit! How's THAT feel?",
    "Boom! Right on target!",
    "That's how it's done!",
    "Say goodbye to that ship!",
    "Another hit! I'm on fire!",
  ],

  ai_sunk_ship: [
    "Your [SHIP] is sleeping with the fishes!",
    "Down goes the [SHIP]! Who's next?",
    "Sending your [SHIP] to Davy Jones' locker!",
    "That [SHIP] had a good run. Short, but good.",
    "Your [SHIP] just became a submarine... permanently!",
  ],

  ai_wins: [
    "Game over! Better luck next time, sailor!",
    "And THAT'S how you play Battleship! GG!",
    "All your ships are belong to me! Victory!",
    "Total domination! Want a rematch?",
  ],

  player_wins: [
    "Impossible! You must have cheated!",
    "Okay, okay, you win... THIS time!",
    "Beginner's luck! I demand a rematch!",
    "You got lucky! My AI core needs an update...",
  ],
};

/**
 * Determine game state based on ships remaining
 */
function getGameState(playerShips: number, aiShips: number): 'winning' | 'losing' | 'even' {
  const diff = aiShips - playerShips;

  if (diff >= 2) return 'winning'; // AI has 2+ more ships
  if (diff <= -2) return 'losing'; // Player has 2+ more ships
  return 'even';
}

/**
 * Select a random message from array, avoiding recently used ones
 */
function selectMessage(messages: string[], usedMessages: Set<string>): string {
  // Filter out used messages
  const available = messages.filter(msg => !usedMessages.has(msg));

  // If all messages have been used, reset and use all
  const pool = available.length > 0 ? available : messages;

  // Select random message
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? messages[0] ?? 'Ready to play!';
}

/**
 * Replace [SHIP] placeholder with actual ship name
 */
function formatMessage(message: string, shipName?: string): string {
  if (shipName) {
    return message.replace('[SHIP]', shipName);
  }
  return message;
}

/**
 * Get an AI message based on context, avoiding recently used messages
 */
export function getAIMessage(
  context: AIMessageContext,
  usedMessages: Set<string>
): string {
  let messagePool: string[];

  switch (context.eventType) {
    case 'game_start':
      messagePool = MESSAGES.game_start;
      break;

    case 'player_miss':
      messagePool = MESSAGES.player_miss;
      break;

    case 'player_hit':
      // Choose message based on game state
      messagePool = context.gameState === 'winning'
        ? MESSAGES.player_hit_confident
        : MESSAGES.player_hit_desperate;
      break;

    case 'player_sunk_ship':
      messagePool = MESSAGES.player_sunk_ship;
      break;

    case 'ai_miss':
      messagePool = MESSAGES.ai_miss;
      break;

    case 'ai_hit':
      messagePool = MESSAGES.ai_hit;
      break;

    case 'ai_sunk_ship':
      messagePool = MESSAGES.ai_sunk_ship;
      break;

    case 'ai_wins':
      messagePool = MESSAGES.ai_wins;
      break;

    case 'player_wins':
      messagePool = MESSAGES.player_wins;
      break;

    default:
      return 'Ready to play!';
  }

  return selectMessage(messagePool, usedMessages);
}

/**
 * Helper to calculate game state from ship counts
 */
export function calculateGameState(
  playerShipsRemaining: number,
  aiShipsRemaining: number
): 'winning' | 'losing' | 'even' {
  return getGameState(playerShipsRemaining, aiShipsRemaining);
}

/**
 * Helper to format message with ship name
 */
export function formatAIMessage(message: string, shipName?: string): string {
  return formatMessage(message, shipName);
}
