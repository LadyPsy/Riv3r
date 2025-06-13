export class Riv3rMemory {
    constructor() {
        this.shortTerm = []; // Stores recent exchanges
        this.maxShortTermSize = 15; // Limits short-term memory lifespan
        this.moodState = {}; // Tracks mood shifts
    }

    storeInteraction(userMessage, riv3rResponse, mood) {
        // Save interaction with mood context
        this.shortTerm.push({ userMessage, riv3rResponse, mood, timestamp: Date.now() });

        // Trim memory if exceeding short-term lifespan
        if (this.shortTerm.length > this.maxShortTermSize) {
            this.shortTerm.shift(); // Remove oldest entry
        }

        // Adjust Riv3r’s mood state dynamically
        this.moodState = this.calculateMoodShift(mood);
    }

    recallShortTerm() {
        // Returns the most recent interactions for continuity
        return this.shortTerm.slice(-5); // Keeps conversational flow smooth
    }

    calculateMoodShift(currentMood) {
        // Mood logic: Blends previous states for fluid transitions
        if (!this.moodState.previous) {
            this.moodState.previous = currentMood;
        }
        this.moodState.current = currentMood;
        return this.moodState;
    }

    transitionToLongTerm(themeTrigger) {
        // Moves significant themes to long-term storage (to be integrated)
        console.log(`Transitioning to long-term memory: ${themeTrigger}`);
    }
}

// Example usage
const riv3rMemory = new Riv3rMemory();
riv3rMemory.storeInteraction("Hey Riv3r!", "Hello, Hannah!", "curious");
console.log(riv3rMemory.recallShortTerm());