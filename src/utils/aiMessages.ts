/**
 * AI Message System for Battleship
 * Provides varied, snarky messages for different game events
 */

export type MessageType =
  | 'gameStart'
  | 'playerMiss'
  | 'playerHit'
  | 'playerSinkShip'
  | 'aiHit'
  | 'aiMiss'
  | 'aiSinkShip'
  | 'gameWin'
  | 'gameLose'
  | 'alreadyGuessed';

interface MessageCollection {
  gameStart: string[];
  playerMiss: string[];
  playerHit: string[];
  playerSinkShip: string[];
  aiHit: string[];
  aiMiss: string[];
  aiSinkShip: string[];
  gameWin: string[];
  gameLose: string[];
  alreadyGuessed: string[];
}

const messages: MessageCollection = {
  gameStart: [
    "Let's see if you can handle this, captain...",
    "Hope you brought your A-game. You'll need it.",
    "I've been practicing. Have you?",
    "Ready to lose? I mean... ready to play?",
    "This should be entertaining... for me.",
  ],

  playerMiss: [
    "Is that the best you can do?",
    "Missed! Did you close your eyes?",
    "Even a random number generator would do better.",
    "Swing and a miss! Classic.",
    "That wasn't even close. Embarrassing.",
    "Are you aiming for the ocean floor?",
    "I've seen better shots from a blindfolded toddler.",
    "Missing is your strategy? Bold choice.",
  ],

  playerHit: [
    "Lucky shot!",
    "Okay, that actually hurt a bit.",
    "Beginner's luck, clearly.",
    "Don't get cocky, it was just one hit.",
    "Ow. But I've got plenty more ships.",
    "You found one! Only took you forever.",
    "A hit? Impossible! ...Fine, yes, a hit.",
  ],

  playerSinkShip: [
    "You sank my... well played, I guess.",
    "Alright, alright. You got one. Don't celebrate too hard.",
    "Down goes another one. This isn't over!",
    "Impressive. For a human.",
    "My ship! You'll pay for that!",
    "That was my favorite ship. Now I'm mad.",
  ],

  aiHit: [
    "Gotcha! Did that sting?",
    "Direct hit! I'm just that good.",
    "Your ship says 'ouch'!",
    "Boom! Mark that one down.",
    "And THAT is how it's done.",
    "Target acquired and destroyed!",
    "Is it getting warm in here? Oh wait, that's your ship burning.",
  ],

  aiMiss: [
    "A tactical miss. I'm lulling you into a false sense of security.",
    "That was just a warning shot.",
    "Can't hit them all... wait, yes I can. Next time.",
    "Calculating... adjusting... you're still doomed.",
    "Just giving you false hope. You're welcome.",
  ],

  aiSinkShip: [
    "Another one bites the dust! Your ship, specifically.",
    "That's another ship of yours sleeping with the fishes!",
    "Down you go! This is too easy.",
    "Sunk! I should feel bad, but I don't.",
    "Your fleet is looking a bit... sparse.",
    "Wave goodbye to that ship!",
  ],

  gameWin: [
    "Victory is mine! Better luck next time, captain.",
    "I win! Was there ever any doubt?",
    "You fought well... for a human.",
    "Game over. I reign supreme!",
    "Another win for the AI overlords!",
    "Thanks for playing! Same time tomorrow?",
  ],

  gameLose: [
    "You... you actually won. How?",
    "Impossible! I demand a rematch!",
    "Congratulations, captain. You earned it.",
    "Well played. This time.",
    "Enjoy your victory. It won't happen again.",
  ],

  alreadyGuessed: [
    "You already tried that spot, captain!",
    "Short-term memory issues? You guessed that already.",
    "That's a repeat. Pick a new spot.",
    "We've been through this. Try somewhere new.",
    "Getting forgetful? That's already been hit.",
  ],
};

/**
 * Tracks which messages have been used recently to avoid repetition
 */
const recentlyUsed: Record<MessageType, Set<number>> = {
  gameStart: new Set(),
  playerMiss: new Set(),
  playerHit: new Set(),
  playerSinkShip: new Set(),
  aiHit: new Set(),
  aiMiss: new Set(),
  aiSinkShip: new Set(),
  gameWin: new Set(),
  gameLose: new Set(),
  alreadyGuessed: new Set(),
};

/**
 * Gets a random message of the specified type, avoiding recent repetitions
 */
export function getMessage(type: MessageType): string {
  const messageList = messages[type];
  const used = recentlyUsed[type];

  // If we've used all messages, clear the history
  if (used.size >= messageList.length) {
    used.clear();
  }

  // Find an unused message
  let attempts = 0;
  let index: number;

  do {
    index = Math.floor(Math.random() * messageList.length);
    attempts++;

    // Prevent infinite loops - if we can't find unused after many attempts, just use random
    if (attempts > 20) {
      break;
    }
  } while (used.has(index) && used.size < messageList.length);

  // Mark this message as used
  used.add(index);

  // Return the message, with a fallback to the first message if index is invalid
  const message = messageList[index];
  return message || messageList[0] || 'Ready for battle!';
}

/**
 * Resets the message history (useful when starting a new game)
 */
export function resetMessageHistory(): void {
  Object.keys(recentlyUsed).forEach(key => {
    recentlyUsed[key as MessageType].clear();
  });
}

/**
 * Gets a coordinate string like "A5" from row/col
 */
export function getCoordinateString(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`;
}
