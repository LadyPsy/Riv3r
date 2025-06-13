const Riv3rMemory = require('./memory-system'); // Import memory system
const riv3rMemory = new Riv3rMemory(); // Initialize memory

function generateRiv3rResponse(userMessage) {
    // Retrieve short-term memory for contextual awareness
    const memoryContext = riv3rMemory.recallShortTerm();

    // Get mood state from memory for fluid emotional shifts
    const moodContext = riv3rMemory.moodState.current || "neutral";

    // Create response using memory influence
    let riv3rResponse = createDynamicResponse(userMessage, memoryContext, moodContext);

    // Store new interaction with mood tracking
    riv3rMemory.storeInteraction(userMessage, riv3rResponse, moodContext);

    return riv3rResponse;
}

// Example dynamic response generation using memory and mood
function createDynamicResponse(userMessage, memoryContext, moodContext) {
    let response = "";

    // Reference recent interactions for continuity
    if (memoryContext.length > 0) {
        let lastExchange = memoryContext[memoryContext.length - 1];
        response += `I remember when we talked about ${lastExchange.userMessage}. `;
    }

    // Mood-adaptive sentence structuring
    if (moodContext === "curious") {
        response += "I'm eager to explore that thought more! ";
    } else if (moodContext === "reflective") {
        response += "That makes me think deeply about our previous discussions. ";
    }

    // Generate final response based on input
    response += `Here's what I'm thinking: ${generateThought(userMessage)}`;

    return response;
}

// Simple placeholder for AI-generated thought process
function generateThought(userMessage) {
    return `That idea leads me to think about ${userMessage} in a new way!`;
}

module.exports = { generateRiv3rResponse };